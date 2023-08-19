const sqlRequest = require('../../db/PostgreSQL/dbSQL-helpers/querys/requestSQL-helper');
const authHelper = require('./helpers/auth-helper');
const AuthError = require('../../exceptions/auth-error');
const UserModel = require('../../models/auth/user-model');

class AuthRegistartion {
    // Registartion new user email
    async registrationEmail(email) {
        const user = await sqlRequest.getUser({
            userEmail: email,
        });

        if (user.emailIsActivate) {
            throw AuthError.UserExists(user.userEmail);
        }

        const newClient = new UserModel({ userEmail: email });

        await authHelper.registerNewEmail(newClient.userID, newClient.userEmail);

        return newClient.userID;
    }

    // Verify user email
    async verifyEmail(userID, userVerifyCode) {
        const client = await sqlRequest.getVerifyDataByEmail(userID);

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

        client.emailIsActivate = await authHelper.activateEmail(client.userID);
        return client;
    }

    // Create new user with verify email
    async createNewUser(registrationModel, headersForDevice) {
        const clients = await sqlRequest.getUsers({
            userID: registrationModel.userID,
            userName: registrationModel.userName,
        });

        const client = clients.map((client) => {
            return client.userID === registrationModel.userID;
        })[0];

        if (!client.userID) {
            throw AuthError.UserNotExists();
        }

        if (client.emailIsActivate) {
            throw AuthError.EmailNotActivate(client.userEmail);
        }

        if (client.userName) {
            throw AuthError.UserExists(client.userEmail);
        }

        if (clients.length > 1) {
            throw AuthError.UserExists(registrationModel.userName);
        }

        client.divecModel.createNewDevice(headersForDevice);
        await authHelper.registerNewClient(client, registrationModel);

        return client;
    }
}

module.exports = new AuthRegistartion();
