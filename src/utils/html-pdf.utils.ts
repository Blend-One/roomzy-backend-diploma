import { generatePdf } from 'html-pdf-node';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import { FILE_ERRORS } from '../errors/file.error';

export const htmlToPdf = (html: string, name: string, res: Response) => {
    const options = { format: 'A4' };
    const file = { content: html };

    return generatePdf(file, options, (err, buffer) => {
        if (err) {
            return res.status(500).json({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: FILE_ERRORS.CANNOT_PROCESSING,
            });
        }

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=${name}`,
        });

        res.send(buffer);
    });
};
