const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

async function createTransporter() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: (process.env.SMTP_SECURE === 'true'),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    await transporter.verify();
    console.log('Using configured SMTP transporter');
    return { transporter, previewUrl: null };
  } else {
    // Create Ethereal test account for development
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    console.log('Using Ethereal test SMTP account (development).');
    return { transporter, previewUrlBase: 'https://ethereal.email/message/' };
  }
}

async function sendMail(opts) {
  const { transporter, previewUrlBase } = await createTransporter();
  const from = process.env.FROM_EMAIL || '"Teacher-Student Chat" <no-reply@example.com>';
  const info = await transporter.sendMail({
    from,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    text: opts.text
  });
  // If Ethereal used, log preview URL
  if (nodemailer.getTestMessageUrl && nodemailer.getTestMessageUrl(info)) {
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
  return info;
}

module.exports = { sendMail };