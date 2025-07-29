import User from "../models/User.js"
import logger from "../utils/logger.js"
import { validationResult } from "express-validator"

export const getAllUsers = async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const users = await User.find({ isActive: true })
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })

    const total = await User.countDocuments({ isActive: true })

    logger.info(`Retrieved ${users.length} users`)

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    logger.error("Error fetching users:", error)
    next(error)
  }
}

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    logger.info(`Retrieved user: ${user._id}`)
    res.json(user)
  } catch (error) {
    logger.error("Error fetching user:", error)
    next(error)
  }
}

export const createUser = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" })
    }

    const user = new User({ name, email, password })
    await user.save()

    logger.info(`Created new user: ${user._id}`)
    res.status(201).json(user)
  } catch (error) {
    logger.error("Error creating user:", error)
    next(error)
  }
}

export const updateUser = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, email } = req.body

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true, runValidators: true },
    ).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    logger.info(`Updated user: ${user._id}`)
    res.json(user)
  } catch (error) {
    logger.error("Error updating user:", error)
    next(error)
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    logger.info(`Soft deleted user: ${user._id}`)
    res.json({ message: "User deleted successfully" })
  } catch (error) {
    logger.error("Error deleting user:", error)
    next(error)
  }
}
