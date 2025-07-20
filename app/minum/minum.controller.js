const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const { getMinumById, getAllMinuman } = require("./minum.service");

const router = express.Router();
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

router.get("/minuman", async (req, res) => {
  try {
    const minuman = await getAllMinuman();
    res.json({
      status: "success",
      message: "List minuman",
      data: minuman,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/minuman/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const minuman = await getMinumById(id);
    res.json({
      status: "success",
      message: "Detail minuman",
      data: minuman,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/minuman", async (req, res) => {
  const { nama, harga } = req.body;

  if (!nama || !harga) {
    return res.status(400).json({ status: "fail", message: "nama dan harga wajib diisi" });
  }

  try {
    const db = client.db("FULLSTACK");
    const result = await db.collection("minuman").insertOne({ nama, harga });
    res.status(201).json({
      status: "success",
      message: "Minuman ditambahkan",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.put("/minuman/:id", async (req, res) => {
  try {
    const db = client.db("FULLSTACK");
    const result = await db.collection("minuman").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    res.json({
      status: "success",
      message: "Minuman diperbarui",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.delete("/minuman/:id", async (req, res) => {
  try {
    const db = client.db("FULLSTACK");
    const result = await db.collection("minuman").deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({
      status: "success",
      message: "Minuman dihapus",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = router;
