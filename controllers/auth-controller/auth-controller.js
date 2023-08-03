const { v4: uuidv4 } = require('uuid');

const authService = require('../../services/auth/auth-service');
const tokenService = require('../../services/auth/token-service');
const UserDto = require('../../dtos/auth/user-dto');
const RegistrationDto = require('../../dtos/auth/regitration-dto');
const DeviceDto = require('../../dtos/auth/device-dto');

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

    async verifyEmail(req, res, next) {
        try {
            const { user_id: userID, verify_code: verifyCode } = req.body;

            const user = await authService.verifyEmail(userID, verifyCode);

            res.json(new UserDto(user));
        } catch (error) {
            next(error);
        }
    }

    async registratonUser(req, res, next) {
        try {
            const user = await authService.getUser(req.body.user_id);
            if (user && !user.email_isActivate) {
                throw new Error();
            }

            if (user.user_name) {
                throw new Error();
            }

            const registrationModule = new RegistrationDto(req.body);
            registrationModule.userPassword = await authService.getHashPassword(
                registrationModule.userPassword
            );

            const deviceModule = new DeviceDto({ deviceID: uuidv4(), req });

            const tokensModule = tokenService.generateTokens({
                deviceID: deviceModule.deviceID,
                userID: registrationModule.user_id,
            });

            const client = await authService.createNewUser(
                registrationModule,
                deviceModule,
                tokensModule
            );

            res.send(new UserDto({ ...client, ...tokensModule }));
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController();
