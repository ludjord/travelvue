const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Testimonial = sequelize.define('Testimonial', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  package_id: { type: DataTypes.INTEGER, allowNull: false },
  rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
  content: { type: DataTypes.TEXT, allowNull: false },
  is_approved: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'testimonials', timestamps: true });

module.exports = Testimonial;
