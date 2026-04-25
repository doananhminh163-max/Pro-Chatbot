import nodemailer from 'nodemailer'
import { env } from '../config/env.js'

const transporter = nodemailer.createTransport({
  host: env.smtpHost,
  port: env.smtpPort,
  secure: env.smtpSecure,
  auth: {
    user: env.smtpUser,
    pass: env.smtpPass,
  },
})

function buildResetUrl(token: string) {
  const resetUrl = new URL(env.resetPasswordUrl)
  resetUrl.searchParams.set('token', token)
  return resetUrl.toString()
}

export async function sendResetPasswordEmail(input: {
  to: string
  token: string
  expiresAt: Date
}) {
  const resetUrl = buildResetUrl(input.token)
  const expiresTime = input.expiresAt.toLocaleString('vi-VN', { hour12: false })

  await transporter.sendMail({
    from: env.smtpFrom,
    to: input.to,
    subject: `[${env.appName}] Password reset request`,
    text: [
      `Ban da yeu cau dat lai mat khau cho ${env.appName}.`,
      '',
      `Reset link: ${resetUrl}`,
      `Link het han vao: ${expiresTime}`,
      '',
      'Neu ban khong thuc hien yeu cau nay, hay bo qua email nay.',
    ].join('\n'),
    html: `
      <p>Ban da yeu cau dat lai mat khau cho <strong>${env.appName}</strong>.</p>
      <p>
        Bam vao lien ket ben duoi de dat lai mat khau:<br />
        <a href="${resetUrl}">${resetUrl}</a>
      </p>
      <p>Link het han vao: <strong>${expiresTime}</strong></p>
      <p>Neu ban khong thuc hien yeu cau nay, hay bo qua email nay.</p>
    `,
  })
}
