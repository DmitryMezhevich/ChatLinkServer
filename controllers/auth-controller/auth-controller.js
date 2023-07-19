const sqlRequest = require('../../db/PostgreSQL/dbSQL-helpers/querys/requestSQL-helper');
const AuthError = require('../../exceptions/auth-error');

class AuthController {
    async login(req, res, next) {
        try {
            const { user, user_password } = req.body;

            const client = await sqlRequest.getUser(user);

            if (!client) {
                throw AuthError.UnauthorizedError(
                    `User ${req.body.user} does not exist`,
                    req
                );
            }

            if (user_password !== client.user_password_hash) {
                throw AuthError.UnauthorizedError('Invalid password', req);
            }

            res.send(client);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}

module.exports = new AuthController();
