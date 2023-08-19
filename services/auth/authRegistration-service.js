const sqlRequest = require('../../db/PostgreSQL/dbSQL-helpers/querys/requestSQL-helper');
const authHelper = require('./helpers/auth-helper');
const AuthError = require('../../exceptions/auth-error');
const UserModel = require('../../models/auth/user-model');

class AuthRegistartion {
    // Registartion new user email
    async registrationEmail(email) {
        const client = await sqlRequest.getUser({
            userEmail: email,
        });

        if (client.emailIsActivate) {
            throw AuthError.UserExists(client.userEmail);
        }

        const newClient = new UserModel({ userEmail: email });

        await authHelper.registerNewEmail(
            newClient.userID,
            newClient.userEmail
        );

        return newClient.userID;
    }

    // Verify user email
    async verifyEmail(userID, userVerifyCode) {
        const client = await sqlRequest.getVerifyDataForEmail(userID);

        if (!client.userID) {
            throw AuthError.UserNotExists();
        }

        const verify = await authHelper.verifyCode(
            client.emailActivateModel.createdAt,
            userVerifyCode,
            client.emailActivateModel.verificationCode
        );

        if (!verify) {
            throw AuthError.InvalidVerifyCode();
        }

        authHelper.activateEmail(client.userID);
        client.activateUserEmail();

        return client;
    }

    // Create new user with verify email
    async createNewUser(registrationModel, headersForDevice) {
        const clients = await sqlRequest.getUsers({
            userID: registrationModel.userID,
            userName: registrationModel.userName,
        });

        const client = clients.map((client) => {
            if (client.userID === registrationModel.userID) {
                return client;
            }
        })[0];

        if (!client.userID) {
            throw AuthError.UserNotExists();
        }

        if (!client.emailIsActivate) {
            throw AuthError.EmailNotActivate(client.userEmail);
        }

        if (client.userName) {
            throw AuthError.UserExists(client.userEmail);
        }

        if (clients.length > 1) {
            throw AuthError.UserExists(registrationModel.userName);
        }

        client.deviceModel.createNewDevice(headersForDevice);
        const newClient = await authHelper.registerNewClient(client, registrationModel);

        return newClient;
    }
}

module.exports = new AuthRegistartion();
