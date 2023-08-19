const authHelper = require('./helpers/auth-helper');
const authRegistartion = require('./authRegistration-service');
const AuthError = require('../../exceptions/auth-error');

class AuthService {
    async login(user, password, headersForDevice) {
        const client = await authHelper.getClient(user);

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

        client.deviceModel.createNewDevice(headersForDevice);
        await authHelper.registerNewDevice(client.deviceModel);

        if (client.enable2FA) {
            await authHelper.updateVerifyCodeFor2FA(
                client.deviceModel.deviceID,
                client.userEmail
            );

            client.cleareUserInfo();

            return client;
        }

        client.tokenModel = await authHelper.updateRefreshToken(client);

        return client;
    }

    async login2FA(deviceID, userVerifyCode) {
        const client = await authHelper.getData2FA(deviceID);

        if (!client) {
            throw AuthError.UserNotExists();
        }

        const verify = await authHelper.verifyCode(
            client.twoFAModel.createdAt,
            userVerifyCode,
            client.twoFAModel.verificationCode
        );

        if (!verify) {
            throw AuthError.InvalidVerifyCode();
        }

        client.tokenModel = await authHelper.updateRefreshToken(client, true);

        return client;
    }

    async logout(deviceID) {
        await authHelper.removeDevice(deviceID);
    }
}

module.exports = new AuthService();
