import { db } from "../config/db.js";

/**
 * Create order
 * POST /api/orders
 */
export const createOrder = async (req, res) => {
  try {
    const {
      customer_id,
      measurement_id,
      style_name,
      style_description,
      style_image_url,
      fabric_type,
      fabric_color,
      fabric_notes,
      price,
      due_date,
    } = req.body;

    if (!customer_id || !measurement_id || !style_name) {
      return res.status(400).json({
        message: "Customer, measurement and style name are required",
      });
    }

    const result = await db.run(
      `INSERT INTO orders (
        customer_id, measurement_id,
        style_name, style_description, style_image_url,
        fabric_type, fabric_color, fabric_notes,
        price, due_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customer_id,
        measurement_id,
        style_name,
        style_description || null,
        style_image_url || null,
        fabric_type || null,
        fabric_color || null,
        fabric_notes || null,
        price || null,
        due_date || null,
      ]
    );

    res.status(201).json({
      message: "Order created successfully",
      orderId: result.lastID,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get all orders
 * GET /api/orders
 */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await db.all(
      `SELECT orders.*,
              customers.full_name AS customer_name
       FROM orders
       JOIN customers ON orders.customer_id = customers.id
       ORDER BY orders.created_at DESC`
    );

    res.json(orders);
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get orders by customer
 * GET /api/orders/customer/:customerId
 */
export const getOrdersByCustomer = async (req, res) => {
  try {
    const orders = await db.all(
      `SELECT * FROM orders
       WHERE customer_id = ?
       ORDER BY created_at DESC`,
      [req.params.customerId]
    );

    res.json(orders);
  } catch (error) {
    console.error("Get customer orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get single order
 * GET /api/orders/:id
 */
export const getOrderById = async (req, res) => {
  try {
    const order = await db.get(
      `SELECT * FROM orders WHERE id = ?`,
      [req.params.id]
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json(order);
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Update order status
 * PATCH /api/orders/:id/status
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "cutting",
      "sewing",
      "fitting",
      "ready",
      "collected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const result = await db.run(
      `UPDATE orders
       SET status = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [status, req.params.id]
    );

    if (result.changes === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json({ message: "Order status updated" });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Delete order
 * DELETE /api/orders/:id
 */
export const deleteOrder = async (req, res) => {
  try {
    const result = await db.run(
      "DELETE FROM orders WHERE id = ?",
      [req.params.id]
    );

    if (result.changes === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Delete order error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
