module.exports = class TwoFAModel {
    deviceID;
    verificationCode;
    createdAt;

    constructor(module) {
        this.deviceID = module.device_id || module.deviceID;
        this.verificationCode = module.two_fa_verification_code;
        this.createdAt = module.two_fa_created_at;
    }
};
