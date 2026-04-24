const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/bookingController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.post('/', authMiddleware, ctrl.create);
router.get('/my', authMiddleware, ctrl.getMyBookings);
router.get('/stats', authMiddleware, adminMiddleware, ctrl.getStats);
router.get('/', authMiddleware, adminMiddleware, ctrl.getAll);
router.put('/:id/status', authMiddleware, adminMiddleware, ctrl.updateStatus);

module.exports = router;
