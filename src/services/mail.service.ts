import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { SendMail } from '../types/mail.types';

@Injectable()
export default class MailService {
    private transporter: Mail;

    constructor() {
        this.transporter = createTransport({
            secure: true,
            service: 'gmail',
            port: Number(process.env.EMAIL_PORT),
            host: String(process.env.EMAIL_SERVER),
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }

    public async sendEmail({ emailTo, text, html, subject }: SendMail): Promise<void> {
        return this.transporter.sendMail({
            from: String(process.env.EMAIL_SERVER),
            to: emailTo,
            subject,
            html: html ?? '',
            text: text ?? '',
        });
    }
}
