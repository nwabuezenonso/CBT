export interface User {
  id: string
  email: string
  name: string
  role: "examiner" | "examinee"
  createdAt?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Login failed');
    }

    const data = await res.json();
    const user: User = {
        id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        createdAt: data.createdAt
    };
    
    return user;
  },

  register: async (email: string, password: string, name: string, role: "examiner" | "examinee"): Promise<User> => {
     const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, role }),
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Registration failed');
    }

    const data = await res.json();
    
    const user: User = {
        id: data._id || data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        createdAt: data.createdAt
    };

    return user;
  },

  logout: async () => {
    try {
        await fetch('/api/auth/logout', { method: 'POST' });
        // Optional: window.location.reload() or redirect managed by hook
    } catch (e) {
        console.error("Logout failed", e);
    }
  },

  getCurrentUser: async (): Promise<User | null> => {
    try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) return null;
        const data = await res.json();
        return data.id ? data : null; // data is the user object directly from our API map
    } catch (e) {
        return null;
    }
  },
}
