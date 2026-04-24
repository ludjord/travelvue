const Booking = require('../models/Booking');
const Package = require('../models/Package');
const Destination = require('../models/Destination');
const User = require('../models/User');

exports.create = async (req, res) => {
  try {
    const { package_id, travel_date, num_people, notes } = req.body;
    const pkg = await Package.findByPk(package_id);
    if (!pkg) return res.status(404).json({ message: 'Paket tidak ditemukan' });
    const total_price = pkg.price * num_people;
    const booking = await Booking.create({ user_id: req.user.id, package_id, travel_date, num_people, total_price, notes });
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Package, include: [{ model: Destination, attributes: ['name', 'country', 'image'] }] }],
      order: [['createdAt', 'DESC']],
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const where = {};
    if (status) where.status = status;
    const offset = (page - 1) * limit;
    const { count, rows } = await Booking.findAndCountAll({
      where, limit: parseInt(limit), offset: parseInt(offset),
      include: [
        { model: User, attributes: ['id', 'name', 'email', 'phone'] },
        { model: Package, attributes: ['id', 'title', 'price'], include: [{ model: Destination, attributes: ['name', 'country'] }] },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json({ data: rows, total: count, page: parseInt(page), totalPages: Math.ceil(count / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking tidak ditemukan' });
    await booking.update({ status });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const sequelize = require('../config/database');
    const [stats] = await sequelize.query(`
      SELECT 
        COUNT(*) as total_bookings,
        SUM(CASE WHEN status='confirmed' THEN total_price ELSE 0 END) as total_revenue,
        COUNT(CASE WHEN status='pending' THEN 1 END) as pending_count,
        COUNT(CASE WHEN status='confirmed' THEN 1 END) as confirmed_count
      FROM bookings
    `);
    const destCount = await require('../models/Destination').count();
    const pkgCount = await Package.count();
    const userCount = await User.count({ where: { role: 'user' } });
    res.json({ ...stats[0], destinations: destCount, packages: pkgCount, users: userCount });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
