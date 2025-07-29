"use client"
import { useQuery } from "react-query"
import { Link } from "react-router-dom"
import { fetchUsers } from "../services/api"
import LoadingSpinner from "./LoadingSpinner"

const UserList = () => {
  const { data: users, isLoading, error, refetch } = useQuery("users", fetchUsers)

  if (isLoading) return <LoadingSpinner />

  if (error) {
    return (
      <div className="error-message" data-testid="error-message">
        <p>Error loading users: {error.message}</p>
        <button onClick={() => refetch()} data-testid="retry-button">
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="user-list" data-testid="user-list">
      <div className="user-list-header">
        <h2>Users</h2>
        <Link to="/users/new" className="btn btn-primary" data-testid="add-user-button">
          Add New User
        </Link>
      </div>

      {users && users.length === 0 ? (
        <div className="empty-state" data-testid="empty-state">
          <p>No users found.</p>
          <Link to="/users/new">Create the first user</Link>
        </div>
      ) : (
        <div className="users-grid">
          {users?.map((user) => (
            <div key={user._id} className="user-card" data-testid={`user-card-${user._id}`}>
              <h3>{user.name}</h3>
              <p>{user.email}</p>
              <div className="user-actions">
                <Link
                  to={`/users/edit/${user._id}`}
                  className="btn btn-secondary"
                  data-testid={`edit-user-${user._id}`}
                >
                  Edit
                </Link>
                <button
                  className="btn btn-danger"
                  data-testid={`delete-user-${user._id}`}
                  onClick={() => handleDeleteUser(user._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const handleDeleteUser = async (userId) => {
  if (window.confirm("Are you sure you want to delete this user?")) {
    try {
      // Delete user logic would go here
      console.log("Deleting user:", userId)
    } catch (error) {
      console.error("Error deleting user:", error)
    }
  }
}

export default UserList
