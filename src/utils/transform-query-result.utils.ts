import { TransformQueryConfig } from '../types/transform-query-config.types';

export const transformQueryResult = (config: TransformQueryConfig, result: Record<string, any>) => {
    const { objectParsingSequence, renamedFields } = config;

    if (Array.isArray(result)) {
        return result.map(data =>
            transformQueryResult({ renamedFields, objectParsingSequence: [...objectParsingSequence] }, data),
        );
    } else if (!!result && Object.keys(result).length === 1) {
        const prop = objectParsingSequence.shift();
        return transformQueryResult({ renamedFields, objectParsingSequence: [...objectParsingSequence] }, result[prop]);
    } else {
        const preliminaryObject = result;
        !!result &&
            Object.keys(result).forEach(key => {
                if (renamedFields[key]) {
                    preliminaryObject[renamedFields[key]] = result[key];
                    delete preliminaryObject[key];
                }
            });
        const prop = objectParsingSequence.shift();
        if (prop) {
            result[prop] = transformQueryResult(
                { renamedFields, objectParsingSequence: [...objectParsingSequence] },
                result[prop],
            );
        }
        return result;
    }
};
