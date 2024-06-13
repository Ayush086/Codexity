// send otp mail to new user

const nodemailer = require('nodemailer');

const mailSender = async(email, title, body) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        });

        let info = await transporter.sendMail({
            from: "Codexity || Ayush Uttarwar",
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        })
        console.log("\nmail: ", info);

    } catch (error) {
        console.log("\nerror occurred while sending the mail (mailSender.js)  ");
        console.log(error);
    }
}

module.exports = mailSender;
