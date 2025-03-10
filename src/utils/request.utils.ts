import { UserTokenPayloadDto } from '../models/dtos/user-token-payload.dto';

export const getLanguageHeader = (request: Request) => {
    return request.headers['accept-language'];
};

export const getUserHeader = (request: Request): ReturnType<UserTokenPayloadDto['build']> => {
    return request.headers['user'];
};
