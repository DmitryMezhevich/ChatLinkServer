const sqlRequest = require('../../helpers/dbSQL-helpers/requestSQL-helper')

class AuthController {
    async sendVerificationCodeByEmail(req, res, next) {
        const result = await sqlRequest.getEmailForVerificationCode(
            req.body.email
        )

        if (!result) {
            res.status(403).send('Error')
        }

        res.json(result.rows[0])
    }

    async cheakVerificationCodeByEmail(req, res, next) {}
}

module.exports = new AuthController()
