import express from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import mongoose from "mongoose"
import dotenv from "dotenv"
import logger from "./utils/logger.js"
import errorHandler from "./middleware/errorHandler.js"
import userRoutes from "./routes/userRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import performanceMiddleware from "./middleware/performance.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Security middleware
app.use(helmet())
app.use(cors())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})
app.use(limiter)

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} - ${req.ip}`)
  next()
})

// Performance monitoring middleware
app.use(performanceMiddleware)

// Routes
app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

// Error handling middleware
app.use(errorHandler)

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" })
})

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/mern-testing")
    logger.info(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    logger.error("Database connection failed:", error)
    process.exit(1)
  }
}

// Start server
if (process.env.NODE_ENV !== "test") {
  connectDB()
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`)
  })
}

export default app
