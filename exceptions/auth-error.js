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

    static BadRequest(titel, detail = '', errorCode = 0) {
        return new AuthError(400, titel, detail, errorCode);
    }

    static UnauthorizedError(detail = '') {
        return new AuthError(401, 'Unauthorized error', detail);
    }

    static UserNotFound(user, detail = '') {
        return new AuthError(404, `User ${user} does not exist`, detail);
    }
};
