import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import jwt_decode from 'jwt-decode'

interface AuthContextType {
  user: { id: string; email: string } | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)

  const loginFn = async (email: string, password: string) => {
    const { login } = await import('../services/authService')
    const token = await login(email, password)
    const payload = jwt_decode<{ sub: string; email: string }>(token)
    setUser({ id: payload.sub, email: payload.email })
  }

  const logoutFn = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const payload = jwt_decode<{ sub: string; email: string }>(token)
        setUser({ id: payload.sub, email: payload.email })
      } catch {
        logoutFn()
      }
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, login: loginFn, logout: logoutFn }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
