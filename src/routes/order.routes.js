import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrdersByCustomer,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/order.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protect all order routes
router.use(authMiddleware);

// Create order
router.post("/", createOrder);

// Get all orders
router.get("/", getAllOrders);

// Get orders by customer
router.get("/customer/:customerId", getOrdersByCustomer);

// Get single order
router.get("/:id", getOrderById);

// Update order status
router.patch("/:id/status", updateOrderStatus);

// Delete order
router.delete("/:id", deleteOrder);

export default router;
