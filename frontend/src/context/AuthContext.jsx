import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'

import {
  clearTokens,
  getAccessToken,
  getCurrentUser,
  getRefreshToken,
  loginUser,
  logoutUser,
  registerUser
} from '../services/authService'


const AuthContext =
  createContext(null)


export function AuthProvider({
  children
}) {
  const [user, setUser] =
    useState(null)

  const [loading, setLoading] =
    useState(true)


  useEffect(() => {
    restoreSession()
  }, [])


  async function restoreSession() {
    const accessToken =
      getAccessToken()

    const refreshToken =
      getRefreshToken()

    if (
      !accessToken &&
      !refreshToken
    ) {
      setLoading(false)

      return
    }

    try {
      const currentUser =
        await getCurrentUser()

      setUser(currentUser)
    } catch {
      clearTokens()

      setUser(null)
    } finally {
      setLoading(false)
    }
  }


  async function login(
    email,
    password
  ) {
    const data =
      await loginUser(
        email,
        password
      )

    setUser(data.user)

    return data.user
  }


  async function register(
    userData
  ) {
    const data =
      await registerUser(
        userData
      )

    setUser(data.user)

    return data.user
  }


  function logout() {
    logoutUser()

    setUser(null)
  }


  const isAuthenticated =
    Boolean(user)

  const isAdmin =
    user?.role === 'ADMIN'


  const value = {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout
  }


  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  )
}


export function useAuth() {
  const context =
    useContext(AuthContext)

  if (!context) {
    throw new Error(
      'useAuth doit être utilisé dans AuthProvider.'
    )
  }

  return context
}