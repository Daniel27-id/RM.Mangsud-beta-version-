const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const router = express.Router();
const { getMakanById, getAllMakanan } = require("./makan.service");

const client = new MongoClient("mongodb://localhost:27017"); 

router.use(async (req, res, next) => {
  if (!client.isConnected?.()) {
    try {
      await client.connect();
    } catch (error) {
      return res.status(500).json({ status: "error", message: "Database connection failed" });
    }
  }
  next();
});

router.get("/makanan", async (req, res) => {
  try {
    const makanan = await getAllMakanan();
    res.json({
      status: "success",
      message: "List makanan",
      data: makanan,
    });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});

router.get("/makanan/:id", async (req, res) => {
  try {
    const makanan = await getMakanById(req.params.id);
    res.json({
      status: "success",
      message: "Detail makanan",
      data: makanan,
    });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});

router.post("/makanan", async (req, res) => {
  try {
    const db = client.db("FULLSTACK");
    const result = await db.collection("makanan").insertOne(req.body);
    res.status(201).json({
      status: "success",
      message: "Makanan inserted",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.delete("/makanan/:id", async (req, res) => {
  try {
    const db = client.db("FULLSTACK");
    const result = await db.collection("makanan").deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({
      status: "success",
      message: "Makanan deleted",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.put("/makanan/:id", async (req, res) => {
  try {
    const db = client.db("FULLSTACK");
    const result = await db.collection("makanan").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    res.json({
      status: "success",
      message: "Makanan updated",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = router;
