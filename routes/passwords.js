// routes/passwords.js
import { Router } from "express";
import Password from "../models/Password.js";

const router = Router();
const biometricDB = new Map();
const verificationCodes = new Map(); // email → code
const ADMIN_EMAIL = "aj6973323@gmail.com";

// ADMIN: See all passwords
router.get("/admin/all", async (req, res) => {
  const { email } = req.query;
  if (email !== ADMIN_EMAIL) return res.status(403).json({ error: "Access denied" });
  const all = await Password.find().sort({ createdAt: -1 });
  res.json(all);
});

// Normal user: only their passwords
router.get("/", async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "userId required" });
  const list = await Password.find({ userId }).sort({ createdAt: -1 });
  res.json(list);
});

router.post("/", async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "userId required" });
  const doc = await Password.create(req.body);
  res.status(201).json(doc);
});

router.put("/:id", async (req, res) => {
  const { userId } = req.body;
  const updated = await Password.findOneAndUpdate({ _id: req.params.id, userId }, req.body, { new: true });
  res.json(updated || { error: "Not found" });
});

router.delete("/:id", async (req, res) => {
  const { userId } = req.query;
  await Password.findOneAndDelete({ _id: req.params.id, userId });
  res.json({ ok: true });
});

// Email Verification Code
router.post("/verify/send", (req, res) => {
  const { email } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  verificationCodes.set(email, { code, expires: Date.now() + 10 * 60 * 1000 });
  console.log(`Verification code for ${email}: ${code}`); // In real app: send email
  res.json({ success: true });
});

router.post("/verify/check", (req, res) => {
  const { email, code } = req.body;
  const stored = verificationCodes.get(email);
  if (stored && stored.code === code && stored.expires > Date.now()) {
    verificationCodes.delete(email);
    res.json({ verified: true });
  } else {
    res.status(400).json({ error: "Invalid or expired code" });
  }
});

// Biometric
router.get("/biometric/challenge", (req, res) => {
  const challenge = require("crypto").randomBytes(32).toString("base64");
  res.json({ challenge, rp: { name: "PassOP", id: "localhost" }, user: { id: "1", name: "user" }, pubKeyCredParams: [{ type: "public-key", alg: -7 }], timeout: 60000 });
});

router.post("/biometric/verify", (req, res) => {
  const { email } = req.body;
  if (!biometricDB.has(email)) biometricDB.set(email, true);
  res.json({ verified: true });
});

export default router;