import jwt from "jsonwebtoken"
import auth from "../../../src/middleware/auth.js"
import User from "../../../src/models/User.js"
import jest from "jest" // Declare the jest variable

// Mock dependencies
jest.mock("jsonwebtoken")
jest.mock("../../../src/models/User.js")

describe("Auth Middleware", () => {
  let req, res, next

  beforeEach(() => {
    req = {
      header: jest.fn(),
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    next = jest.fn()
  })

  test("should authenticate valid token", async () => {
    const mockUser = { _id: "user123", role: "user", isActive: true }
    const mockDecoded = { userId: "user123" }

    req.header.mockReturnValue("Bearer valid-token")
    jwt.verify.mockReturnValue(mockDecoded)
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser),
    })

    await auth(req, res, next)

    expect(req.user).toEqual({ userId: mockUser._id, role: mockUser.role })
    expect(next).toHaveBeenCalled()
  })

  test("should reject request without token", async () => {
    req.header.mockReturnValue(null)

    await auth(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      message: "Access denied. No token provided.",
    })
    expect(next).not.toHaveBeenCalled()
  })

  test("should reject invalid token", async () => {
    req.header.mockReturnValue("Bearer invalid-token")
    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token")
    })

    await auth(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid token." })
    expect(next).not.toHaveBeenCalled()
  })

  test("should reject token for inactive user", async () => {
    const mockUser = null // User not found or inactive
    const mockDecoded = { userId: "user123" }

    req.header.mockReturnValue("Bearer valid-token")
    jwt.verify.mockReturnValue(mockDecoded)
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser),
    })

    await auth(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid token." })
    expect(next).not.toHaveBeenCalled()
  })
})
