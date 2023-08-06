const sqlRequest = require('../../db/PostgreSQL/dbSQL-helpers/querys/requestSQL-helper');
const authHelper = require('./helpers/auth-helper');
const authRegistartion = require('./authRegistration-service');
const AuthError = require('../../exceptions/auth-error');

class AuthService {
    async login(user, password) {
        const client = sqlRequest.getUser({ userEmail: user, userName: user });

        if (!client) {
            throw AuthError.UserNotExists(user);
        }

        if (!client.emailIsActivate) {
            await authRegistartion.registrationEmail((await client).userEmail);
            return client;
        }

        const validPassword = await authHelper.passwordCompare(
            password,
            client.userPasswordHash
        );

        if (!validPassword) {
            throw AuthError.InvalidPassword();
        }

        if (client.enable2FA) {
            return client;
        }
    }

    async login2FA() {}

    async logout() {}
}

module.exports = new AuthService();
