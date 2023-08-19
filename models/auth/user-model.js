const { v4: uuidv4 } = require('uuid');

const DeviceModel = require('./device-model');
const EmailActivate = require('./emailActivate-model');
const TokenModel = require('./token-model');
const TwoFAModel = require('./2fa-model');
const ResetPasswordModel = require('./resetPassword-model');

module.exports = class UserModel {
    userID;
    userName;
    userPasswordHash;
    userEmail;
    userAvatarURL;
    enable2FA;
    emailIsActivate;
    createdAt;

    deviceModel;
    emailActivateModel;
    tokenModel;
    twoFAModel;
    resetPasswordModel;

    constructor(module) {
        if (module) {
            this.userID = module.user_id ?? uuidv4();
            this.userPasswordHash = module.user_password_hash;
            this.userName = module.user_name;
            this.userEmail = module.user_email ?? module.userEmail;
            this.userAvatarURL = module.user_avatar_url;
            this.enable2FA = module.enable_2fa;
            this.emailIsActivate = module.user_email_isactivate;
            this.createdAt = module.created_at;
            this.deviceModel = new DeviceModel(module);
            this.emailActivateModel = new EmailActivate(module);
            this.tokenModel = new TokenModel(module);
            this.twoFAModel = new TwoFAModel(module);
            this.resetPasswordModel = new ResetPasswordModel(module);
        }
    }

    updatesUserInfo(module) {
        this.userName = module.userName;
        this.userPasswordHash = module.userPasswordHash;
        this.userAvatarURL = module.userAvatarURL;
    }

    cleareUserInfo() {
        this.userName = null;
        this.userEmail = null;
        this.userAvatarURL = null;
    }

    activateUserEmail() {
        this.emailIsActivate = true;
    }

    convertToArrayForSQL() {
        return [
            this.userName,
            this.userPasswordHash,
            this.userAvatarURL,
            this.userID,
        ];
    }
};
