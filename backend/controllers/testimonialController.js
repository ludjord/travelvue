const Testimonial = require('../models/Testimonial');
const User = require('../models/User');
const Package = require('../models/Package');
const Destination = require('../models/Destination');

exports.getApproved = async (req, res) => {
  try {
    const data = await Testimonial.findAll({
      where: { is_approved: true },
      include: [
        { model: User, attributes: ['name', 'avatar'] },
        { model: Package, attributes: ['title'], include: [{ model: Destination, attributes: ['name', 'country'] }] },
      ],
      order: [['createdAt', 'DESC']],
      limit: 20,
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { package_id, rating, content } = req.body;
    const t = await Testimonial.create({ user_id: req.user.id, package_id, rating, content });
    res.status(201).json(t);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const data = await Testimonial.findAll({
      include: [
        { model: User, attributes: ['name', 'email'] },
        { model: Package, attributes: ['title'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.approve = async (req, res) => {
  try {
    const t = await Testimonial.findByPk(req.params.id);
    if (!t) return res.status(404).json({ message: 'Testimoni tidak ditemukan' });
    await t.update({ is_approved: !t.is_approved });
    res.json(t);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
