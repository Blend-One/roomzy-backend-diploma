export interface SendMail {
    emailTo: string;
    subject: string;
    html?: string;
    text?: string;
}
