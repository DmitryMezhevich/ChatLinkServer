const Router = require('express').Router;

const authController = require('../../controllers/auth-controller/auth-controller');
const validateAuthRequest = require('../../controllers/validateRequesBody/validateAuth-middleware');
const authMiddleware = require('../../middleware/auth-middleware');
const { validationSuccesToken } = require('../../services/auth/token-service');

const router = new Router();

router.post('/login', validateAuthRequest.login, authController.login);

// router.delete('/logout', authMiddleware, authController.logout);

router.post(
    '/login/2fa/verify',
    validateAuthRequest.login2FA,
    authController.login2FA
);

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
