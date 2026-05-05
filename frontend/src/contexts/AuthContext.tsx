import {
  createContext,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  fetchCurrentUser,
  forgotPassword,
  loginWithPassword,
  logout as logoutRequest,
  registerWithPassword,
  resetPassword,
  type AuthUser,
  updateProfile,
} from '../services/auth'

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  signIn: (payload: { emailOrUsername: string; password: string }) => Promise<AuthUser>
  signUp: (payload: { username?: string; email: string; password: string; fullName?: string }) => Promise<AuthUser>
  signOut: () => Promise<void>
  saveProfile: (payload: { 
    username?: string; 
    fullName?: string; 
    phone?: string; 
    avatar?: string;
    aiTone?: string;
    aiLanguage?: string;
    aiResponseLength?: string;
    customInstructions?: string;
  }) => Promise<AuthUser>
  forgotPasswordFlow: (payload: { emailOrUsername: string }) => ReturnType<typeof forgotPassword>
  resetPasswordFlow: (payload: { token: string; newPassword: string }) => ReturnType<typeof resetPassword>
  refreshSession: () => Promise<AuthUser | null>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshSession = useCallback(async () => {
    try {
      const profile = await fetchCurrentUser()
      setUser(profile)
      return profile
    } catch {
      setUser(null)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refreshSession()
  }, [refreshSession])

  const signIn = useCallback(async (payload: { emailOrUsername: string; password: string }) => {
    const profile = await loginWithPassword(payload)
    setUser(profile)
    return profile
  }, [])

  const signUp = useCallback(
    async (payload: { username?: string; email: string; password: string; fullName?: string }) => {
      const profile = await registerWithPassword(payload)
      setUser(profile)
      return profile
    },
    [],
  )

  const signOut = useCallback(async () => {
    try {
      await logoutRequest()
    } finally {
      setUser(null)
    }
  }, [])

  const saveProfile = useCallback(
    async (payload: { 
      username?: string; 
      fullName?: string; 
      phone?: string; 
      avatar?: string;
      aiTone?: string;
      aiLanguage?: string;
      aiResponseLength?: string;
      customInstructions?: string;
    }) => {
      const profile = await updateProfile(payload)
      setUser(profile)
      return profile
    },
    [],
  )

  const forgotPasswordFlow = useCallback(
    async (payload: { emailOrUsername: string }) => forgotPassword(payload),
    [],
  )

  const resetPasswordFlow = useCallback(
    async (payload: { token: string; newPassword: string }) => resetPassword(payload),
    [],
  )

  const value = useMemo(
    () => ({
      user,
      loading,
      signIn,
      signUp,
      signOut,
      saveProfile,
      forgotPasswordFlow,
      resetPasswordFlow,
      refreshSession,
    }),
    [
      forgotPasswordFlow,
      loading,
      refreshSession,
      resetPasswordFlow,
      saveProfile,
      signIn,
      signOut,
      signUp,
      user,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
