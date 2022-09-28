const router = require('express').Router();
const userController = require('../controllers/user-controller');
const authMiddleware = require('../middlewares/auth-middleware');

router.patch('/info', authMiddleware, userController.updatePersonalInfo);
router.patch('/change-password', authMiddleware, userController.changePassword);
router.delete('/delete-account', authMiddleware, userController.deleteAccount);

module.exports = router;
