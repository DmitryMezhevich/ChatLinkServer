const fs = require('fs/promises');

const nodemailer = require('nodemailer');
const Handlebars = require('handlebars');

class EmailService {
    async #sendEmail(recipient, titel, message) {
        const letter = {
            from: `ChatLink <${process.env.SMTP_USER}>`,
            to: recipient,
            subject: titel,
            html: message,
        };

        await this.transporter.sendMail(letter);
    }

    constructor() {
        this.transporter = nodemailer.createTransport({
            pool: true,
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });
    }

    async sendVerifyCodeForEmail(address, verifyCode) {
        const form = await fs.readFile(
            './services/email/forms/activateEmail.html',
            'utf-8'
        );

        const template = Handlebars.compile(form);
        const htmlResponse = template({
            email: address,
            verifyCode: verifyCode,
            emailSupport: process.env.SMTP_USER,
        });

        await this.#sendEmail(address, 'Activate account', htmlResponse);
    }
}

module.exports = new EmailService();
