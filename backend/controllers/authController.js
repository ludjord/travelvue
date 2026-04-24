const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Nama, email, dan password wajib diisi' });
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ message: 'Email sudah terdaftar' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, phone });
    res.status(201).json({ token: generateToken(user.id), user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email dan password wajib diisi' });
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Email atau password salah' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Email atau password salah' });
    res.json({ token: generateToken(user.id), user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getMe = async (req, res) => {
  res.json(req.user);
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const updateData = { name, phone };
    if (req.file) updateData.avatar = `/uploads/${req.file.filename}`;
    await User.update(updateData, { where: { id: req.user.id } });
    const updated = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
