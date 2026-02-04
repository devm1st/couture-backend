import express from "express";
import {
  createMeasurement,
  getMeasurementsByCustomer,
  getMeasurementById,
  deleteMeasurement,
} from "../controllers/measurement.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protect all measurement routes
router.use(authMiddleware);

// Create measurement
router.post("/", createMeasurement);

// Get measurements by customer
router.get("/customer/:customerId", getMeasurementsByCustomer);

// Get single measurement
router.get("/:id", getMeasurementById);

// Delete measurement
router.delete("/:id", deleteMeasurement);

export default router;
