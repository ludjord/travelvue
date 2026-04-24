const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/destinationController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', ctrl.getAll);
router.get('/featured', ctrl.getFeatured);
router.get('/:id', ctrl.getById);
router.post('/', authMiddleware, adminMiddleware, upload.single('image'), ctrl.create);
router.put('/:id', authMiddleware, adminMiddleware, upload.single('image'), ctrl.update);
router.delete('/:id', authMiddleware, adminMiddleware, ctrl.remove);

module.exports = router;
