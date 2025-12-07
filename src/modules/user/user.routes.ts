import express from "express";
import { userControllers } from "./user.controllers";
import auth from "../../middleware/auth";

const router = express.Router();

// get all user
router.get("/", auth("admin"), userControllers.getAllUsers);

// update user
router.put("/:userId", auth("admin", "customer"), userControllers.updateUser);

// delete User
router.delete("/:userId", auth("admin"), userControllers.deleteUser);

export const userRoutes = router;
