const express = require("express");
const { ObjectId } = require("mongodb");

const router = express.Router();

// GET ALL CATEGORIES
router.get("/", async (req, res) => {
  const db = req.app.locals.db;
  const categories = await db.collection("categories").find().toArray();
  res.json(categories);
});

// POST CATEGORY
router.post("/", async (req, res) => {
  const db = req.app.locals.db;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  const result = await db.collection("categories").insertOne({ name });
  res.status(201).json({ id: result.insertedId });
});

module.exports = router;
