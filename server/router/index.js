const Router = require('express').Router;
const userController = require('../controllers/user_controller');
const router = new Router();

// endpoints
router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', userController.gerUsers);

module.exports = router;
