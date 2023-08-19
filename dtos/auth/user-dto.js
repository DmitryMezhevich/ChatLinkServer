module.exports = class UserDto {
    user_id;
    user_name;
    user_email;
    user_avatar_url;
    device_id;
    success_token;
    refresh_token;
    enable_2FA;

    constructor(module) {
        this.user_id = module.userID;
        this.user_name = module.userName ?? null;
        this.user_email = module.userEmail;
        this.user_avatar_url = module.userAvatarURL ?? null;
        this.device_id = module.deviceModel.deviceID ?? null;
        this.success_token = module.tokenModel.successToken ?? null;
        this.refresh_token = module.tokenModel.refreshToken ?? null;
        this.email_isActivate = module.emailIsActivate;
        this.enable_2FA = module.enable2FA;
    }
};
