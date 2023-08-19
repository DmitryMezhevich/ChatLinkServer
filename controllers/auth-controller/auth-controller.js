const authRegistartion = require('../../services/auth/authRegistration-service');
const auth = require('../../services/auth/auth-service');
const UserDto = require('../../dtos/auth/user-dto');
const RegistrationModel = require('../../models/auth/regitration-model');

class AuthController {
    // REGISTRATION
    async registratonEmail(req, res, next) {
        try {
            const { user_email: userEmail } = req.body;

            const userID = await authRegistartion.registrationEmail(userEmail);

            res.json({ user_id: userID });
        } catch (error) {
            next(error);
        }
    }

    async verifyEmail(req, res, next) {
        try {
            const { user_id: userID, verify_code: verifyCode } = req.body;

            const user = await authRegistartion.verifyEmail(userID, verifyCode);

            res.json(new UserDto(user));
        } catch (error) {
            next(error);
        }
    }

    async registratonUser(req, res, next) {
        try {
            const registrationModel = new RegistrationModel(req.body);

            const client = await authRegistartion.createNewUser(
                registrationModel,
                {
                    userAgent: req.headers['user-agent'],
                    xForwardedFor: req.headers['x-forwarded-for'],
                }
            );

            res.json(new UserDto(client));
        } catch (error) {
            next(error);
        }
    }

    //LOGIN, LOGOUT

    async login(req, res, next) {
        try {
            const { user, user_password: userPassword } = req.body;

            const client = await auth.login(user, userPassword, {
                userAgent: req.headers['user-agent'],
                xForwardedFor: req.headers['x-forwarded-for'],
            });

            res.json(new UserDto(client));
        } catch (error) {
            next(error);
        }
    }

    async login2FA(req, res, next) {
        try {
            const { device_id: deviceID, verification_code: verificationCode } =
                req.body;

            const client = await auth.login2FA(deviceID, verificationCode);

            res.json(new UserDto(client));
        } catch (error) {
            next(error);
        }
    }

    async logout(req, res, next) {
        try {
            const deviceID = req.user.deviceID;

            await auth.logout(deviceID);

            res.send();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController();
