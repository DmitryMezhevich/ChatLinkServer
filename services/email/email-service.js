const nodemailer = require('nodemailer');
const fs = require('fs/promises');

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
        const form = await fs.readFile('./services/email/form.html');
        const message = {
            from: 'ChatLink',
            to: toEmail,
            subject: 'Activate',
            html: form,
        };

        // const message = {
        //     from: 'ChatLink',
        //     to: toEmail,
        //     subject: 'Activate',
        //     html: `
        //         <div>
        //             <h1>Verify code: ${verifyCode}</h1>
        //         </div>
        //     `,
        // };

        await this.transporter.sendMail(message);
    }
}

module.exports = new EmailService();
