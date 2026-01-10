import express from "express";
import tripController from "../controllers/trip.controller.ts";
import { authenticate } from "../middleware/auth.middleware.ts";
import { authorize } from "../middleware/authorize.middleware.ts";
import { UserRole } from "../models/user.model.ts";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Admin only routes
router.post("/", authorize(UserRole.ADMIN), tripController.createTrip.bind(tripController));
router.get("/", authorize(UserRole.ADMIN), tripController.getAllTrips.bind(tripController));
router.get("/my-trips", tripController.getMyTrips.bind(tripController)); // Driver can see their trips
router.get("/:id", tripController.getTripById.bind(tripController));
router.put("/:id", authorize(UserRole.ADMIN), tripController.updateTrip.bind(tripController));
router.patch("/:id/status", tripController.updateTripStatus.bind(tripController)); // Driver can update status

export default router;

