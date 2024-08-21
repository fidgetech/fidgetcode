'use strict';

import { logger } from 'firebase-functions/v2';
import nodemailer from 'nodemailer';

// Configure the email transport using Sendgrid with SMTP
const mailTransport = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.EMAIL_SENDGRID_API_KEY
  }
});

export const sendEmail = async ({ to, subject, body }) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html: body
  };
  // logger.info('Would be sending email', mailOptions);
  await mailTransport.sendMail(mailOptions);
  logger.info('Email sent to:', to);
};
