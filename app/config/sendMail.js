const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();
const smtpTransport = require("nodemailer-smtp-transport");

exports.sendMail = async (to, subject, text) => {
  
  try {
		var transporter = nodemailer.createTransport(
			smtpTransport({
				pool: true,
				port: 587,
				secure: true,
				service: "gmail",
				host: "smtp.gmail.com",
				auth: {
					user: 'sonali.p@codiste.com',
					pass: 'zfaewunmmmdhmhvp',
				},
			})
		);
		transporter.sendMail(
			{
                from: 'jigesh.v@codiste.com',
                to: to,
                subject: subject,
                html: text,
            },
			function (error, info) {
				if (error) {
					console.log(error);
				} else {
					console.log("Email sent SuccessFully: ", 'emailTo');
				}
			}
		);
	} catch (error) {
		throw error;
	}
};
