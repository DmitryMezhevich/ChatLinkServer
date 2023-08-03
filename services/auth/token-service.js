const jwt = require('jsonwebtoken');

const sqlRequest = require('../../db/PostgreSQL/dbSQL-helpers/querys/requestSQL-helper');

class TokenService {
    generateTokens(payloud) {
        const successToken = jwt.sign(payloud, process.env.JWT_ACCESS_SECRET, {
            expiresIn: '1h',
        });
        const refreshToken = jwt.sign(payloud, process.env.JWT_REFRESH_SECRET, {
            expiresIn: '1h',
        });
        return { successToken, refreshToken };
    }

    async validationSuccesToken(token) {
        const payloud = await jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        const device = await sqlRequest.getUserDevice(payloud.deviceID);

        return device ? payloud : null;
    }
}

module.exports = new TokenService();
