import * as dayjs from 'dayjs';
import { PriceUnit } from 'models/enums/price-unit.enum';
import { priceUnitMapper } from './price.utils';

export const issuedDateIsValid = (date: string) => {
    const issuedDate = dayjs(date);
    const currentDate = dayjs();
    return issuedDate.isSame(currentDate) || issuedDate.isAfter(currentDate);
};

export const datesRangeValid = (issuedDate: string, dueDate: string, priceUnit: PriceUnit) => {
    const formattedIssuedDate = dayjs(issuedDate);
    const formattedDueDate = dayjs(dueDate);

    const dateDiff = formattedDueDate.diff(formattedIssuedDate, priceUnitMapper[priceUnit]);

    return formattedDueDate.isAfter(formattedIssuedDate) && dateDiff > 0;
};
