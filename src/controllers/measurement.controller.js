import { db } from "../config/db.js";

/**
 * Create measurement (history-based)
 * POST /api/measurements
 */
export const createMeasurement = async (req, res) => {
  try {
    const {
      customer_id,
      sleeve,
      shoulder,
      round_sleeve,
      shirt_length,
      trouser_length,
      neck,
      chest,
      tummy,
      lap,
      waist,
      trouser_hip,
      cuff_links,
      agbada_length,
      note,
    } = req.body;

    if (!customer_id) {
      return res.status(400).json({
        message: "Customer ID is required",
      });
    }

    const result = await db.run(
      `INSERT INTO measurements (
        customer_id, sleeve, shoulder, round_sleeve, shirt_length,
        trouser_length, neck, chest, tummy, lap, waist,
        trouser_hip, cuff_links, agbada_length, note
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customer_id,
        sleeve || null,
        shoulder || null,
        round_sleeve || null,
        shirt_length || null,
        trouser_length || null,
        neck || null,
        chest || null,
        tummy || null,
        lap || null,
        waist || null,
        trouser_hip || null,
        cuff_links || null,
        agbada_length || null,
        note || null,
      ]
    );

    res.status(201).json({
      message: "Measurement saved successfully",
      measurementId: result.lastID,
    });
  } catch (error) {
    console.error("Create measurement error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get measurements by customer
 * GET /api/measurements/customer/:customerId
 */
export const getMeasurementsByCustomer = async (req, res) => {
  try {
    const measurements = await db.all(
      `SELECT * FROM measurements
       WHERE customer_id = ?
       ORDER BY created_at DESC`,
      [req.params.customerId]
    );

    res.json(measurements);
  } catch (error) {
    console.error("Get measurements error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get single measurement
 * GET /api/measurements/:id
 */
export const getMeasurementById = async (req, res) => {
  try {
    const measurement = await db.get(
      "SELECT * FROM measurements WHERE id = ?",
      [req.params.id]
    );

    if (!measurement) {
      return res.status(404).json({
        message: "Measurement not found",
      });
    }

    res.json(measurement);
  } catch (error) {
    console.error("Get measurement error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Delete measurement
 * DELETE /api/measurements/:id
 */
export const deleteMeasurement = async (req, res) => {
  try {
    const { id } = req.params;

    // 1) ensure measurement exists
    const measurement = await db.get(
      "SELECT id FROM measurements WHERE id = ?",
      [id]
    );

    if (!measurement) {
      return res.status(404).json({ message: "Measurement not found" });
    }

    // 2) block delete if linked to any orders
    const used = await db.get(
      "SELECT COUNT(*) as count FROM orders WHERE measurement_id = ?",
      [id]
    );

    if ((used?.count || 0) > 0) {
      return res.status(409).json({
        message: `Cannot delete measurement. It is linked to ${used.count} order(s).`,
      });
    }

    // 3) safe to delete
    await db.run("DELETE FROM measurements WHERE id = ?", [id]);

    return res.json({ message: "Measurement deleted successfully" });
  } catch (error) {
    console.error("Delete measurement error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};