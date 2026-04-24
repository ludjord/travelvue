const { Op } = require('sequelize');
const Destination = require('../models/Destination');

exports.getAll = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;
    const where = {};
    if (category && category !== 'all') where.category = category;
    if (search) where.name = { [Op.like]: `%${search}%` };
    const offset = (page - 1) * limit;
    const { count, rows } = await Destination.findAndCountAll({ where, limit: parseInt(limit), offset: parseInt(offset), order: [['createdAt', 'DESC']] });
    res.json({ data: rows, total: count, page: parseInt(page), totalPages: Math.ceil(count / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getFeatured = async (req, res) => {
  try {
    const data = await Destination.findAll({ where: { is_featured: true }, limit: 6, order: [['rating', 'DESC']] });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const dest = await Destination.findByPk(req.params.id);
    if (!dest) return res.status(404).json({ message: 'Destinasi tidak ditemukan' });
    res.json(dest);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, country, city, description, category, rating, is_featured } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const dest = await Destination.create({ name, country, city, description, category, rating, is_featured, image });
    res.status(201).json(dest);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const dest = await Destination.findByPk(req.params.id);
    if (!dest) return res.status(404).json({ message: 'Destinasi tidak ditemukan' });
    const updateData = { ...req.body };
    if (req.file) updateData.image = `/uploads/${req.file.filename}`;
    await dest.update(updateData);
    res.json(dest);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const dest = await Destination.findByPk(req.params.id);
    if (!dest) return res.status(404).json({ message: 'Destinasi tidak ditemukan' });
    await dest.destroy();
    res.json({ message: 'Destinasi berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
