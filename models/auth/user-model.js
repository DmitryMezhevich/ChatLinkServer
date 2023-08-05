module.exports = class UserModel {
    userID;
    userName;
    userPasswordHash;
    userEmail;
    userAvatarURL;
    enable2FA;
    emailIsActivate;
    createdAt;

    constructor(module) {
        this.userID = module.user_id;
        this.userPasswordHash = module.user_password_hash;
        this.userName = module.user_name;
        this.userEmail = module.user_email;
        this.userAvatarURL = module.user_avatar_url;
        this.enable2FA = module.enable_2fa;
        this.emailIsActivate = module.user_email_isactivate;
        this.createdAt = module.created_at;
    }

    updatesUserInfo(module) {
        this.userName = module.userName;
        this.userPasswordHash = module.userPasswordHash;
        this.userAvatarURL = module.userAvatarURL;
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
