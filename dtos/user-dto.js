module.exports = class UserDto {
    user_id;
    user_name;
    user_email;
    user_avatar_url;
    success_token;
    refresh_token;
    enable_2FA;

    constructor(module) {
        this.user_id = module.user_id;
        this.user_name = module.user_name;
        this.user_email = module.user_email;
        this.user_avatar_url = module.user_avatar_url;
        this.success_token = module.successToken;
        this.refresh_token = module.refreshToken;
        this.enable_2FA = module.enable_2fa;
    }
};
