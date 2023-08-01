const AuthError = require('../exceptions/auth-error');

// eslint-disable-next-line no-unused-vars
module.exports = function (err, req, res, next) {
    console.log(err);

    const request = req.method + ' ' + req.headers['host'] + req.originalUrl;

    if (err instanceof AuthError) {
        return res
            .status(err.httpStatus)
            .json({ ...err.errResponse, request: request });
    }

    res.status(500).json({ message: 'Unexpected error' });
};
