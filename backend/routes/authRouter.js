import express from "express";
import User from "../models/userModel.js";
import { comparePassword, generateToken, hashPassword } from "../utils/authUtils.js";

const router = express.Router();

// Register a new user
router.post("/register", (req, res) => {
  const { username, password, role } = req.body;
  User.add(
    { username, password: hashPassword(password), role },
    (err, userId) => {
      if (err) {
        res.status(500).json({ error: "Failed to register user" });
      } else {
        res.json({ message: "User registered successfully", userId });
      }
    }
  );
});

// Login
router.post("/login", (req, res) => {
  User.getByUsername(req.body.username, (err, user) => {
    if (err || !user || !comparePassword(req.body.password, user.password)) {
      res.status(401).json({ error: "Invalid credentials" });
    } else {
      const token = generateToken({
        userId: user.id,
        username: user.username,
        role: user.role,
      });
      res.json({ message: "Login successful", token, role: user.role, userId: user.id });
    }
  });
});

export default router;
