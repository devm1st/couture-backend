import express from "express";
import {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  searchCustomers,
} from "../controllers/customer.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protect all customer routes
router.use(authMiddleware);

// Create customer
router.post("/", createCustomer);

// Get all customers
router.get("/", getAllCustomers);

// Search customers (name / phone)
router.get("/search", searchCustomers);

// Get single customer
router.get("/:id", getCustomerById);

// Update customer
router.put("/:id", updateCustomer);

// Delete customer
router.delete("/:id", deleteCustomer);

export default router;
