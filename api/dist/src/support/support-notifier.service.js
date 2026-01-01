"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var SupportNotifierService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportNotifierService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer_1 = __importDefault(require("nodemailer"));
let SupportNotifierService = SupportNotifierService_1 = class SupportNotifierService {
    configService;
    logger = new common_1.Logger(SupportNotifierService_1.name);
    transporter;
    supportInbox;
    constructor(configService) {
        this.configService = configService;
        this.supportInbox = this.configService.get('SUPPORT_EMAIL');
        const host = this.configService.get('SMTP_HOST');
        if (host) {
            const port = Number(this.configService.get('SMTP_PORT') ?? 587);
            const user = this.configService.get('SMTP_USER');
            const pass = this.configService.get('SMTP_PASS');
            this.transporter = nodemailer_1.default.createTransport({
                host,
                port,
                secure: port === 465,
                auth: user && pass ? { user, pass } : undefined,
            });
        }
        else {
            this.transporter = null;
        }
    }
    async notifySupport(subject, body) {
        if (!this.supportInbox) {
            this.logger.log(`[support-mail] ${subject} -> ${body}`);
            return;
        }
        await this.sendMail(this.supportInbox, subject, body);
    }
    async notifyCustomer(email, subject, body) {
        if (!email) {
            return;
        }
        if (!this.transporter) {
            this.logger.log(`[support-mail:user:${email}] ${subject} -> ${body}`);
            return;
        }
        await this.sendMail(email, subject, body);
    }
    async sendMail(to, subject, text) {
        if (!this.transporter) {
            return;
        }
        await this.transporter.sendMail({
            from: this.configService.get('SMTP_SENDER') ??
                this.supportInbox ??
                'support@lupeti.local',
            to,
            subject,
            text,
        });
    }
};
exports.SupportNotifierService = SupportNotifierService;
exports.SupportNotifierService = SupportNotifierService = SupportNotifierService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SupportNotifierService);
//# sourceMappingURL=support-notifier.service.js.map