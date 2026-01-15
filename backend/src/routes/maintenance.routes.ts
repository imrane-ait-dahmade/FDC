import express from "express";
import maintenanceController from "../controllers/maintenance.controller.ts";
import { authenticate } from "../middleware/auth.middleware.ts";
import { authorize } from "../middleware/authorize.middleware.ts";
import { UserRole } from "../models/user.model.ts";

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(authorize(UserRole.ADMIN));

router.post("/", maintenanceController.createMaintenance.bind(maintenanceController));
router.get("/", maintenanceController.getAllMaintenances.bind(maintenanceController));
router.get("/truck/:truckId", maintenanceController.getMaintenancesByTruck.bind(maintenanceController));
router.get("/:id", maintenanceController.getMaintenanceById.bind(maintenanceController));
router.put("/:id", maintenanceController.updateMaintenance.bind(maintenanceController));
router.delete("/:id", maintenanceController.deleteMaintenance.bind(maintenanceController));
router.patch("/:id/status", maintenanceController.updateMaintenanceStatus.bind(maintenanceController));

export default router;
