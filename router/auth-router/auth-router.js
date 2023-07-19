const Router = require('express').Router;

const authController = require('../../controllers/auth-controller/auth-controller');
const validateAuthRequest = require('../../controllers/validateRequesBody/validateAuth-middleware');

const router = new Router();

router.post('/login', validateAuthRequest.login, authController.login);

router.post('/login/2fa/verify');

router.get('/login/refresh');

router.post('/register');

router.post('/password/reset');

router.post('/password/reset/code');

module.exports = router;
