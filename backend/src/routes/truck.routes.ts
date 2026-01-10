import express from "express";
import truckController from "../controllers/truck.controller.ts";
import { authenticate } from "../middleware/auth.middleware.ts";
import { authorize } from "../middleware/authorize.middleware.ts";
import { UserRole } from "../models/user.model.ts";

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(authorize(UserRole.ADMIN));

router.post("/", truckController.createTruck.bind(truckController));
router.get("/", truckController.getAllTrucks.bind(truckController));
router.get("/:id", truckController.getTruckById.bind(truckController));
router.put("/:id", truckController.updateTruck.bind(truckController));
router.delete("/:id", truckController.deleteTruck.bind(truckController));
router.patch("/:id/mileage", truckController.updateMileage.bind(truckController));

export default router;

