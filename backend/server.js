import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { connectDB } from "./config/db.js";
import placesRouter from "./routes/Places.routes.js";
import usersRouter from "./routes/Users.routes.js";
import reviewsRouter from "./routes/Reviews.routes.js";

const __dirname = path.resolve();
dotenv.config();
const app = express();

app.use(express.json());

console.log("Environment variables:", {
  MONGO_URI: process.env.MONGO_URI ? "Set ✓" : "NOT SET ✗",
  JWT_SECRET: process.env.JWT_SECRET ? "Set ✓" : "NOT SET ✗",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? "Set ✓" : "NOT SET ✗",
});
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL || "https://your-frontend-domain.com"
        : "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Debug middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use("/api/places", placesRouter);
app.use("/api/users", usersRouter);
app.use("/api/reviews", reviewsRouter);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Server is running",
    env: process.env.NODE_ENV,
  });
});

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "/frontend/dist")));
//   app.get(/.*/, (req, res) => {
//     res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
//   });
// }

const PORT = process.env.PORT || 5001;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  await connectDB();
});
