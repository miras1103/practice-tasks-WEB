const express = require("express");
const { ObjectId } = require("mongodb");

const router = express.Router();

// GET ALL PRODUCTS
router.get("/", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const products = await db.collection("products").find().toArray();
    res.json(products);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// GET PRODUCT BY ID
router.get("/:id", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await db
      .collection("products")
      .findOne({ _id: new ObjectId(id) });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// CREATE PRODUCT
router.post("/", async (req, res) => {
  const db = req.app.locals.db;
  const { name, price, category } = req.body;

  if (!name || price === undefined || !category) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const result = await db.collection("products").insertOne({
    name,
    price,
    category,
  });

  res.status(201).json({
    message: "Product created",
    id: result.insertedId,
  });
});

// UPDATE PRODUCT
router.put("/:id", async (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  await db
    .collection("products")
    .updateOne({ _id: new ObjectId(id) }, { $set: req.body });

  res.json({ message: "Product updated" });
});

// DELETE PRODUCT
router.delete("/:id", async (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  await db.collection("products").deleteOne({ _id: new ObjectId(id) });
  res.json({ message: "Product deleted" });
});

module.exports = router;
