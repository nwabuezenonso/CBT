import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth'; // Careful: importing server code in middleware can be tricky if using Node modules.
// Better to just decode efficiently or use 'jose' library if verification is needed in edge.
// For now, simple check for cookie existence.

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const path = request.nextUrl.pathname;

  // Protect dashboard routes
  if (path.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Redirect authenticated users away from auth pages
  if ((path === '/login' || path === '/register') && token) {
    // We would ideally decode to know role, but for now redirect to a generic dashboard or check role via another call?
    // Let's just let them go to their role dashboard
    // We can't easily know role without decoding.
    // If not decoding, we might just lead them to a landing.
    
    // For simplicity:
    // return NextResponse.redirect(new URL('/dashboard/examinee', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
