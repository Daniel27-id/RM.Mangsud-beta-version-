const Minuman = require("./minum.model");

const findAll = async () => {
  const minuman = await Minuman.find();
  return minuman;
};

const findById = async (id) => {
  const minuman = await Minuman.findById(id);
  return minuman;
};

module.exports = {
  findAll,
  findById,
};
