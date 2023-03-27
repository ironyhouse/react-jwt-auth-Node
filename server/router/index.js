const Router = require('express').Router;

const router = new Router();

// endpoints
router.post('/registration');
router.post('/login');
router.post('/logout');
router.get('/activate/:link');
router.get('/refresh');
router.get('/users');

module.exports = router;
