import express from "express";
import driverController from "../controllers/driver.controller.ts";
import { authenticate } from "../middleware/auth.middleware.ts";
import { authorize } from "../middleware/authorize.middleware.ts";
import { UserRole } from "../models/user.model.ts";

const router = express.Router();

// Driver profile route (accessible by driver)
router.get("/my-profile", authenticate, driverController.getMyDriverProfile.bind(driverController));

// All other routes require authentication and admin role
router.use(authenticate);
router.use(authorize(UserRole.ADMIN));

router.post("/", driverController.createDriver.bind(driverController));
router.get("/", driverController.getAllDrivers.bind(driverController));
router.get("/:id", driverController.getDriverById.bind(driverController));
router.put("/:id", driverController.updateDriver.bind(driverController));
router.delete("/:id", driverController.deleteDriver.bind(driverController));
router.patch("/:id/status", driverController.updateDriverStatus.bind(driverController));

export default router;
