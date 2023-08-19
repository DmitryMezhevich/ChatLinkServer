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

        return new UserModule(rows[0]);
    }

    async getUsers({ userEmail, userID, userName }) {
        const { rows } = await dbRequest(sqlQuery.getUser, [
            userID ?? null,
            userEmail ?? null,
            userName ?? null,
        ]);

        return rows.map((user) => {
            return new UserModule(user);
        });
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

    async insertRefreshToken(deviceID, token, removeData2FA = false) {
        try {
            await dbRequest(sqlQuery.begin);
            await dbRequest(sqlQuery.insertRefreshToken, [deviceID, token]);
            if (removeData2FA) {
                await dbRequest(sqlQuery.deleteVerifyCodeFor2FA, [deviceID]);
            }
            await dbRequest(sqlQuery.commit);
        } catch (error) {
            await dbRequest(sqlQuery.rollback);
            throw error;
        }
    }

    async deleteDevice(deviceID) {
        try {
            await dbRequest(sqlQuery.begin);
            await dbRequest(sqlQuery.deleteRefreshToken, [deviceID]);
            const { rows } = await dbRequest(sqlQuery.deleteDevice, [deviceID]);
            await dbRequest(sqlQuery.deleteRefreshToken, [deviceID]);
            await dbRequest(sqlQuery.commit);

            return rows[0];
        } catch (error) {
            await dbRequest(sqlQuery.rollback);
            throw error;
        }
    }

    async registerNewEmail(userEmail, userID, hashVerifyCode) {
        try {
            await dbRequest(sqlQuery.begin);

            await dbRequest(sqlQuery.insertNewEmail, [userID, userEmail]);
            await dbRequest(sqlQuery.insertVerifyCodeForEmail, [
                userID,
                hashVerifyCode,
            ]);

            await dbRequest(sqlQuery.commit);
        } catch (error) {
            await dbRequest(sqlQuery.rollback);
            throw error;
        }
    }

    async apdateVerifyCodeForEmail(userID, hashVerifyCode) {
        await dbRequest(sqlQuery.apdateVerificationCodeForEmail, [
            userID,
            hashVerifyCode,
        ]);
    }

    async getVerifyDataForEmail(userID) {
        const { rows } = await dbRequest(sqlQuery.getVerifyDataForEmail, [
            userID,
        ]);
        return new UserModule(rows[0]);
    }

    async getVerifyDataFor2FA(deviceID) {
        const { rows } = await dbRequest(sqlQuery.getUserDataTogether2FA, [
            deviceID,
        ]);
        return new UserModule(rows[0] || {});
    }

    async apdateVerifyCodeFor2FA(deviceID, hashVerifyCode) {
        try {
            await dbRequest(sqlQuery.begin);
            const { rows } = await dbRequest(sqlQuery.getData2FA, [deviceID]);
            if (!rows[0]) {
                await dbRequest(sqlQuery.insertNew2FA, [
                    deviceID,
                    hashVerifyCode,
                ]);
            } else {
                await dbRequest(sqlQuery.update2FA, [deviceID, hashVerifyCode]);
            }
            await dbRequest(sqlQuery.commit);
        } catch (error) {
            await dbRequest(sqlQuery.rollback);
            throw error;
        }
    }

    async activateEmail(userID) {
        try {
            await dbRequest(sqlQuery.begin);
            await dbRequest(sqlQuery.deleteVerifyCodeForEmail, [userID]);
            await dbRequest(sqlQuery.activateEmail, [userID]);
            await dbRequest(sqlQuery.commit);
        } catch (error) {
            await dbRequest(sqlQuery.rollback);
            throw error;
        }
    }

    async createNewUser(user) {
        try {
            await dbRequest(sqlQuery.begin);
            await dbRequest(
                sqlQuery.createNewUser,
                user.convertToArrayForSQL()
            );
            await dbRequest(
                sqlQuery.createDevice,
                user.deviceModel.convertToArrayForSQL()
            );
            await dbRequest(sqlQuery.insertRefreshToken, [
                user.deviceModel.deviceID,
                user.tokenModel.refreshToken,
            ]);
            await dbRequest(sqlQuery.commit);
        } catch (error) {
            await dbRequest(sqlQuery.rollback);
            throw error;
        }
    }

    async createNewDevice(device) {
        try {
            await dbRequest(sqlQuery.begin);
            await dbRequest(
                sqlQuery.createDevice,
                device.convertToArrayForSQL()
            );
            await dbRequest(sqlQuery.commit);
        } catch (error) {
            await dbRequest(sqlQuery.rollback);
            throw error;
        }
    }
}

module.exports = new RequestSQLHelper();
