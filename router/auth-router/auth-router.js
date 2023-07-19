const Router = require('express').Router
const router = new Router()
const authController = require('../../controllers/auth-controller/auth-controller')

router.post(
    '/auth/sendEmailForVerification',
    authController.sendVerificationCodeByEmail
)
router.post(
    '/auth/sendVerificationCode',
    authController.cheakVerificationCode
)

module.exports = router
