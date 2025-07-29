"use client"

import { renderHook, act } from "@testing-library/react"
import { useAuth } from "../../../hooks/useAuth"
import * as api from "../../../services/api"
import jest from "jest" // Declare the jest variable

// Mock the API module
jest.mock("../../../services/api")

describe("useAuth Hook", () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  test("should initialize with no user when no token in localStorage", () => {
    const { result } = renderHook(() => useAuth())

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.isLoading).toBe(false)
  })

  test("should initialize with user when token exists in localStorage", () => {
    localStorage.setItem("token", "mock-token")

    const { result } = renderHook(() => useAuth())

    expect(result.current.user).toEqual({ token: "mock-token" })
    expect(result.current.isAuthenticated).toBe(true)
  })

  test("should login successfully", async () => {
    const mockResponse = {
      token: "new-token",
      user: { id: "1", email: "test@example.com" },
    }
    api.login.mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.login({ email: "test@example.com", password: "password" })
    })

    expect(result.current.user).toEqual(mockResponse.user)
    expect(result.current.isAuthenticated).toBe(true)
    expect(localStorage.getItem("token")).toBe("new-token")
  })

  test("should handle login error", async () => {
    const mockError = new Error("Invalid credentials")
    api.login.mockRejectedValue(mockError)

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      try {
        await result.current.login({ email: "test@example.com", password: "wrong" })
      } catch (error) {
        // Expected to throw
      }
    })

    expect(result.current.error).toBe("Invalid credentials")
    expect(result.current.user).toBeNull()
  })

  test("should logout successfully", () => {
    localStorage.setItem("token", "mock-token")
    const { result } = renderHook(() => useAuth())

    act(() => {
      result.current.logout()
    })

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(localStorage.getItem("token")).toBeNull()
  })
})
