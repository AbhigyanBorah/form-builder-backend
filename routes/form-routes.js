const router = require('express').Router();
const authMiddleware = require('../middlewares/auth-middleware');
const formController = require('../controllers/form-controller');

router.get('/forms', authMiddleware, formController.getForms);
router.post('/create', authMiddleware, formController.createForm);
router.get('/details/:id', authMiddleware, formController.getDetails);
router.patch('/update', authMiddleware, formController.update);
router.delete('/delete', authMiddleware, formController.delete);

module.exports = router;
