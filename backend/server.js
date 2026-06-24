const express = require('express');
const cors = require('cors');
const { readDb, writeDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helper to generate IDs
const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// --- API ROUTES ---

// 1. Get all products
app.get('/api/products', (req, res) => {
  try {
    const db = readDb();
    res.json(db.products || []);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve products" });
  }
});

// 2. Get all orders
app.get('/api/orders', (req, res) => {
  try {
    const db = readDb();
    res.json(db.orders || []);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve orders" });
  }
});

// 3. Create a new order
app.post('/api/orders', (req, res) => {
  try {
    const { items, customer, billing, shipping, total, paymentMethod } = req.body;
    
    if (!items || items.length === 0 || !customer || !billing) {
      return res.status(400).json({ error: "Invalid order data. Items, customer, and billing info are required." });
    }

    const db = readDb();
    const newOrder = {
      id: generateId('ord'),
      items,
      customer,
      billing,
      shipping,
      total,
      paymentMethod: paymentMethod || "Mock CyberCard",
      status: "Processing",
      trackingNumber: `TRK-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString()
    };

    if (!db.orders) {
      db.orders = [];
    }
    db.orders.unshift(newOrder);
    writeDb(db);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: "Failed to create order" });
  }
});

// 4. Update order status (for admin/simulated changes)
app.patch('/api/orders/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["Processing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid order status" });
    }

    const db = readDb();
    const orderIdx = db.orders.findIndex(o => o.id === id);
    if (orderIdx === -1) {
      return res.status(404).json({ error: "Order not found" });
    }

    db.orders[orderIdx].status = status;
    writeDb(db);
    res.json(db.orders[orderIdx]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update order status" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`SphereMedia E-Commerce Server running on http://localhost:${PORT}`);
});
