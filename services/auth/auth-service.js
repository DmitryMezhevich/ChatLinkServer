const bcrypt = require('bcrypt');

const sqlRequest = require('../../db/PostgreSQL/dbSQL-helpers/querys/requestSQL-helper');
const AuthError = require('../../exceptions/auth-error');

class AuthService {
    async getUser(user) {
        const client = await sqlRequest.getUser(user);
        return client ?? {};
    }

    async login(user, passord) {
        const client = await this.getUser(user);

        if (!client) {
            throw AuthError.UnauthorizedError(`User ${user} does not exist`);
        }

        const isPasswordEquals = await bcrypt.compare(
            passord,
            client.user_password_hash
        );

        if (!isPasswordEquals) {
            throw AuthError.UnauthorizedError('Invalid password');
        }

        return client;
    }

    async logout(deviceID) {
        const device = await sqlRequest.deleteDevice(deviceID);
        return device;
    }

    async registrationDevice(userID, req) {
        const userAgent = req.headers['user-agent'].split(' ');
        const deviceName = userAgent.shift();
        const deviceNameApp = userAgent.join(' ');
        const deviceIP = req.headers['x-forwarded-for'].split(' ')[0];

        return await sqlRequest.createDevice(
            userID,
            deviceName,
            deviceNameApp,
            deviceIP
        );
    }

    async registrationEmail(email) {
        const { user_id: userID, user_email_isactivate: isActivate } =
            await this.getUser(email);

        if (isActivate) {
            throw AuthError.BadRequest(
                'This user exists',
                `User ${email} exists`
            );
        }

        const verifyCode = Math.floor(Math.random() * 100_000);
        const hashVerifyCode = await bcrypt.hash(verifyCode.toString(), 12);

        if (isActivate !== undefined && !isActivate) {
            await sqlRequest.apdateVerifyCodeByEmail(userID, hashVerifyCode);

            return userID;
        } else {
            const newUserID = await sqlRequest.insertNewEmail(
                email,
                hashVerifyCode
            );

            return newUserID;
        }
    }
}

module.exports = new AuthService();
