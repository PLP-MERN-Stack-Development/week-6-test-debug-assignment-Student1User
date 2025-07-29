import User from "../../../src/models/User.js"

describe("User Model", () => {
  describe("Validation", () => {
    test("should create a valid user", async () => {
      const userData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      }

      const user = new User(userData)
      const savedUser = await user.save()

      expect(savedUser._id).toBeDefined()
      expect(savedUser.name).toBe(userData.name)
      expect(savedUser.email).toBe(userData.email)
      expect(savedUser.password).not.toBe(userData.password) // Should be hashed
    })

    test("should require name", async () => {
      const userData = {
        email: "john@example.com",
        password: "password123",
      }

      const user = new User(userData)

      await expect(user.save()).rejects.toThrow("Name is required")
    })

    test("should require email", async () => {
      const userData = {
        name: "John Doe",
        password: "password123",
      }

      const user = new User(userData)

      await expect(user.save()).rejects.toThrow("Email is required")
    })

    test("should validate email format", async () => {
      const userData = {
        name: "John Doe",
        email: "invalid-email",
        password: "password123",
      }

      const user = new User(userData)

      await expect(user.save()).rejects.toThrow("Please enter a valid email")
    })

    test("should require unique email", async () => {
      const userData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      }

      await new User(userData).save()

      const duplicateUser = new User(userData)
      await expect(duplicateUser.save()).rejects.toThrow()
    })
  })

  describe("Password Methods", () => {
    test("should hash password before saving", async () => {
      const userData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      }

      const user = new User(userData)
      await user.save()

      expect(user.password).not.toBe(userData.password)
      expect(user.password.length).toBeGreaterThan(userData.password.length)
    })

    test("should compare password correctly", async () => {
      const userData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      }

      const user = new User(userData)
      await user.save()

      const isMatch = await user.comparePassword("password123")
      const isNotMatch = await user.comparePassword("wrongpassword")

      expect(isMatch).toBe(true)
      expect(isNotMatch).toBe(false)
    })
  })

  describe("JSON Serialization", () => {
    test("should not include password in JSON output", async () => {
      const userData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      }

      const user = new User(userData)
      await user.save()

      const userJSON = user.toJSON()

      expect(userJSON.password).toBeUndefined()
      expect(userJSON.name).toBe(userData.name)
      expect(userJSON.email).toBe(userData.email)
    })
  })
})
