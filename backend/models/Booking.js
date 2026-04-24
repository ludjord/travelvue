const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Booking = sequelize.define('Booking', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  package_id: { type: DataTypes.INTEGER, allowNull: false },
  travel_date: { type: DataTypes.DATEONLY, allowNull: false },
  num_people: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  total_price: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'), defaultValue: 'pending' },
  notes: { type: DataTypes.TEXT },
}, { tableName: 'bookings', timestamps: true });

module.exports = Booking;
