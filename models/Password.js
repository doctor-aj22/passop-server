import mongoose from "mongoose";

const PasswordSchema = new mongoose.Schema({
  site: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true } // Note: Encrypt in production!
}, { timestamps: true });

export default mongoose.model("Password", PasswordSchema);