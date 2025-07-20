const { findAll, findById } = require("./minum.repository");

const getAllMinuman = async () => {
  const minuman = await findAll();
  return minuman;
};

const getMinumanById = async (id) => {
  const minuman = await findById(id);
  if (!minuman) {
    throw Error("minuman tidak ditemukan");
  }
  return minuman;
};

module.exports = {
  getAllMinuman,
  getMinumanById,
};
