import express from "express";
import authController from "./controllers/auth.controller.ts";

const router = express.Router();

router.post("/login", authController.Login.bind(authController));
router.post("/register", authController.CreateUser.bind(authController));

export default router;

