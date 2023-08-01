const tokenService = require('../services/auth/token-service');
const AuthError = require('../exceptions/auth-error');

module.exports = async (req, res, next) => {
    try {
        const succesToken = req.headers.authorization.split(' ')[1];
        if (!succesToken) {
            throw new Error();
        }

        const paylaod = await tokenService.validationSuccesToken(succesToken);

        if (!paylaod) {
            throw new Error();
        }

        req.user = paylaod;

        next();
    } catch {
        next(AuthError.UnauthorizedError(`User isn't authorization`));
    }
};
