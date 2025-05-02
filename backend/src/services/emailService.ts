import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

export const sendConfirmationEmail = async (email: string, code: string, type?: string) => {
  const subject = type !== 'reset' ? 'Подтверждение электронной почты' : 'Восстановление пароля аккаунта';
  const previewText = type !== 'reset' ? "Подтвердите email, чтобы завершить регистрацию" : 'Введите отправленный Вам код в поле кода на странице восстановления пароля';
  const text = `Ваш код подтверждения: ${code} (действителен 5 минут)`;
  const html = type !== 'reset' ? `
    <div style="display: none; max-height: 0px; overflow: hidden;">
      ${previewText}
    </div>
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Подтверждение email</h2>
      <p>Ваш код подтверждения: <strong>${code}</strong></p>
      <p style="color: #888; font-size: 12px;">
        Если вы не регистрировались, проигнорируйте это письмо.
      </p>
    </div>
  ` : 
  `<div style="display: none; max-height: 0px; overflow: hidden;">
      ${previewText}
    </div>
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Восстановление пароля аккаунта</h2>
      <p>Ваш код подтверждения: <strong>${code}</strong></p>
      <p style="color: #888; font-size: 12px;">
        Если это не вы, ироигнорируйте сообщение.
      </p>
    </div>`;
  
  await sendEmail(email, subject, text, html);
};