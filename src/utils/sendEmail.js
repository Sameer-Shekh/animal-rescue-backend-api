// import dotenv from 'dotenv';
// import {nodeMailer} from 'nodemailer';

// dotenv.config();

// const sendEmail = async (options) => {
//     const transporter = nodeMailer.createTransport({
//         service: process.env.EMAIL_SERVICE,
//         auth: {
//             user: process.env.EMAIL_USERNAME,
//             pass: process.env.EMAIL_PASSWORD
//         }
//     });

//     const mailOptions = {
//         from: process.env.EMAIL_FROM,
//         to: options.to,
//         subject: options.subject,
//         text: options.message
//     };

//     await transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             return console.log(error);
//         }
//         console.log('Email sent: ' + info.response);
//     });
// }

// export default sendEmail;