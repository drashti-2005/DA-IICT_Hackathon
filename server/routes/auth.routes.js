import express from "express";
import authController from "../controller/auth.controller.js";

const router = express.Router();

// Register new user
router.post("/register", authController.registerUser);

// Login user
router.post("/login", authController.loginUser);

export default router;
