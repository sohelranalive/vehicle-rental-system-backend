import express from "express";
import { authControllers } from "./auth.controllers";

const router = express.Router();

// create user or signup
router.post("/signup", authControllers.createUser);

// user signin
router.post("/signin", authControllers.userSignIn);

export const authRoutes = router;
