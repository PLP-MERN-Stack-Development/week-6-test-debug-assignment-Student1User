"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { login } from "../services/api"

const Login = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setIsLoading(true)
    setLoginError("")

    try {
      const response = await login(data)
      localStorage.setItem("token", response.token)
      // Redirect or update app state
      console.log("Login successful:", response)
    } catch (error) {
      setLoginError(error.message || "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-form" data-testid="login-form">
      <h2>Login</h2>

      <form onSubmit={handleSubmit(onSubmit)} data-testid="login-form-element">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            data-testid="email-input"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && (
            <span className="error" data-testid="email-error">
              {errors.email.message}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            data-testid="password-input"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters" },
            })}
          />
          {errors.password && (
            <span className="error" data-testid="password-error">
              {errors.password.message}
            </span>
          )}
        </div>

        <button type="submit" disabled={isLoading} data-testid="login-button" className="btn btn-primary">
          {isLoading ? "Logging in..." : "Login"}
        </button>

        {loginError && (
          <div className="error-message" data-testid="login-error">
            {loginError}
          </div>
        )}
      </form>
    </div>
  )
}

export default Login
