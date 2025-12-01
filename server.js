// passop-server/server.js  ←←← REPLACE THIS FILE

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

const codes = new Map();

app.post("/api/send-code", async (req, res) => {
  const { email } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: "PassOP Code",
      html: `<h1 style="color:green;text-align:center;font-size:60px">${code}</h1>`
    });
    codes.set(email, code);
    console.log("Code sent:", code);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed" });
  }
});

app.post("/api/verify-code", (req, res) => {
  const { email, code } = req.body;
  if (codes.get(email) === code) {
    codes.delete(email);
    res.json({ success: true });
  } else {
    res.status(400).json({ error: "Wrong" });
  }
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Backend Ready");
    app.listen(4000, () => console.log("http://localhost:4000"));
  });