"use client"

import { useState, useEffect } from "react"
import { login as apiLogin, register as apiRegister } from "../services/api"

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      // In a real app, you'd validate the token
      setUser({ token })
    }
    setIsLoading(false)
  }, [])

  const login = async (credentials) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiLogin(credentials)
      localStorage.setItem("token", response.token)
      setUser(response.user)
      return response
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiRegister(userData)
      localStorage.setItem("token", response.token)
      setUser(response.user)
      return response
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  return {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }
}
