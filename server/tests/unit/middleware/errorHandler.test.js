import errorHandler from "../../../src/middleware/errorHandler.js"
import logger from "../../../src/utils/logger.js"
import jest from "jest" // Declare the jest variable

// Mock logger
jest.mock("../../../src/utils/logger.js", () => ({
  error: jest.fn(),
}))

describe("Error Handler Middleware", () => {
  let req, res, next

  beforeEach(() => {
    req = {
      url: "/test",
      method: "GET",
      ip: "127.0.0.1",
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    next = jest.fn()
    jest.clearAllMocks()
  })

  test("should handle validation errors", () => {
    const error = {
      name: "ValidationError",
      errors: {
        name: { message: "Name is required" },
        email: { message: "Email is invalid" },
      },
    }

    errorHandler(error, req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      message: "Validation Error",
      errors: ["Name is required", "Email is invalid"],
    })
    expect(logger.error).toHaveBeenCalled()
  })

  test("should handle duplicate key errors", () => {
    const error = {
      code: 11000,
      keyValue: { email: "test@example.com" },
    }

    errorHandler(error, req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      message: "email already exists",
    })
  })

  test("should handle JWT errors", () => {
    const error = {
      name: "JsonWebTokenError",
      message: "Invalid token",
    }

    errorHandler(error, req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid token",
    })
  })

  test("should handle token expired errors", () => {
    const error = {
      name: "TokenExpiredError",
      message: "Token expired",
    }

    errorHandler(error, req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      message: "Token expired",
    })
  })

  test("should handle generic errors", () => {
    const error = {
      message: "Something went wrong",
      statusCode: 500,
    }

    errorHandler(error, req, res, next)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      message: "Something went wrong",
    })
  })

  test("should include stack trace in development", () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = "development"

    const error = {
      message: "Test error",
      stack: "Error stack trace",
    }

    errorHandler(error, req, res, next)

    expect(res.json).toHaveBeenCalledWith({
      message: "Test error",
      stack: "Error stack trace",
    })

    process.env.NODE_ENV = originalEnv
  })
})
