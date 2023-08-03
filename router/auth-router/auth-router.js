const Router = require('express').Router;

const authController = require('../../controllers/auth-controller/auth-controller');
const validateAuthRequest = require('../../controllers/validateRequesBody/validateAuth-middleware');
const authMiddleware = require('../../middleware/auth-middleware');

const router = new Router();

router.post('/login', validateAuthRequest.login, authController.login);

router.delete('/logout', authMiddleware, authController.logout);

router.post('/login/2fa/verify');

router.get('/login/refresh');

router.post(
    '/register/email',
    validateAuthRequest.registerEmail,
    authController.registratonEmail
);

router.post(
    '/register/email/activate',
    validateAuthRequest.verifyEmail,
    authController.verifyEmail
);

router.post(
    '/register',
    validateAuthRequest.verifyUserData,
    authController.registratonUser
);

router.post('/register');

router.post('/password/reset');

router.post('/password/reset/code');

module.exports = router;
