import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import passwordsRouter from "./routes/passwords.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/passwords", passwordsRouter);

const port = process.env.PORT || 4000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully!");
    app.listen(port, () => console.log(`API running on port ${port}`));
  })
  .catch(err => {
    console.error("Mongo connection error", err);
    process.exit(1);
  });