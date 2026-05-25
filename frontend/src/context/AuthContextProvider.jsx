import React from 'react'
import AuthContext from './AuthContext'
import { useAuth } from '../store/AuthStore'

export default function AuthContextProvider({ children }) {
  const login = useAuth((state) => state.login)
  const logout = useAuth((state) => state.logout)
  const isAuthenticated = useAuth((state) => state.isAuthenticated)
  const currentUser = useAuth((state) => state.currentUser)
  const loading = useAuth((state) => state.loading)
  const error = useAuth((state) => state.error)
  const value = {
    login,
    logout,
    isAuthenticated,
    currentUser,
    loading,
    error,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
