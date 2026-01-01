import { ConfigService } from '@nestjs/config';
export declare class SupportNotifierService {
    private readonly configService;
    private readonly logger;
    private readonly transporter;
    private readonly supportInbox?;
    constructor(configService: ConfigService);
    notifySupport(subject: string, body: string): Promise<void>;
    notifyCustomer(email: string, subject: string, body: string): Promise<void>;
    private sendMail;
}
