module.exports = class BaseError extends Error {
    httpStatus;
    titel;
    detail;
    request;

    constructor(httpStatus, titel, detail = '', request) {
        super();
        this.httpStatus = httpStatus;
        this.titel = titel;
        this.detail = detail;
        this.request =
            request.method +
            ' ' +
            request.headers['host'] +
            request.originalUrl;
    }
};
