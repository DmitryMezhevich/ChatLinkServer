module.exports = class RegistrationModul {
    userID;
    userName;
    userAvatarUrl;
    userPassword;

    constructor(module) {
        this.userID = module.user_id;
        this.userName = module.user_name;
        this.userAvatarUrl = module.user_avatar_url ?? null;
        this.userPassword = module.user_password;
    }
};