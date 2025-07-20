const { findAll, findById } = require("./makan.repository");

const getAllMakanan = async () => {
  const makanan = await findAll();
  return makanan;
};

const getMakanById = async (id) => {
  const makanan = await findById(id);
  if (!makanan) {
    throw Error("makanan tidak ditemukan");
  }
  return makanan;
};

module.exports = {
  getAllMakanan,
  getMakanById,
};