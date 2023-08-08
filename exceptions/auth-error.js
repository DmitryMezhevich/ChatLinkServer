const BaseError = require('./base-error');

module.exports = class AuthError extends BaseError {
    #errorCode;
    errResponse;

    constructor(httpStatus, titel, detail, errorCode = 0) {
        super(httpStatus, titel, detail);
        this.#errorCode = errorCode;
        this.errResponse = {
            titel: this.titel,
            detail: this.detail,
        };
    }

    static BadRequest(titel = 'Bad request', detail = '', errorCode = 0) {
        return new AuthError(400, titel, detail, errorCode);
    }

    static UnauthorizedError(detail = '') {
        return new AuthError(401, 'Unauthorized error', detail);
    }

    static NotFound(titel = 'Not found', detail = '') {
        return new AuthError(404, titel, detail);
    }

    static UserExists(user) {
        return this.BadRequest(undefined, `User ${user} exists`);
    }

    static UserNotExists(user) {
        return this.BadRequest(
            undefined,
            `User${(user ?? ` ${user} `, ' ')}does not exists`
        );
    }

    static InvalidVerifyCode() {
        return this.BadRequest(
            'Invalid verify code',
            'This verification code is invalid'
        );
    }

    static EmailNotActivate(email) {
        return this.BadRequest(
            'Verify user email',
            `Email ${email} not activated`
        );
    }

    static InvalidPassword() {
        return this.BadRequest('Invalid password', 'This password is invalid');
    }

    static UserNotHaveFullInfo(email) {
        return this.NotFound(
            undefined,
            `User ${email} don't have full information. Сomplete the registration`
        );
    }
};
