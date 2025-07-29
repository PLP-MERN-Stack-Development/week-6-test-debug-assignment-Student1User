import request from "supertest"
import app from "../../src/index.js"
import User from "../../src/models/User.js"

describe("Auth Routes", () => {
  describe("POST /api/auth/register", () => {
    test("should register a new user", async () => {
      const userData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      }

      const response = await request(app).post("/api/auth/register").send(userData).expect(201)

      expect(response.body.token).toBeDefined()
      expect(response.body.user.name).toBe(userData.name)
      expect(response.body.user.email).toBe(userData.email)
      expect(response.body.user).not.toHaveProperty("password")

      // Verify user was saved to database
      const savedUser = await User.findById(response.body.user.id)
      expect(savedUser).toBeTruthy()
    })

    test("should not register user with duplicate email", async () => {
      const userData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      }

      // Create first user
      await User.create(userData)

      // Try to register duplicate
      const response = await request(app).post("/api/auth/register").send(userData).expect(400)

      expect(response.body.message).toContain("already exists")
    })

    test("should return validation errors for invalid data", async () => {
      const invalidData = {
        name: "J",
        email: "invalid-email",
        password: "123",
      }

      const response = await request(app).post("/api/auth/register").send(invalidData).expect(400)

      expect(response.body.errors).toBeDefined()
    })
  })

  describe("POST /api/auth/login", () => {
    test("should login with valid credentials", async () => {
      const userData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      }

      await User.create(userData)

      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: userData.email,
          password: userData.password,
        })
        .expect(200)

      expect(response.body.token).toBeDefined()
      expect(response.body.user.email).toBe(userData.email)
    })

    test("should not login with invalid credentials", async () => {
      const userData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      }

      await User.create(userData)

      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: userData.email,
          password: "wrongpassword",
        })
        .expect(401)

      expect(response.body.message).toBe("Invalid credentials")
    })

    test("should not login non-existent user", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: "password123",
        })
        .expect(401)

      expect(response.body.message).toBe("Invalid credentials")
    })
  })

  describe("GET /api/auth/profile", () => {
    test("should get user profile with valid token", async () => {
      const user = await User.create({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      })

      // Login to get token
      const loginResponse = await request(app).post("/api/auth/login").send({
        email: "john@example.com",
        password: "password123",
      })

      const token = loginResponse.body.token

      const response = await request(app).get("/api/auth/profile").set("Authorization", `Bearer ${token}`).expect(200)

      expect(response.body.name).toBe(user.name)
      expect(response.body.email).toBe(user.email)
      expect(response.body).not.toHaveProperty("password")
    })

    test("should return 401 without token", async () => {
      await request(app).get("/api/auth/profile").expect(401)
    })

    test("should return 401 with invalid token", async () => {
      await request(app).get("/api/auth/profile").set("Authorization", "Bearer invalid-token").expect(401)
    })
  })
})
