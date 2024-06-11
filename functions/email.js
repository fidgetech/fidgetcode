'use strict';

/*********************************************
REQUIRED CONFIGURATION (RUN FROM FUNCTIONS DIR)
firebase functions:config:set email.sendgrid_api key="your_sendgrid_api_key"
firebase functions:config:set email.from="your_email_address"

FOR TESTING WITH FIREBASE EMULATOR (RUN FROM FUNCTIONS DIR):
firebase functions:config:get > .runtimeconfig.json
*********************************************/

const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

// Configure the email transport using Sendgrid with SMTP
const mailTransport = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: functions.config().email.sendgrid_api_key
  }
});

exports.sendEmail = async ({ to, subject, body }) => {
  const from = functions.config().email.from;
  const mailOptions = {
    from,
    to,
    subject,
    html: body
  };
  functions.logger.info(`Would be sending email from ${from} to ${to} with subject ${subject} and body ${body}`);
  // await mailTransport.sendMail(mailOptions);
  // functions.logger.info('Email sent to:', to);
};
