module.exports = class BaseError extends Error {
    httpStatus;
    titel;
    detail;

    constructor(httpStatus, titel, detail = '') {
        super();
        this.httpStatus = httpStatus;
        this.titel = titel;
        this.detail = detail;
    }
};
