const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const { getUserById, getAllUsers } = require("./user.service");

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

router.get("/users", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json({
      status: "success",
      message: "List users",
      data: users,
    });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});

router.get("/users/:id", async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    res.json({
      status: "success",
      message: "Detail user",
      data: user,
    });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});

router.post("/users", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      status: "fail",
      message: "username dan password wajib diisi",
    });
  }

  try {
    const db = client.db("FULLSTACK");
    const result = await db.collection("users").insertOne({ username, password });
    res.status(201).json({
      status: "success",
      message: "User created",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.put("/users/:id", async (req, res) => {
  try {
    const db = client.db("FULLSTACK");
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    res.json({
      status: "success",
      message: "User updated",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const db = client.db("FULLSTACK");
    const result = await db.collection("users").deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({
      status: "success",
      message: "User deleted",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.post("/users/:id/pesan", async (req, res) => {
  const { namaItem, total, jenis } = req.body;
  const userId = req.params.id;

  if (!namaItem || !total || !jenis) {
    return res.status(400).json({
      status: "fail",
      message: "namaItem, total, dan jenis wajib diisi",
    });
  }

  if (jenis !== "makanan" && jenis !== "minuman") {
    return res.status(400).json({
      status: "fail",
      message: "jenis harus berupa 'makanan' atau 'minuman'",
    });
  }

  try {
    const db = client.db("FULLSTACK");
    const koleksi = jenis === "makanan" ? "makanan" : "minuman";
    
    const itemTersedia = await db.collection(koleksi).findOne({
      nama: { $regex: `^${namaItem}$`, $options: 'i' }
    });

    if (!itemTersedia) {
      return res.status(404).json({
        status: "fail",
        message: `${jenis} dengan nama '${namaItem}' tidak ditemukan`,
      });
    }

    const result = await db.collection("pesanan").insertOne({
      userId: new ObjectId(userId),
      namaItem: itemTersedia.nama,
      jenis,
      total,
      createdAt: new Date(),
    });

    res.status(201).json({
      status: "success",
      message: `Pesanan ${jenis} berhasil dibuat`,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.get("/users/:id/pesanan", async (req, res) => {
  const userId = req.params.id;

  try {
    const db = client.db("FULLSTACK");
    const pesanan = await db
      .collection("pesanan")
      .find({ userId: new ObjectId(userId) })
      .project({ namaItem: 1, jenis: 1, total: 1, createdAt: 1 })
      .toArray();

    res.json({
      status: "success",
      message: "Daftar semua pesanan user",
      data: pesanan,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.delete("/users/:userId/pesanan/:pesananId", async (req, res) => {
  const { userId, pesananId } = req.params;

  try {
    const db = client.db("FULLSTACK");

    const pesanan = await db.collection("pesanan").findOne({
      _id: new ObjectId(pesananId),
      userId: new ObjectId(userId)
    });

    if (!pesanan) {
      return res.status(404).json({
        status: "fail",
        message: "Pesanan tidak ditemukan atau bukan milik user ini",
      });
    }

    const result = await db.collection("pesanan").deleteOne({ _id: new ObjectId(pesananId) });

    res.json({
      status: "success",
      message: "Pesanan berhasil dihapus",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.delete("/users/:userId/pesanan", async (req, res) => {
  const { userId } = req.params;

  try {
    const db = client.db("FULLSTACK");

    const result = await db.collection("pesanan").deleteMany({
      userId: new ObjectId(userId),
    });

    res.json({
      status: "success",
      message: `Berhasil menghapus ${result.deletedCount} pesanan milik user`,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = router;