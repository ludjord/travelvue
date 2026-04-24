const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Package = sequelize.define('Package', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  destination_id: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING(200), allowNull: false },
  description: { type: DataTypes.TEXT },
  price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  duration: { type: DataTypes.INTEGER, allowNull: false, comment: 'days' },
  max_people: { type: DataTypes.INTEGER, defaultValue: 10 },
  image: { type: DataTypes.STRING(255) },
  includes: { type: DataTypes.JSON },
  itinerary: { type: DataTypes.JSON },
  is_featured: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'packages', timestamps: true });

module.exports = Package;
