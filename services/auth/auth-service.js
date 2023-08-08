const sqlRequest = require('../../db/PostgreSQL/dbSQL-helpers/querys/requestSQL-helper');
const authHelper = require('./helpers/auth-helper');
const authRegistartion = require('./authRegistration-service');
const AuthError = require('../../exceptions/auth-error');
const emailService = require('../email/email-service');

class AuthService {
    async login(user, password, deviceModule) {
        const client = await sqlRequest.getUser({
            userEmail: user,
            userName: user,
        });

        if (!client) {
            throw AuthError.UserNotExists(user);
        }

        if (!client.emailIsActivate) {
            await authRegistartion.registrationEmail(client.userEmail);
            return client;
        }

        if (!client.userName) {
            throw AuthError.UserNotHaveFullInfo(client.userEmail);
        }

        await authHelper.passwordCompare(password, client.userPasswordHash);

        deviceModule.userID = client.userID;
        await sqlRequest.createNewDevice(deviceModule);

        if (client.enable2FA) {
            const verifyCode = await authHelper.generateVerificationCode();

            await sqlRequest.apdateVerifyCodeFor2FA(
                deviceModule.deviceID,
                verifyCode.hash
            );

            await emailService.sendVerifyCodeForEmail(
                client.userEmail,
                verifyCode.code
            );

            client.deviceID = deviceModule.deviceID;
            client.userName = null;
            client.userEmail = null;
            client.userAvatarURL = null;
            return client;
        }
    }

    async login2FA() {}

    async logout() {}
}

module.exports = new AuthService();
