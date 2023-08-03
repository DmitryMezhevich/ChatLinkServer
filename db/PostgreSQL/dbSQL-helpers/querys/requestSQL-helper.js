const dbRequest = require('../../index');
const sqlQuery = require('./module/queryHelper').queries;
const UserModule = require('../../../../models/auth/user-model');

class RequestSQLHelper {
    async getUser({ userEmail, userID, userName }) {
        const { rows } = await dbRequest(sqlQuery.getUser, [
            userID ?? null,
            userEmail ?? null,
            userName ?? null,
        ]);

        return new UserModule(rows[0] ?? {});
    }

    async createDevice(userID, deviceName, deviceNameApp, deviceIP) {
        const { rows } = await dbRequest(sqlQuery.createDevice, [
            userID,
            deviceName,
            deviceNameApp,
            deviceIP,
        ]);

        return rows[0];
    }

    async getUserDevice(deviceID) {
        const { rows } = await dbRequest(sqlQuery.getUserDevice, [deviceID]);
        return rows[0];
    }

    async insertRefreshToken(deviceID, token) {
        await dbRequest(sqlQuery.insertRefreshToken, [deviceID, token]);
    }

    async deleteDevice(device_id) {
        try {
            await dbRequest(sqlQuery.begin);
            await dbRequest(sqlQuery.deleteRefreshToken, [device_id]);
            const { rows } = await dbRequest(sqlQuery.deleteDevice, [
                device_id,
            ]);
            await dbRequest(sqlQuery.commit);

            return rows[0];
        } catch (error) {
            await dbRequest(sqlQuery.rollback);
            throw error;
        }
    }

    async registerNewEmail(email, hashVerifyCode) {
        try {
            await dbRequest(sqlQuery.begin);
            const { rows } = await dbRequest(sqlQuery.insertNewEmail, [email]);
            const userID = rows[0].user_id;
            await dbRequest(sqlQuery.insertVerifyCodeByEmail, [
                userID,
                hashVerifyCode,
            ]);
            await dbRequest(sqlQuery.commit);

            return userID;
        } catch (error) {
            await dbRequest(sqlQuery.rollback);
            throw error;
        }
    }

    async apdateVerifyCodeForEmail(userID, hashVerifyCode) {
        await dbRequest(sqlQuery.apdateVerificationCodeByEmail, [
            userID,
            hashVerifyCode,
        ]);
    }

    async getVerifyDataByEmail(userID) {
        const { rows } = await dbRequest(sqlQuery.getVerifyDataByEmail, [
            userID,
        ]);
        return rows[0];
    }

    async activateEmail(userID) {
        try {
            await dbRequest(sqlQuery.begin);
            await dbRequest(sqlQuery.deleteVerifyCodeByEmail, [userID]);
            const { rows } = await dbRequest(sqlQuery.activateEmail, [userID]);
            await dbRequest(sqlQuery.commit);
            return new UserModule(rows[0] ?? {});
        } catch (error) {
            await dbRequest(sqlQuery.rollback);
            throw error;
        }
    }

    async createNewUser(user, device, tokens) {
        try {
            await dbRequest(sqlQuery.begin);
            await dbRequest(
                sqlQuery.createNewUser,
                user.convertToArrayForSQL()
            );
            await dbRequest(
                sqlQuery.createDevice,
                device.convertToArrayForSQL()
            );
            await dbRequest(sqlQuery.insertRefreshToken, [
                device.deviceID,
                tokens.refreshToken,
            ]);
            await dbRequest(sqlQuery.commit);
        } catch (error) {
            await dbRequest(sqlQuery.rollback);
            throw error;
        }
    }
}

module.exports = new RequestSQLHelper();
