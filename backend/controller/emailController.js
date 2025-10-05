const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendPurchaseSuccessEmail = async (to, bookTitle) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Book Purchase Successfully',
    text: `Thank you for purchasing "${bookTitle}". Your order has been successfully processed.`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
