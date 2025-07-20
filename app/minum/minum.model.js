const mongoose = require("mongoose");

const minumSchema = mongoose.Schema(
  {
    nama: { type: String, required: true },
    harga: Number,
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Minum = mongoose.model("Minum", minumSchema, "minuman");

module.exports = Minum;
