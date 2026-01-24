import { createContext, useContext, ReactNode } from 'react'
import { authClient } from '@/lib/auth-client'

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

export const useSession = authClient.useSession

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { data: sessionData, isPending } = authClient.useSession()

  const user = sessionData?.user ? {
    id: sessionData.user.id,
    email: sessionData.user.email,
    name: sessionData.user.name,
    phone: (sessionData.user as any).phone || '',
    firstName: (sessionData.user as any).firstName || '',
    lastName: (sessionData.user as any).lastName || '',
    kycStatus: (sessionData.user as any).kycStatus || null,
  } : null

  const session = sessionData?.session ? {
    id: sessionData.session.id,
    userId: sessionData.session.userId,
    expires: new Date(sessionData.session.expiresAt),
  } : null

  const status = isPending ? 'loading' : (sessionData ? 'authenticated' : 'unauthenticated')

  const signIn = async (credentials: {
    email?: string
    phone?: string
    password?: string
    otp?: string
    type: 'login' | 'register'
  }) => {
    try {
      // Use better-auth native signIn endpoint
      if (credentials.password && credentials.email) {
        const { data, error } = await authClient.signIn.email({
          email: credentials.email,
          password: credentials.password,
        })
        
        if (error) {
          return { success: false, error: error.message || 'Authentication failed' }
        }
        
        return { success: true }
      }
      
      return { success: false, error: 'Email and password are required' }
    } catch (error: any) {
      return { success: false, error: error.message || 'Authentication failed' }
    }
  }

  const signOut = async () => {
    await authClient.signOut()
  }

  const refresh = async () => {
    // better-auth handles session refresh automatically
  }

  return (
    <AuthContext.Provider value={{ user, session, status, signIn, signOut, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
