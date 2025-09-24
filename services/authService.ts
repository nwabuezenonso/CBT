export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "student"
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

// Mock authentication functions using localStorage
export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const users = JSON.parse(localStorage.getItem("cbt_users") || "[]")
    const user = users.find((u: User) => u.email === email)

    if (!user) {
      throw new Error("User not found")
    }

    // In a real app, you'd verify the password hash
    localStorage.setItem("cbt_current_user", JSON.stringify(user))
    return user
  },

  register: async (email: string, password: string, name: string, role: "admin" | "student"): Promise<User> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const users = JSON.parse(localStorage.getItem("cbt_users") || "[]")

    if (users.find((u: User) => u.email === email)) {
      throw new Error("User already exists")
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role,
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    localStorage.setItem("cbt_users", JSON.stringify(users))
    localStorage.setItem("cbt_current_user", JSON.stringify(newUser))

    return newUser
  },

  logout: () => {
    localStorage.removeItem("cbt_current_user")
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem("cbt_current_user")
    return userStr ? JSON.parse(userStr) : null
  },
}
