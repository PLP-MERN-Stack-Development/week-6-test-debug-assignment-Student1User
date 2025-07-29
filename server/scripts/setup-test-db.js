import mongoose from "mongoose"
import User from "../src/models/User.js"
import logger from "../src/utils/logger.js"

const setupTestDatabase = async () => {
  try {
    // Connect to test database
    const mongoUri = process.env.MONGODB_TEST_URI || "mongodb://localhost:27017/mern-testing-test"
    await mongoose.connect(mongoUri)

    logger.info("Connected to test database")

    // Clear existing data
    await User.deleteMany({})
    logger.info("Cleared existing test data")

    // Create test users
    const testUsers = [
      {
        name: "Test User 1",
        email: "test1@example.com",
        password: "password123",
        role: "user",
      },
      {
        name: "Test User 2",
        email: "test2@example.com",
        password: "password123",
        role: "user",
      },
      {
        name: "Admin User",
        email: "admin@example.com",
        password: "password123",
        role: "admin",
      },
    ]

    await User.create(testUsers)
    logger.info(`Created ${testUsers.length} test users`)

    logger.info("Test database setup completed successfully")
    process.exit(0)
  } catch (error) {
    logger.error("Test database setup failed:", error)
    process.exit(1)
  }
}

setupTestDatabase()
