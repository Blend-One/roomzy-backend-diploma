import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import { FILE_ERRORS } from '../errors/file.error';
import { base64ToArrayBuffer } from './document.utils';

export const getParamsForPdfFormatting = (name: string, data: string) => ({
    Parameters: [
        {
            Name: 'File',
            FileValue: {
                Name: `${name}.html`,
                Data: data,
            },
        },
        {
            Name: 'PageSize',
            Value: 'b3',
        },
    ],
});

export const htmlToPdf = async (base64Html: string, name: string, res: Response) => {
    try {
        const paramsData = getParamsForPdfFormatting(name, base64Html);
        const data = await fetch(process.env.PDF_FORMATTER_URL, {
            method: 'POST',
            body: JSON.stringify(paramsData),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.PDF_FORMATTER_SECRET_KEY}`,
            },
        }).then(response => response.json());

        const fileData = base64ToArrayBuffer(data.Files[0].FileData);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=${name}`,
            'Content-Length': fileData.byteLength,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: 0,
        });

        res.end(fileData);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: FILE_ERRORS.CANNOT_PROCESSING,
        });
    }
};
