import jwt from "jsonwebtoken"
import User from "../models/User.js"
import logger from "../utils/logger.js"

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret")
    const user = await User.findById(decoded.userId).select("-password")

    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Invalid token." })
    }

    req.user = { userId: user._id, role: user.role }
    next()
  } catch (error) {
    logger.error("Auth middleware error:", error)
    res.status(401).json({ message: "Invalid token." })
  }
}

export default auth
