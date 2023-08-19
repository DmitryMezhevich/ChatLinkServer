module.exports = class TokenModel {
    deviceID;
    refreshToken;
    successToken;

    constructor(module) {
        this.deviceID = module.device_id || module.deviceID;
        this.refreshToken = module.refresh_token || module.refreshToken;
        this.successToken = module.successToken;
    }

    updateTokens(module) {
        this.deviceID = this.deviceID ?? module.deviceID;
        this.refreshToken = module.refreshToken;
        this.successToken = module.successToken;
        return this;
    }
};
