import logger from "../utils/logger.js"

const performanceMiddleware = (req, res, next) => {
  const startTime = Date.now()

  // Override res.end to capture response time
  const originalEnd = res.end
  res.end = function (...args) {
    const endTime = Date.now()
    const responseTime = endTime - startTime

    // Log performance metrics
    logger.info("Request Performance", {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      userAgent: req.get("User-Agent"),
      ip: req.ip,
    })

    // Add response time header
    res.set("X-Response-Time", `${responseTime}ms`)

    // Call original end method
    originalEnd.apply(this, args)
  }

  next()
}

export default performanceMiddleware
