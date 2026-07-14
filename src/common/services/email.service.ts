import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly config: ConfigService) {
    // https://resend.com/settings/smtp
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('SMTP_HOST'),
      port: this.config.get<number>('SMTP_PORT'),
      secure: true,
      auth: {
        user: this.config.get<string>('SMTP_USER'),
        pass: this.config.get<string>('SMTP_PASS'),
      },
    });
  }

  async send(options: SendMailOptions): Promise<void> {
    await this.transporter.sendMail({
      from: this.config.get<string>('MAIL_FROM'),
      ...options,
    });
  }
}
