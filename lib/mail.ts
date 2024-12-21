import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'mail.eunny.co.za', 
  port: 465, 
  secure: true, 
  auth: {
    user: 'invisiguards@eunny.co.za', 
    pass: process.env.EMAIL_PASSWORD, 
  },
});

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `http://localhost:3000/auth/new-password?token=${token}`;
 

  const mailOptions = {
    from: "invisiguards@eunny.co.za", // sender address
    to: email, // recipient's email
    subject: "Invisiguard - Reset your password",
    html: `<p>Hello there,</p>
           <p>Please reset your password by clicking the link below:</p>
           <a href="${resetLink}">Reset Password</a>
           <p>If you did not request this, please ignore this email.</p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmEmailLink = `http://localhost:3000/auth/new-verification?token=${token}`;

  const mailOptions = {
    from: "invisiguard@eunny.co.za", // sender address
    to: email, // recipient's email
    subject: "Invisiguard - Verify your email address",
    html: `<p>Hello there,</p>
           <p>Thank you for registering. Please verify your email by clicking the link below:</p>
           <a href="${confirmEmailLink}">Verify my Email</a>
           <p>If you did not request this, please ignore this email.</p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => { 
  await transporter.sendMail({
    from: 'invisiguard@eunny.co.za',
    to: email,
    subject: 'Invisiguard - Two-factor authentication',
    html: `<p>Hello there,</p>
           <p>Please verify your two-factor authentication by entering the following code:</p>
           <h2>${token}</h2>
           <p>If you did not request this, please ignore this email.</p>`,
  });
 }
