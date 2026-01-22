import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface User {
  id: string
  email: string
  name: string
  phone: string
  firstName: string
  lastName: string
  kycStatus: string | null
}

interface Session {
  id: string
  userId: string
  expires: Date
}

interface AuthContextType {
  user: User | null
  session: Session | null
  status: 'loading' | 'authenticated' | 'unauthenticated'
  signIn: (credentials: {
    email?: string
    phone?: string
    password?: string
    otp?: string
    type: 'login' | 'register'
  }) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Alias for compatibility with existing code using useSession
export const useSession = () => {
  const { user, session, status } = useAuth()
  return {
    data: user ? { user, expires: session?.expires?.toISOString() } : null,
    status,
  }
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading')

  const fetchSession = async () => {
    try {
      const response = await fetch('/api/auth/session', {
        credentials: 'include',
      })
      const data = await response.json()

      if (data.user && data.session) {
        setUser(data.user)
        setSession({
          ...data.session,
          expires: new Date(data.session.expires),
        })
        setStatus('authenticated')
      } else {
        setUser(null)
        setSession(null)
        setStatus('unauthenticated')
      }
    } catch (error) {
      console.error('Failed to fetch session:', error)
      setUser(null)
      setSession(null)
      setStatus('unauthenticated')
    }
  }

  useEffect(() => {
    fetchSession()
  }, [])

  const signIn = async (credentials: {
    email?: string
    phone?: string
    password?: string
    otp?: string
    type: 'login' | 'register'
  }) => {
    try {
      const response = await fetch('/api/auth/sign-in/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (data.success && data.user) {
        setUser(data.user)
        setStatus('authenticated')
        return { success: true }
      }

      return { success: false, error: data.error || 'Authentication failed' }
    } catch (error: any) {
      return { success: false, error: error.message || 'Authentication failed' }
    }
  }

  const signOut = async () => {
    try {
      await fetch('/api/auth/sign-out', {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      setUser(null)
      setSession(null)
      setStatus('unauthenticated')
    }
  }

  const refresh = async () => {
    await fetchSession()
  }

  return (
    <AuthContext.Provider value={{ user, session, status, signIn, signOut, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
