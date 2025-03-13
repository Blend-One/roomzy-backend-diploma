import { RelationsConfigItem } from '../types/relations-config.types';
import { Locale } from '../models/enums/locale.enum';

export const calculateRelations = (configItems: RelationsConfigItem[], locale: Locale) => {
    const result: Record<string, any> = {};

    let currentObject = result;

    for (const item of configItems) {
        if (item.withId) {
            currentObject['id'] = true;
        }

        if (item.withLocale) {
            currentObject[locale] = true;
        }

        if (item.additionalFields?.length) {
            item.additionalFields.forEach(field => {
                currentObject[field] = true;
            });
        }

        if (item.joinedField) {
            const queryObject = {};
            currentObject[item.joinedField] = {
                select: queryObject,
            };

            currentObject = queryObject;
        } else {
            break;
        }
    }

    return result;
};
