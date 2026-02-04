import { db } from "../config/db.js";

/**
 * Create customer
 * POST /api/customers
 */
export const createCustomer = async (req, res) => {
  try {
    const { full_name, phone, address, gender, notes } = req.body;

    if (!full_name || !phone) {
      return res.status(400).json({
        message: "Full name and phone are required",
      });
    }

    const result = await db.run(
      `INSERT INTO customers (full_name, phone, address, gender, notes)
       VALUES (?, ?, ?, ?, ?)`,
      [
        full_name,
        phone,
        address || null,
        gender || null,
        notes || null,
      ]
    );

    return res.status(201).json({
      message: "Customer created successfully",
      customerId: result.lastID,
    });
  } catch (error) {
    console.error("Create customer error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get all customers
 */
// controllers/customer.controller.js
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await db.all(
      "SELECT * FROM customers ORDER BY created_at DESC"
    );

    return res.json({
      success: true,
      customers, // ✅ ALWAYS an array
    });
  } catch (error) {
    console.error("Get customers error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch customers",
    });
  }
};

/**
 * Search customers
 */
export const searchCustomers = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) return res.json([]);

    const customers = await db.all(
      `SELECT * FROM customers
       WHERE full_name LIKE ? OR phone LIKE ?
       ORDER BY created_at DESC`,
      [`%${q}%`, `%${q}%`]
    );

    res.json(customers);
  } catch (error) {
    console.error("Search customers error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get customer by ID
 */
export const getCustomerById = async (req, res) => {
  try {
    const customer = await db.get(
      "SELECT * FROM customers WHERE id = ?",
      [req.params.id]
    );

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.json(customer);
  } catch (error) {
    console.error("Get customer error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Update customer
 */
export const updateCustomer = async (req, res) => {
  try {
    const { full_name, phone, address, gender, notes } = req.body;

    const result = await db.run(
      `UPDATE customers
       SET full_name = ?, phone = ?, address = ?, gender = ?, notes = ?, 
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        full_name,
        phone,
        address || null,
        gender || null,
        notes || null,
        req.params.id,
      ]
    );

    if (result.changes === 0) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.json({ message: "Customer updated successfully" });
  } catch (error) {
    console.error("Update customer error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Delete customer
 */
export const deleteCustomer = async (req, res) => {
  try {
    const result = await db.run(
      "DELETE FROM customers WHERE id = ?",
      [req.params.id]
    );

    if (result.changes === 0) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Delete customer error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
