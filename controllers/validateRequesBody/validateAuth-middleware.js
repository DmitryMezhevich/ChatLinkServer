const AuthError = require('../../exceptions/auth-error');

class ValidateAuth {
    login(req, res, next) {
        const { user, user_password } = req.body;

        if (!user) {
            return next(
                AuthError.BadRequest(
                    'Required field',
                    `You must have the 'user' field in the request body.`,
                    req,
                    undefined
                )
            );
        }

        if (!user_password) {
            return next(
                AuthError.BadRequest(
                    'Required field',
                    `You must have the 'user_password' field in the request body.`,
                    req,
                    undefined
                )
            );
        }

        next();
    }

    registerEmail(req, res, next) {
        const { user_email } = req.body;

        if (!user_email) {
            return next(
                AuthError.BadRequest(
                    'Required field',
                    `You must have the 'user_email' field in the request body.`
                )
            );
        }

        next();
    }
}

module.exports = new ValidateAuth();
