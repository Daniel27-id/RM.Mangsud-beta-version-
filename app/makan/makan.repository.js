const Makanan = require("./makan.model");

const findAll = async () => {
  const makanan = await Makanan.find();
  return makanan;
};

const findById = async (id) => {
  const makanan = await Makanan.findById(id);
  return makanan;
};

module.exports = {
  findAll,
  findById,
};