const nodemailer = require('nodemailer');
module.exports = {
    sendNoReplyMessage: (messageTopic, messageText, userEmail) => {
        let transporter = nodemailer.createTransport({
            host: 'smtp.yandex.ru',
            port: 465,
            secure: true,
            auth: {
                user: 'noreply@versla.ru',
                pass: 't5EKHgtY^^'
            }
        });


        let mailOptions = {
            from: '"Versla" <noreply@versla.ru>',
            to: userEmail,
            subject: messageTopic,
            text: messageText,
            html: messageText
        };


        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent');
        });
    }
};