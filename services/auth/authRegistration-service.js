const sqlRequest = require('../../db/PostgreSQL/dbSQL-helpers/querys/requestSQL-helper');
const emalService = require('../email/email-service');
const authHelper = require('./helpers/auth-helper');
const AuthError = require('../../exceptions/auth-error');

class AuthRegistartion {
    // Registartion new user email
    async registrationEmail(email) {
        let { userID, emailIsActivate } = await sqlRequest.getUser({
            userEmail: email,
        });

        if (emailIsActivate) {
            throw AuthError.UserExists(email);
        }

        const verifyCode = await authHelper.generateVerificationCode();

        if (emailIsActivate !== undefined && !emailIsActivate) {
            await sqlRequest.apdateVerifyCodeForEmail(userID, verifyCode.hash);
        }

        if (emailIsActivate === undefined) {
            userID = await sqlRequest.registerNewEmail(email, verifyCode.hash);
        }

        await emalService.sendVerifyCodeForEmail(email, verifyCode.code);
        return userID;
    }

    // Verify user email
    async verifyEmail(userID, userVerifyCode) {
        const verifyData = await sqlRequest.getVerifyDataByEmail(userID);
        if (!verifyData) {
            throw AuthError.UserNotExists();
        }

        const { verification_code: verifyCode, created_at: createdAt } =
            verifyData;

        const verify = await authHelper.verifyCode(
            createdAt,
            userVerifyCode,
            verifyCode
        );

        if (!verify) {
            throw AuthError.InvalidVerifyCode();
        }

        const user = await sqlRequest.activateEmail(userID);
        return user;
    }

    // Create new user with verify email
    async createNewUser(registrationModule, deviceModule) {
        const userModel = await sqlRequest.getUser({
            userID: registrationModule.userID,
        });

        if (userModel.userName) {
            throw AuthError.UserExists(userModel.userEmail);
        }

        if (!userModel || !userModel.emailIsActivate) {
            throw AuthError.EmailNotActivate(userModel.userEmail);
        }

        const { userPasswordHash, tokens } = await authHelper.getSecurityData(
            registrationModule.userPassword,
            userModel.userID,
            deviceModule.deviceID
        );

        userModel.updatesUserInfo({
            ...registrationModule,
            ...userPasswordHash,
        });

        await sqlRequest.createNewUser(userModel, deviceModule, tokens);

        return { ...userModel, ...tokens };
    }
}

module.exports = new AuthRegistartion();
