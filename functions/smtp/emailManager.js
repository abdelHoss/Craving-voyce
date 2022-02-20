require('dotenv').config();
const nodeMailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');


const sendEmail = (email, secretNumber) => {
    const transporter = nodeMailer.createTransport({
        host: 'smtp.yandex.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.SUPPORT_EMAIL,
            pass: process.env.SUPPORT_EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    transporter.use('compile', hbs({
        viewEngine: 'express-handlebars',
        viewEngine: {
            extname: 'handlebars',
            layoutsDir: './smtp/templates/',
            defaultLayout: 'confirmEmail'
        },
        viewPath: './smtp/templates/',
    }));

    const options = {
        from: process.env.SUPPORT_EMAIL,
        to: email,
        subject: 'Confirm your email',
        template: 'confirmEmail',
        context: {
            receiver: email.toString(),
            secretPin: secretNumber
        }
    }

    transporter.sendMail(options, (err) => {
        if (err) {
            console.log('Sending Email Error: ', err);
            return;
        }
    })
}

module.exports = sendEmail;