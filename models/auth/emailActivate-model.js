module.exports = class EmailActivateModel {
    userID;
    verificationCode;
    createdAt;

    constructor(module) {
        if (module) {
            this.userID = module.user_id;
            this.verificationCode = module.activate_verification_code;
            this.createdAt = module.activate_created_at;
        }
    }
};
