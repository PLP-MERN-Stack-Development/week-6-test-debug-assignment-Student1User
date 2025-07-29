import request from "supertest"
import app from "../../src/index.js"
import User from "../../src/models/User.js"

describe("User Routes", () => {
  describe("GET /api/users", () => {
    test("should return all active users", async () => {
      // Create test users
      await User.create([
        { name: "John Doe", email: "john@example.com", password: "password123" },
        { name: "Jane Smith", email: "jane@example.com", password: "password123" },
        { name: "Inactive User", email: "inactive@example.com", password: "password123", isActive: false },
      ])

      const response = await request(app).get("/api/users").expect(200)

      expect(response.body.users).toHaveLength(2)
      expect(response.body.users[0]).not.toHaveProperty("password")
      expect(response.body.pagination).toBeDefined()
    })

    test("should support pagination", async () => {
      // Create multiple users
      const users = Array.from({ length: 15 }, (_, i) => ({
        name: `User ${i}`,
        email: `user${i}@example.com`,
        password: "password123",
      }))
      await User.create(users)

      const response = await request(app).get("/api/users?page=2&limit=5").expect(200)

      expect(response.body.users).toHaveLength(5)
      expect(response.body.pagination.page).toBe(2)
      expect(response.body.pagination.limit).toBe(5)
    })
  })

  describe("GET /api/users/:id", () => {
    test("should return user by id", async () => {
      const user = await User.create({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      })

      const response = await request(app).get(`/api/users/${user._id}`).expect(200)

      expect(response.body.name).toBe(user.name)
      expect(response.body.email).toBe(user.email)
      expect(response.body).not.toHaveProperty("password")
    })

    test("should return 404 for non-existent user", async () => {
      const fakeId = "507f1f77bcf86cd799439011"

      await request(app).get(`/api/users/${fakeId}`).expect(404)
    })
  })

  describe("POST /api/users", () => {
    test("should create a new user", async () => {
      const userData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      }

      const response = await request(app).post("/api/users").send(userData).expect(201)

      expect(response.body.name).toBe(userData.name)
      expect(response.body.email).toBe(userData.email)
      expect(response.body).not.toHaveProperty("password")

      // Verify user was saved to database
      const savedUser = await User.findById(response.body._id)
      expect(savedUser).toBeTruthy()
    })

    test("should return validation errors for invalid data", async () => {
      const invalidData = {
        name: "J", // Too short
        email: "invalid-email",
        password: "123", // Too short
      }

      const response = await request(app).post("/api/users").send(invalidData).expect(400)

      expect(response.body.errors).toBeDefined()
      expect(response.body.errors.length).toBeGreaterThan(0)
    })

    test("should not create user with duplicate email", async () => {
      const userData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      }

      // Create first user
      await User.create(userData)

      // Try to create duplicate
      const response = await request(app).post("/api/users").send(userData).expect(400)

      expect(response.body.message).toContain("already exists")
    })
  })

  describe("PUT /api/users/:id", () => {
    test("should update user with valid data", async () => {
      const user = await User.create({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      })

      const updateData = {
        name: "John Updated",
        email: "john.updated@example.com",
      }

      const response = await request(app).put(`/api/users/${user._id}`).send(updateData).expect(200)

      expect(response.body.name).toBe(updateData.name)
      expect(response.body.email).toBe(updateData.email)
    })

    test("should return 404 for non-existent user", async () => {
      const fakeId = "507f1f77bcf86cd799439011"

      await request(app)
        .put(`/api/users/${fakeId}`)
        .send({ name: "Updated Name", email: "updated@example.com" })
        .expect(404)
    })
  })

  describe("DELETE /api/users/:id", () => {
    test("should soft delete user", async () => {
      const user = await User.create({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      })

      await request(app).delete(`/api/users/${user._id}`).expect(200)

      // Verify user is soft deleted
      const deletedUser = await User.findById(user._id)
      expect(deletedUser.isActive).toBe(false)
    })
  })
})
