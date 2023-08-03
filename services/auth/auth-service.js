const bcrypt = require('bcrypt');
const moment = require('moment');

const timestep = require('../../constants/timestep');
const sqlRequest = require('../../db/PostgreSQL/dbSQL-helpers/querys/requestSQL-helper');
const tokenService = require('./token-service');
const emalService = require('../email/email-service');
const AuthError = require('../../exceptions/auth-error');

class AuthService {
    async #generateVerificationCode() {
        const code = Math.floor(Math.random() * 100_000);
        const hash = await bcrypt.hash(code.toString(), 12);
        return { code, hash };
    }

    // Registartion new user email
    async registrationEmail(email) {
        let { userID, emailIsActivate } = await sqlRequest.getUser({
            userEmail: email,
        });

        if (emailIsActivate) {
            throw AuthError.BadRequest(
                'This user exists',
                `User ${email} exists`
            );
        }

        const verifyCode = await this.#generateVerificationCode();

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
            throw AuthError.BadRequest(
                'Invalid user',
                'This user does not exists'
            );
        }

        const { verification_code: verifyCode, created_at: createdAt } =
            verifyData;

        const createdDate = moment(createdAt);
        const diff = moment().diff(createdDate, 'seconds');
        const verify = await bcrypt.compare(userVerifyCode, verifyCode);

        if (timestep.DAY_OF_SECONDS < diff || !verify) {
            throw AuthError.BadRequest(
                'Invalid code',
                'This verification code is invalid'
            );
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
            throw AuthError.BadRequest(
                'This user exists',
                `User ${userModel.userEmail} exists`
            );
        }

        if (!userModel || !userModel.emailIsActivate) {
            throw AuthError.BadRequest('Bad request', 'Invalid user data');
        }

        const userPasswordHash = await bcrypt.hash(
            registrationModule.userPassword,
            12
        );
        const tokens = await tokenService.generateTokens({
            userID: userModel.userID,
            deviceID: deviceModule.deviceID,
        });

        userModel.userInfoUpdates({
            ...registrationModule,
            ...userPasswordHash,
        });

        await sqlRequest.createNewUser(userModel, deviceModule, tokens);

        return { ...userModel, ...tokens };
    }
}

module.exports = new AuthService();
