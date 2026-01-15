import express from "express";
import authController from "./controllers/auth.controller.ts";
import { authenticate } from "./middleware/auth.middleware.ts";
import { authorize } from "./middleware/authorize.middleware.ts";
import { UserRole } from "./models/user.model.ts";

const router = express.Router();

router.post("/login", authController.Login.bind(authController));
router.post("/register", authController.CreateUser.bind(authController));

// Get available drivers (users with driver role who don't have a driver profile yet)
router.get(
    "/available-drivers",
    authenticate,
    authorize(UserRole.ADMIN),
    authController.getAvailableDrivers.bind(authController)
);

export default router;

