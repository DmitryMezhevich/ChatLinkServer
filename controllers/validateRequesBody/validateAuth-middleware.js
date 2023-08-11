const AuthError = require('../../exceptions/auth-error');

class ValidateAuth {
    login(req, res, next) {
        const { user, user_password } = req.body;

        if (!user || !user_password) {
            return next(
                AuthError.BadRequest(
                    'Required field',
                    `You must have the 'user' and 'user_password' fields in the request body.`,
                    req,
                    undefined
                )
            );
        }

        next();
    }

    login2FA(req, res, next) {
        const { device_id, verification_code } = req.body;

        if (!device_id || !verification_code) {
            return next(
                AuthError.BadRequest(
                    'Required field',
                    `You must have the 'device_id' and 'verification_code' fields in the request body.`,
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

    verifyEmail(req, res, next) {
        const { user_id, verify_code } = req.body;

        if (!user_id || !verify_code) {
            return next(
                AuthError.BadRequest(
                    'Required field',
                    `You must have the 'user_id' and 'verify_code' fields in the request body.`
                )
            );
        }

        next();
    }

    verifyUserData(req, res, next) {
        const { user_id, user_name, user_password } = req.body;

        if (!user_id || !user_name || !user_password) {
            return next(
                AuthError.BadRequest(
                    'Required field',
                    `You must have the 'user_id', 'user_name' and 'user_password' fields in the request body.`
                )
            );
        }

        next();
    }
}

module.exports = new ValidateAuth();
