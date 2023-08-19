module.exports = class ResetPasswordModel {
    userID;
    deviceID;
    resetCode;
    createdAt;

    constructor(module) {
        this.userID = module.user_id || module.userID;
        this.deviceID = module.device_id || module.deviceID;
        this.resetCode = module.reset_code;
        this.createdAt = module.reset_created_at;
    }
};
