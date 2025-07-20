const { mongoUrl } = require("../config");
const mongoose = require("mongoose");

mongoose
  .connect(mongoUrl)
  .then((res) => console.log("Koneksi berhasil"))
  .catch((error) => console.log("Koneksi gagal", error));
