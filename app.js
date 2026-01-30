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
    app.locals.db = db;
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
    updatedAt: "2026-01-22",
  });
});

// ===== ROUTERS =====
app.use("/api/products", require("./routes/products.routes"));
app.use("/api/items", require("./routes/items.routes"));

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`Server running http://localhost:${PORT}`);
});
