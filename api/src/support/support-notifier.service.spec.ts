import nodemailer from 'nodemailer';
import { SupportNotifierService } from './support-notifier.service';

jest.mock('nodemailer', () => ({ __esModule: true, default: { createTransport: jest.fn() } }));

describe('SupportNotifierService', () => {
  it('sends customer and support messages through the configured transport', async () => {
    const sendMail = jest.fn().mockResolvedValue({});
    jest.mocked(nodemailer.createTransport).mockReturnValue({ sendMail } as never);
    const values: Record<string, string> = {
      SMTP_HOST: 'smtp.example.test', SMTP_PORT: '587',
      SMTP_SENDER: 'store@example.test', SUPPORT_EMAIL: 'support@example.test',
    };
    const notifier = new SupportNotifierService({ get: (key: string) => values[key] } as never);
    await notifier.notifyCustomer('customer@example.test', 'Order', 'Confirmed');
    await notifier.notifySupport('Ticket', 'Message');
    expect(sendMail).toHaveBeenCalledWith(expect.objectContaining({ to: 'customer@example.test', subject: 'Order', text: 'Confirmed' }));
    expect(sendMail).toHaveBeenCalledWith(expect.objectContaining({ to: 'support@example.test', subject: 'Ticket', text: 'Message' }));
  });
});
