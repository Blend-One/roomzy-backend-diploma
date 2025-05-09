import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import { FILE_ERRORS } from '../errors/file.error';
import puppeteer from 'puppeteer';

export const htmlToPdf = async (html: string, name: string, res: Response) => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            ignoreDefaultArgs: ['--disable-extensions'],
            ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
        });
        const page = await browser.newPage();
        await page.setContent(html);

        const buffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                left: '0px',
                top: '0px',
                right: '0px',
                bottom: '0px',
            },
        });

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=${name}`,
            'Content-Length': buffer.length,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: 0,
        });

        res.end(buffer);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: FILE_ERRORS.CANNOT_PROCESSING,
        });
    }
};
