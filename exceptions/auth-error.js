const BaseError = require('./base-error');

module.exports = class AuthError extends BaseError {
    #errorCode;
    errResponse;

    constructor(httpStatus, titel, detail, request, errorCode = 0) {
        super(httpStatus, titel, detail, request);
        this.#errorCode = errorCode;
        this.errResponse = {
            titel: this.titel,
            detail: this.detail,
            request: this.request,
        };
    }

    static BadRequest(titel, detail = '', req, errorCode = 0) {
        return new AuthError(401, titel, detail, req, errorCode);
    }

    static UserNotFound(req) {
        return new AuthError(
            404,
            `User ${req.body.user} does not exist`,
            req,
            undefined
        );
    }

    static UnauthorizedError(detail = '', req) {
        return new AuthError(401, 'Unauthorized error', detail, req);
    }
};
