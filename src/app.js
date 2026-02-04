import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import measurementRoutes from "./routes/measurement.routes.js";
import orderRoutes from "./routes/order.routes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", // <-- your frontend URL from `npm run dev`
  credentials: true, // optional if you want cookies
}));

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/measurements", measurementRoutes);
app.use("/api/orders", orderRoutes);

export default app;
