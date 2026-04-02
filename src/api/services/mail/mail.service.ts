import { appConfig } from "@main";
import nodemailer from "nodemailer";

export class MailService {
  constructor() {}

  private transporter = nodemailer.createTransport(
    {
      host: appConfig.EMAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: appConfig.EMAIL_LOGIN,
        pass: appConfig.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    },
    {
      from: appConfig.EMAIL_LOGIN,
    }
  );

  async sendMail({
    mail,
    subject,
    message,
  }: {
    mail: string;
    subject: string;
    message: string;
  }) {
    await this.transporter.sendMail({
      to: mail,
      subject: subject,
      text: message,
    });
  }

  async sendHtmlMail({
    mail,
    subject,
    html,
  }: {
    mail: string;
    subject: string;
    html: string;
  }) {
    await this.transporter.sendMail({
      from: `"HH Helper" <${process.env.SMTP_FROM || this.transporter.options.auth?.user}>`,
      to: mail,
      subject: subject,
      html: html,
      // Дополнительные настройки для правильного отображения
      headers: {
        "Content-Type": "text/html; charset=UTF-8",
        "X-Mailer": "HH Helper Mailer",
      },
      // Альтернативная текстовая версия (на случай если клиент не поддерживает HTML)
      text: html.replace(/<[^>]*>/g, ""), // Удаляет HTML теги для текстовой версии
    });
  }

  createStringForSendAuthLink(verificationUrl: string): string {
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .card {
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          padding: 32px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          color: #ffffff;
          font-size: 28px;
          font-weight: 600;
        }
        .content {
          padding: 32px;
          color: #333333;
        }
        .content h2 {
          margin: 0 0 16px 0;
          font-size: 24px;
          color: #1a1a2e;
        }
        .content p {
          margin: 0 0 16px 0;
          line-height: 1.6;
          color: #4a5568;
        }
        .button {
          display: inline-block;
          padding: 12px 32px;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: #ffffff !important;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 500;
          margin: 16px 0;
          transition: transform 0.2s;
        }
        .button:hover {
          transform: translateY(-2px);
        }
        .link {
          word-break: break-all;
          font-size: 12px;
          color: #718096;
          background: #f7fafc;
          padding: 12px;
          border-radius: 8px;
          margin: 16px 0;
        }
        .footer {
          background: #f7fafc;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #718096;
        }
        .footer a {
          color: #3b82f6;
          text-decoration: none;
        }
        @media only screen and (max-width: 600px) {
          .container {
            padding: 10px;
          }
          .content {
            padding: 20px;
          }
          .header h1 {
            font-size: 22px;
          }
          .content h2 {
            font-size: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="header">
            <h1>HH Helper</h1>
          </div>
          <div class="content">
            <h2>Подтверждение регистрации</h2>
            <p>Здравствуйте!</p>
            <p>Спасибо за регистрацию в сервисе <strong>HH Helper</strong>. Для активации вашего аккаунта и начала работы с ботом, пожалуйста, подтвердите ваш email адрес.</p>
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Подтвердить email</a>
            </div>
            <p>Или скопируйте ссылку в браузер:</p>
            <div class="link">
              ${verificationUrl}
            </div>
            <p style="font-size: 12px; color: #a0aec0; margin-top: 24px;">
              Если вы не регистрировались в HH Helper, просто проигнорируйте это письмо.
            </p>
          </div>
          <div class="footer">
            <p>© 2024 HH Helper. Все права защищены.</p>
            <p>
              <a href="${appConfig.CLIENT_URL}/privacy-policy">Политика конфиденциальности</a>
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
    return htmlContent;
  }
}
