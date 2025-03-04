import { FILE_TYPES, MAX_COUNT, MAX_FILE_SIZE } from '../constants/file.constants';
import { UnprocessableEntityException } from '@nestjs/common';
import { FILE_ERRORS } from '../errors/file.error';

export const checkFileSize = (file: Express.Multer.File) => {
    if (file.size > MAX_FILE_SIZE) {
        throw new UnprocessableEntityException(FILE_ERRORS.INVALID_IMAGE_SIZE, file.filename);
    }
};

export const checkFileType = (file: Express.Multer.File) => {
    if (!FILE_TYPES.includes(file.mimetype)) {
        throw new UnprocessableEntityException(FILE_ERRORS.INVALID_IMAGE_TYPE, file.filename);
    }
};

const checkFile = (file: Express.Multer.File) => {
    checkFileType(file);
    checkFileSize(file);
};

export const filterFiles = (files: Express.Multer.File[], areFilesRequired: boolean = true) => {
    if (!files?.length && areFilesRequired) throw new UnprocessableEntityException(FILE_ERRORS.FILES_ARE_REQUIRED);

    if (files?.length > MAX_COUNT) throw new UnprocessableEntityException(FILE_ERRORS.TOO_MANY_FILES);

    files.forEach(checkFile);
};
