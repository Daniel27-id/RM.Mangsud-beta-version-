const mongoose = require("mongoose");

const makanSchema = mongoose.Schema(
  {
    nama: { type: String, required: true },
    harga: Number,
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Makan = mongoose.model("Makan", makanSchema, "makanan");

module.exports = Makan;