require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');

// Import models to register associations
const User = require('./models/User');
const Destination = require('./models/Destination');
const Package = require('./models/Package');
const Booking = require('./models/Booking');
const Testimonial = require('./models/Testimonial');

// Associations
Destination.hasMany(Package, { foreignKey: 'destination_id' });
Package.belongsTo(Destination, { foreignKey: 'destination_id' });

User.hasMany(Booking, { foreignKey: 'user_id' });
Booking.belongsTo(User, { foreignKey: 'user_id' });

Package.hasMany(Booking, { foreignKey: 'package_id' });
Booking.belongsTo(Package, { foreignKey: 'package_id' });

User.hasMany(Testimonial, { foreignKey: 'user_id' });
Testimonial.belongsTo(User, { foreignKey: 'user_id' });

Package.hasMany(Testimonial, { foreignKey: 'package_id' });
Testimonial.belongsTo(Package, { foreignKey: 'package_id' });

const app = express();

// Middleware
app.use(cors()); // Allow all for easier portfolio deployment

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/destinations', require('./routes/destinationRoutes'));
app.use('/api/packages', require('./routes/packageRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/testimonials', require('./routes/testimonialRoutes'));

// Serve Frontend Static Files
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Catch-all route for Vue Router history mode
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ message: 'Not Found' });
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});


// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true }).then(async () => {
  console.log('✅ Database synced');
  app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
}).catch(err => {
  console.error('❌ Database connection failed:', err.message);
  process.exit(1);
});
