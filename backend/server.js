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
app.use("/api/places", placesRouter);
app.use("/api/users", usersRouter);
app.use("/api/reviews", reviewsRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(5001, () => {
  connectDB();
  console.log("Server is running!!");
});
