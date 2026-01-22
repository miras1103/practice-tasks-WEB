// ===== LOAD ENV VARIABLES =====
require("dotenv").config();

// ===== IMPORTS =====
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

// ===== APP INIT =====
const app = express();
const PORT = process.env.PORT || 3000;

// ===== MIDDLEWARE =====
app.use(express.json());

// ===== MONGODB SETUP =====
const MONGO_URI = process.env.MONGO_URI;
const client = new MongoClient(MONGO_URI);

let db;

// ===== CONNECT TO DB =====
async function connectDB() {
  try {
    await client.connect();
    db = client.db("shop");
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed", error);
  }
}

connectDB();

// ===== HOME ROUTE =====
app.get("/", (req, res) => {
  res.json({
    message: "Products API is running",
    endpoints: {
      allProducts: "/api/products",
      singleProduct: "/api/products/:id",
      createProduct: "POST /api/products",
      updateProduct: "PUT /api/products/:id",
      deleteProduct: "DELETE /api/products/:id",
    },
  });
});

// ===== VERSION ENDPOINT (Practice Task 12) =====
app.get("/version", (req, res) => {
  res.json({
    version: "1.1",
    updatedAt: "2026-01-18",
  });
});

// ===== GET ALL PRODUCTS =====
app.get("/api/products", async (req, res) => {
  try {
    const products = await db.collection("products").find().toArray();
    res.json(products);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// ===== GET PRODUCT BY ID =====
app.get("/api/products/:id", async (req, res) => {
  try {
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

// ===== CREATE PRODUCT =====
app.post("/api/products", async (req, res) => {
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

// ===== UPDATE PRODUCT =====
app.put("/api/products/:id", async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  const result = await db
    .collection("products")
    .updateOne({ _id: new ObjectId(id) }, { $set: req.body });

  res.json({ message: "Product updated" });
});

// ===== DELETE PRODUCT =====
app.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  await db.collection("products").deleteOne({ _id: new ObjectId(id) });
  res.json({ message: "Product deleted" });
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`Server running http://localhost:${PORT}`);
});
