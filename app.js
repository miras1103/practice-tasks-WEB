// LOAD ENV VARIABLES
require("dotenv").config();

// IMPORTS
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

// APP INIT
const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARE
app.use(express.json());

// MONGODB SETUP
const MONGO_URI = process.env.MONGO_URI;
const client = new MongoClient(MONGO_URI);

let db;

// CONNECT TO DB
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

// HOME ROUTE
app.get("/", (req, res) => {
  res.json({
    message: "Backend API is running",
    endpoints: {
      products: {
        getAll: "GET /api/products",
        getOne: "GET /api/products/:id",
        create: "POST /api/products",
        update: "PUT /api/products/:id",
        delete: "DELETE /api/products/:id",
      },

      items: {
        getAll: "GET /api/items",
        getOne: "GET /api/items/:id",
        create: "POST /api/items",
        update: "PUT /api/items/:id",
        delete: "DELETE /api/items/:id",
      },

      categories: {
        getAll: "GET /api/categories",
        create: "POST /api/categories",
      },
    },
  });
});

// VERSION ENDPOINT (Practice Task 12)
app.get("/version", (req, res) => {
  res.json({
    version: "1.14",
    updatedAt: "2026-01-30",
  });
});

// ===== ROUTERS =====
app.use("/api/products", require("./routes/products.routes"));
app.use("/api/items", require("./routes/items.routes"));
app.use("/api/categories", require("./routes/categories.routes"));

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`Server running http://localhost:${PORT}`);
});
