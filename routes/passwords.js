import { Router } from "express";
import Password from "../models/Password.js";

const router = Router();

router.get("/", async (req, res) => {
  const list = await Password.find().sort({ createdAt: 1 });
  res.json(list);
});

router.post("/", async (req, res) => {
  const doc = await Password.create(req.body);
  res.status(201).json(doc);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updated = await Password.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await Password.findByIdAndDelete(id);
  res.json({ ok: true });
});

export default router;