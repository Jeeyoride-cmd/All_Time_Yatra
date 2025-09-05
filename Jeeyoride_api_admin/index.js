const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false, // disable CSP (fixes your error)
  })
);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API running on Vercel 🚀" });
});

// Prevent favicon CSP error
app.use("/favicon.ico", (req, res) => res.status(204).end());

// Export for Vercel
module.exports = app;
