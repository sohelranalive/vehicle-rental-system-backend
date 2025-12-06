import express from "express";
import { authControllers } from "./auth.controllers";

const router = express.Router();

// create user "signup"
router.post("/signup", authControllers.createUser);

// signin
router.post("/signin", authControllers.userSignIn);

export const authRoutes = router;
