const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/testimonialController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.get('/', ctrl.getApproved);
router.post('/', authMiddleware, ctrl.create);
router.get('/all', authMiddleware, adminMiddleware, ctrl.getAll);
router.put('/:id/approve', authMiddleware, adminMiddleware, ctrl.approve);

module.exports = router;
