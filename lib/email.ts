import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
} as any);

export const sendEmail = async ({ to, subject, html }: { to: string; subject: string; html: string }) => {
  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || '"CBT System" <system@example.com>',
    to,
    subject,
    html,
  });
  return info;
};
