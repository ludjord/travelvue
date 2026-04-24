const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Destination = sequelize.define('Destination', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(150), allowNull: false },
  country: { type: DataTypes.STRING(100), allowNull: false },
  city: { type: DataTypes.STRING(100) },
  description: { type: DataTypes.TEXT },
  image: { type: DataTypes.STRING(255) },
  category: { type: DataTypes.ENUM('beach', 'mountain', 'city', 'cultural', 'adventure', 'nature'), defaultValue: 'nature' },
  rating: { type: DataTypes.DECIMAL(3, 1), defaultValue: 0 },
  review_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  is_featured: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'destinations', timestamps: true });

module.exports = Destination;
