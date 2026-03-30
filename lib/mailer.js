const nodemailer = require('nodemailer');

let transporter;

function smtpEnabled() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_FROM);
}

function getTransporter() {
  if (!smtpEnabled()) return null;
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true',
    auth: process.env.SMTP_USER && process.env.SMTP_PASS
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      : undefined,
  });

  return transporter;
}

async function sendContactEmails({ name, email, channel, subject, message, id }) {
  const mailer = getTransporter();
  const inbox = process.env.CONTACT_INBOX || 'hello@omio.world';
  const from = process.env.SMTP_FROM;

  if (!mailer) {
    return { enabled: false, inbox };
  }

  const normalizedSubject = subject || `New ${channel} inquiry from ${name}`;

  await Promise.all([
    mailer.sendMail({
      from,
      to: inbox,
      replyTo: email,
      subject: `[Contact #${id}] ${normalizedSubject}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Channel: ${channel}`,
        `Subject: ${subject || '(none)'}`,
        '',
        'Message:',
        message,
      ].join('\n'),
    }),
    mailer.sendMail({
      from,
      to: email,
      replyTo: inbox,
      subject: `We received your message${subject ? `: ${subject}` : ''}`,
      text: [
        `Hi ${name},`,
        '',
        'We received your message and will respond within one business day.',
        '',
        `Topic: ${channel}`,
        `Subject: ${subject || '(none)'}`,
        '',
        'Your message:',
        message,
        '',
        `If you need to follow up, reply to ${inbox}.`,
        '',
        'OmiO Software Solutions',
      ].join('\n'),
    }),
  ]);

  return { enabled: true, inbox };
}

module.exports = { sendContactEmails };
