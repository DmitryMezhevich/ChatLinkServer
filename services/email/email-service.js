const fs = require('fs/promises');

const nodemailer = require('nodemailer');
const Handlebars = require('handlebars');

class EmailService {
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

    async sendVerifyCode(toEmail, verifyCode) {
        const form = await fs.readFile(
            './services/email/forms/activateEmail.html',
            'utf-8'
        );

        const template = Handlebars.compile(form);
        const htmlResponse = template({
            email: toEmail,
            verifyCode: verifyCode,
        });

        const message = {
            from: `ChatLink <${process.env.SMTP_USER}>`,
            to: toEmail,
            subject: 'Activate account',
            html: htmlResponse,
        };

        await this.transporter.sendMail(message);
    }
}

module.exports = new EmailService();
