const authService = require('../../services/auth/auth-service');
const UserDto = require('../../dtos/auth/user-dto');
const RegistrationModel = require('../../models/auth/regitration-model');
const DeviceModel = require('../../models/auth/device-model');

class AuthController {
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
            const registrationModule = new RegistrationModel(req.body);
            const deviceModule = new DeviceModel({
                req,
                ...registrationModule,
            });

            const client = await authService.createNewUser(
                registrationModule,
                deviceModule
            );

            res.send(new UserDto(client));
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController();
