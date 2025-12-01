// models/Password.js
import mongoose from "mongoose";

const PasswordSchema = new mongoose.Schema({
  site: String,
  username: String,
  password: String,
  category: { type: String, default: "Personal" },
  userId: String,
  userEmail: String
}, { timestamps: true });

export default mongoose.model("Password", PasswordSchema);