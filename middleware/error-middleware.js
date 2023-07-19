const AuthError = require('../exceptions/auth-error');

// eslint-disable-next-line no-unused-vars
module.exports = function (err, req, res, next) {
    if (err instanceof AuthError) {
        return res.status(err.httpStatus).json(err.errResponse);
    }

    res.status(500).json({ message: 'Unexpected error' });
};
