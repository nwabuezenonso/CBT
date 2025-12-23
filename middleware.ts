import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyTokenEdge } from './lib/auth-middleware';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/auth/login', '/auth/register', '/'];

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Protected routes require authentication
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/api')) {
    // Skip auth check for public API routes and auth endpoints that handle their own verification
    if (
      pathname.startsWith('/api/auth/login') ||
      pathname.startsWith('/api/auth/register') ||
      pathname.startsWith('/api/auth/me') ||
      pathname.startsWith('/api/auth/logout') ||
      pathname.startsWith('/api/organizations')
    ) {
      return NextResponse.next();
    }

    if (!token) {
      console.log('[Middleware] No token found for path:', pathname);
      if (pathname.startsWith('/api')) {
        return NextResponse.json(
          { message: 'Unauthorized' },
          { status: 401 }
        );
      }
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    console.log('[Middleware] Token found for path:', pathname, '- Token (first 20 chars):', token.substring(0, 20));


    try {
      const decoded = await verifyTokenEdge(token);

      // Handle invalid token
      if (!decoded) {
        console.log('[Middleware] Token verification failed for path:', pathname);
        if (pathname.startsWith('/api')) {
          return NextResponse.json(
            { message: 'Invalid token' },
            { status: 401 }
          );
        }
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }

      // Block PENDING users from accessing protected routes
      if (decoded.status === 'PENDING') {
        if (pathname.startsWith('/api')) {
          return NextResponse.json(
            { message: 'Your account is pending approval. Please wait for admin approval.' },
            { status: 403 }
          );
        }
        // Redirect to a pending approval page
        return NextResponse.redirect(new URL('/auth/pending', request.url));
      }

      // Block REJECTED users
      if (decoded.status === 'REJECTED') {
        if (pathname.startsWith('/api')) {
          return NextResponse.json(
            { message: 'Your account has been rejected.' },
            { status: 403 }
          );
        }
        return NextResponse.redirect(new URL('/auth/rejected', request.url));
      }

      // Block SUSPENDED users
      if (decoded.status === 'SUSPENDED') {
        if (pathname.startsWith('/api')) {
          return NextResponse.json(
            { message: 'Your account has been suspended.' },
            { status: 403 }
          );
        }
        return NextResponse.redirect(new URL('/auth/suspended', request.url));
      }

      // Role-based route protection
      const role = decoded.role;

      // Super admin routes
      if (pathname.startsWith('/dashboard/admin') && role !== 'SUPER_ADMIN') {
        return NextResponse.json(
          { message: 'Access denied. Super admin only.' },
          { status: 403 }
        );
      }

      // Org admin routes
      if (pathname.startsWith('/dashboard/org-admin') && !['SUPER_ADMIN', 'ORG_ADMIN'].includes(role)) {
        return NextResponse.json(
          { message: 'Access denied. Organization admin only.' },
          { status: 403 }
        );
      }

      // Teacher/Examiner routes
      if (pathname.startsWith('/dashboard/examiner') && !['SUPER_ADMIN', 'ORG_ADMIN', 'EXAMINER'].includes(role)) {
        return NextResponse.json(
          { message: 'Access denied. Examiner only.' },
          { status: 403 }
        );
      }

      // Student routes
      if (pathname.startsWith('/dashboard/student') && role !== 'STUDENT') {
        return NextResponse.json(
          { message: 'Access denied. Student only.' },
          { status: 403 }
        );
      }

      // Add user info to request headers for API routes
      const response = NextResponse.next();
      response.headers.set('x-user-id', decoded.userId);
      response.headers.set('x-user-role', decoded.role);
      response.headers.set('x-user-org', decoded.organizationId || '');

      return response;
    } catch (error) {
      if (pathname.startsWith('/api')) {
        return NextResponse.json(
          { message: 'Invalid token' },
          { status: 401 }
        );
      }
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
};
