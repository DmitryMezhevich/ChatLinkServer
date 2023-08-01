const authService = require('../../services/auth/auth-service');
const tokenService = require('../../services/auth/token-service');
const UserDto = require('../../dtos/user-dto');

class AuthController {
    async login(req, res, next) {
        try {
            const { user, user_password: userPassword } = req.body;

            const client = await authService.login(user, userPassword, req);

            const { device_id: deviceID } =
                await authService.registrationDevice(client.user_id, req);

            const tokens = tokenService.generateTokens({
                deviceID: deviceID,
                userID: client.user_id,
            });

            await tokenService.saveRefreshToken(deviceID, tokens.refreshToken);

            res.send(new UserDto({ ...client, ...tokens }));
        } catch (error) {
            next(error);
        }
    }

    async logout(req, res, next) {
        try {
            await authService.logout(req.user.deviceID);
            res.send();
        } catch (error) {
            next(error);
        }
    }

    async registratonEmail(req, res, next) {
        try {
            const { user_email: userEmail } = req.body;

            const userID = await authService.registrationEmail(userEmail);

            res.json({ user_id: userID });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController();
