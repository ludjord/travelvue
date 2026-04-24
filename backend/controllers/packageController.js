const Package = require('../models/Package');
const Destination = require('../models/Destination');

exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 12, destination_id } = req.query;
    const where = {};
    if (destination_id) where.destination_id = destination_id;
    const offset = (page - 1) * limit;
    const { count, rows } = await Package.findAndCountAll({
      where, limit: parseInt(limit), offset: parseInt(offset),
      include: [{ model: Destination, attributes: ['id', 'name', 'country', 'city', 'image'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json({ data: rows, total: count, page: parseInt(page), totalPages: Math.ceil(count / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getFeatured = async (req, res) => {
  try {
    const data = await Package.findAll({
      where: { is_featured: true }, limit: 6,
      include: [{ model: Destination, attributes: ['id', 'name', 'country', 'city', 'image'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const pkg = await Package.findByPk(req.params.id, {
      include: [{ model: Destination, attributes: ['id', 'name', 'country', 'city', 'image', 'description'] }],
    });
    if (!pkg) return res.status(404).json({ message: 'Paket tidak ditemukan' });
    res.json(pkg);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { destination_id, title, description, price, duration, max_people, includes, itinerary, is_featured } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const pkg = await Package.create({ destination_id, title, description, price, duration, max_people, includes: JSON.parse(includes || '[]'), itinerary: JSON.parse(itinerary || '[]'), is_featured, image });
    res.status(201).json(pkg);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const pkg = await Package.findByPk(req.params.id);
    if (!pkg) return res.status(404).json({ message: 'Paket tidak ditemukan' });
    const updateData = { ...req.body };
    if (req.file) updateData.image = `/uploads/${req.file.filename}`;
    if (updateData.includes && typeof updateData.includes === 'string') updateData.includes = JSON.parse(updateData.includes);
    if (updateData.itinerary && typeof updateData.itinerary === 'string') updateData.itinerary = JSON.parse(updateData.itinerary);
    await pkg.update(updateData);
    res.json(pkg);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const pkg = await Package.findByPk(req.params.id);
    if (!pkg) return res.status(404).json({ message: 'Paket tidak ditemukan' });
    await pkg.destroy();
    res.json({ message: 'Paket berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
