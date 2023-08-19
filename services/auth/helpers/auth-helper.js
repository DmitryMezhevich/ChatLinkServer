const bcrypt = require('bcrypt');
const moment = require('moment');

const timestep = require('../../../constants/timestep');
const tokenService = require('../token-service');
const sqlRequest = require('../../../db/PostgreSQL/dbSQL-helpers/querys/requestSQL-helper');
const emailService = require('../../email/email-service');
const AuthError = require('../../../exceptions/auth-error');

class AuthHelper {
    async generateVerificationCode() {
        const code = Math.floor(10_000 * (Math.random() + 1));
        const hash = await bcrypt.hash(code.toString(), 12);
        return { code, hash };
    }

    async hash(value) {
        return await bcrypt.hash(value, 12);
    }

    async passwordCompare(userPassword, dbPassword) {
        try {
            return await bcrypt.compare(userPassword, dbPassword);
        } catch {
            throw AuthError.InvalidPassword();
        }
    }

    async getSecurityData(userPassword, userID, deviceID) {
        const userPasswordHash = await this.hash(userPassword);
        const tokens = await tokenService.generateTokens({
            userID: userID,
            deviceID: deviceID,
        });
        return { userPasswordHash, tokens };
    }

    async verifyCode(createTime, firstValue, secondValue) {
        const createdDate = moment(createTime);
        const diff = moment().diff(createdDate, 'seconds');
        const verify = await bcrypt.compare(firstValue, secondValue);
        return diff < timestep.DAY_OF_SECONDS && verify;
    }

    async updateRefreshToken(client, remove2faCode = false) {
        const tokens = await tokenService.generateTokens({
            userID: client.userID,
            deviceID: client.deviceModel.deviceID,
        });

        await sqlRequest.insertRefreshToken(
            client.deviceModel.deviceID,
            tokens.refreshToken,
            remove2faCode
        );

        return client.tokenModel.updateTokens(tokens);
    }

    async updateVerifyCodeFor2FA(deviceID, recipientEmail) {
        const verify = await this.generateVerificationCode();
        await sqlRequest.apdateVerifyCodeFor2FA(deviceID, verify.hash);
        await emailService.sendVerifyCodeForEmail(recipientEmail, verify.code);
    }

    async getClient(user) {
        return await sqlRequest.getUser({
            userEmail: user,
            userName: user,
        });
    }

    async registerNewDevice(deviceModel) {
        return await sqlRequest.createNewDevice(deviceModel);
    }

    async getData2FA(deviceID) {
        return await sqlRequest.getVerifyDataBy2FA(deviceID);
    }

    async removeDevice(deviceID) {
        return await sqlRequest.deleteDevice(deviceID);
    }

    async apdateVerifyCodeForEmail(userID, recipientEmail) {
        const verify = await this.generateVerificationCode();
        await sqlRequest.apdateVerifyCodeForEmail(userID, verify.hash);
        await emailService.sendVerifyCodeForEmail(recipientEmail, verify.code);
    }

    async activateEmail(userID) {
        return await sqlRequest.activateEmail(userID);
    }

    async registerNewClient(user, registartionModel) {
        registartionModel.userPassword = await this.hash(
            registartionModel.userPassword
        );

        user.updatesUserInfo(registartionModel);

        const tokens = await tokenService.generateTokens({
            userID: user.userID,
            deviceID: user.deviceModel.deviceID,
        });

        user.tokenModel.updateTokens({ ...user.deviceModel, tokens });

        await sqlRequest.createNewUser(user);
    }

    async registerNewEmail(userID, userEmail) {
        const verify = await this.generateVerificationCode();
        await sqlRequest.registerNewEmail(userEmail, userID, verify.hash);
        await emailService.sendVerifyCodeForEmail(userEmail, verify.code);
    }
}

module.exports = new AuthHelper();
