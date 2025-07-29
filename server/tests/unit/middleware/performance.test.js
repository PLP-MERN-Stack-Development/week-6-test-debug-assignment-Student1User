import performanceMiddleware from "../../../src/middleware/performance.js"
import logger from "../../../src/utils/logger.js"
import jest from "jest" // Declare the jest variable

// Mock logger
jest.mock("../../../src/utils/logger.js", () => ({
  info: jest.fn(),
}))

describe("Performance Middleware", () => {
  let req, res, next

  beforeEach(() => {
    req = {
      method: "GET",
      url: "/test",
      get: jest.fn().mockReturnValue("Mozilla/5.0"),
      ip: "127.0.0.1",
    }
    res = {
      end: jest.fn(),
      set: jest.fn(),
      statusCode: 200,
    }
    next = jest.fn()
    jest.clearAllMocks()
  })

  test("should measure and log response time", (done) => {
    performanceMiddleware(req, res, next)

    expect(next).toHaveBeenCalled()

    // Simulate response end after some time
    setTimeout(() => {
      res.end()

      expect(logger.info).toHaveBeenCalledWith(
        "Request Performance",
        expect.objectContaining({
          method: "GET",
          url: "/test",
          statusCode: 200,
          responseTime: expect.stringMatching(/\d+ms/),
          userAgent: "Mozilla/5.0",
          ip: "127.0.0.1",
        }),
      )

      expect(res.set).toHaveBeenCalledWith("X-Response-Time", expect.stringMatching(/\d+ms/))
      done()
    }, 10)
  })
})
