const authMiddleware = require("../middleware/auth");
const express = require("express");
const { ObjectId } = require("mongodb");

const router = express.Router();

// GET ALL ITEMS
router.get("/", async (req, res) => {
  const db = req.app.locals.db;
  const items = await db.collection("items").find().toArray();
  res.json(items);
});

// GET ITEM BY ID
router.get("/:id", async (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  const item = await db.collection("items").findOne({ _id: new ObjectId(id) });

  if (!item) {
    return res.status(404).json({ error: "Not found" });
  }

  res.json(item);
});

// POST ITEM
router.post("/", authMiddleware, async (req, res) => {
  const db = req.app.locals.db;
  const { name, price } = req.body;

  if (!name || price === undefined) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const result = await db.collection("items").insertOne({ name, price });
  res.status(201).json({ id: result.insertedId });
});

// PUT ITEM
router.put("/:id", authMiddleware, async (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;

  await db
    .collection("items")
    .updateOne({ _id: new ObjectId(id) }, { $set: req.body });

  res.json({ message: "Updated" });
});

// PATCH ITEM
router.patch("/:id", authMiddleware, async (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;

  await db
    .collection("items")
    .updateOne({ _id: new ObjectId(id) }, { $set: req.body });

  res.json({ message: "Partially updated" });
});

// DELETE ITEM
router.delete("/:id", authMiddleware, async (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;

  await db.collection("items").deleteOne({ _id: new ObjectId(id) });
  res.status(204).send();
});

module.exports = router;
