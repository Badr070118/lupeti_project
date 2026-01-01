import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { SendMailOptions } from 'nodemailer';

type MailTransport = {
  sendMail: (mail: SendMailOptions) => Promise<unknown>;
};

@Injectable()
export class SupportNotifierService {
  private readonly logger = new Logger(SupportNotifierService.name);
  private readonly transporter: MailTransport | null;
  private readonly supportInbox?: string;

  constructor(private readonly configService: ConfigService) {
    this.supportInbox = this.configService.get<string>('SUPPORT_EMAIL');
    const host = this.configService.get<string>('SMTP_HOST');
    if (host) {
      const port = Number(this.configService.get<string>('SMTP_PORT') ?? 587);
      const user = this.configService.get<string>('SMTP_USER');
      const pass = this.configService.get<string>('SMTP_PASS');
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: user && pass ? { user, pass } : undefined,
      });
    } else {
      this.transporter = null;
    }
  }

  async notifySupport(subject: string, body: string) {
    if (!this.supportInbox) {
      this.logger.log(`[support-mail] ${subject} -> ${body}`);
      return;
    }
    await this.sendMail(this.supportInbox, subject, body);
  }

  async notifyCustomer(email: string, subject: string, body: string) {
    if (!email) {
      return;
    }
    if (!this.transporter) {
      this.logger.log(`[support-mail:user:${email}] ${subject} -> ${body}`);
      return;
    }
    await this.sendMail(email, subject, body);
  }

  private async sendMail(to: string, subject: string, text: string) {
    if (!this.transporter) {
      return;
    }
    await this.transporter.sendMail({
      from:
        this.configService.get<string>('SMTP_SENDER') ??
        this.supportInbox ??
        'support@lupeti.local',
      to,
      subject,
      text,
    });
  }
}
