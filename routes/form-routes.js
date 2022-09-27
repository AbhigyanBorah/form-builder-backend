const router = require('express').Router();
const authMiddleware = require('../middlewares/auth-middleware');
const formController = require('../controllers/form-controller');

router.post('/create', authMiddleware, formController.createForm);
router.get('/details/:id', authMiddleware, formController.getDetails);
router.delete('/delete', authMiddleware, formController.delete);
router.patch('/update', authMiddleware, formController.update);

module.exports = router;
