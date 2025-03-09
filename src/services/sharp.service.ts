import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { COMPRESS_QUALITY } from 'constants/sharp.constants';

@Injectable()
export class SharpService {
    async compress(file: Express.Multer.File) {
        const compressedBuffer = await sharp(file.buffer).webp({ quality: COMPRESS_QUALITY }).toBuffer();
        return { ...file, buffer: compressedBuffer };
    }
}
