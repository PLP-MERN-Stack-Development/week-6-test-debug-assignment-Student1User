"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { useMutation, useQuery } from "react-query"
import { createUser, updateUser, fetchUser } from "../services/api"

const UserForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm()

  // Fetch user data if editing
  const { data: user, isLoading } = useQuery(["user", id], () => fetchUser(id), { enabled: isEditing })

  // Set form values when user data is loaded
  React.useEffect(() => {
    if (user) {
      setValue("name", user.name)
      setValue("email", user.email)
    }
  }, [user, setValue])

  const mutation = useMutation(isEditing ? updateUser : createUser, {
    onSuccess: () => {
      navigate("/users")
    },
    onError: (error) => {
      console.error("Error saving user:", error)
    },
  })

  const onSubmit = (data) => {
    if (isEditing) {
      mutation.mutate({ id, ...data })
    } else {
      mutation.mutate(data)
    }
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="user-form" data-testid="user-form">
      <h2>{isEditing ? "Edit User" : "Create New User"}</h2>

      <form onSubmit={handleSubmit(onSubmit)} data-testid="user-form-element">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            data-testid="name-input"
            {...register("name", {
              required: "Name is required",
              minLength: { value: 2, message: "Name must be at least 2 characters" },
            })}
          />
          {errors.name && (
            <span className="error" data-testid="name-error">
              {errors.name.message}
            </span>
          )}
        </div>

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

        <div className="form-actions">
          <button type="submit" disabled={mutation.isLoading} data-testid="submit-button" className="btn btn-primary">
            {mutation.isLoading ? "Saving..." : isEditing ? "Update" : "Create"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/users")}
            data-testid="cancel-button"
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>

        {mutation.error && (
          <div className="error-message" data-testid="form-error">
            Error: {mutation.error.message}
          </div>
        )}
      </form>
    </div>
  )
}

export default UserForm
