import express from "express"
import { body } from "express-validator"
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from "../controllers/userController.js"
import auth from "../middleware/auth.js"

const router = express.Router()

// Validation rules
const userValidation = [
  body("name").trim().isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters"),
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
  body("password").optional().isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
]

// Routes
router.get("/", getAllUsers)
router.get("/:id", getUserById)
router.post("/", userValidation, createUser)
router.put("/:id", auth, userValidation, updateUser)
router.delete("/:id", auth, deleteUser)

export default router
