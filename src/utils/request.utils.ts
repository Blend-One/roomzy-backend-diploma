export const getLanguageHeader = (request: Request) => {
    return request.headers['accept-language'];
};

export const getUserHeader = (request: Request) => {
    return request.headers['user'];
};
