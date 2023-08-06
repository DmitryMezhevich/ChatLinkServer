const bcrypt = require('bcrypt');
const moment = require('moment');

const timestep = require('../../../constants/timestep');
const tokenService = require('../token-service');

class AuthHelper {
    async generateVerificationCode() {
        const code = Math.floor(Math.random() * 100_000);
        const hash = await bcrypt.hash(code.toString(), 12);
        return { code, hash };
    }

    async hash(value) {
        return await bcrypt.hash(value, 12);
    }

    async passwordCompare(userPassword, dbPassword) {
        return await bcrypt.compare(userPassword, dbPassword);
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
}

module.exports = new AuthHelper();
