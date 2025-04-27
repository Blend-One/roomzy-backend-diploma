import { PriceUnit } from '../models/enums/price-unit.enum';
import * as dayjs from 'dayjs';

interface GetTotalPriceProps {
    issuedDate: string;
    dueDate: string;
    isDeposit?: boolean;
    priceUnit: PriceUnit;
    price: number;
}

export const priceUnitMapper: Record<PriceUnit, dayjs.UnitType> = {
    [PriceUnit.PER_DAY]: 'day',
    [PriceUnit.PER_HOUR]: 'hour',
    [PriceUnit.PER_MONTH]: 'month',
};

export const getTotalPrice = ({ isDeposit, price, dueDate, priceUnit, issuedDate }: GetTotalPriceProps) => {
    const depositPrice = isDeposit ? price : 0;
    const issuedFormattedDate = dayjs(issuedDate);
    const dueFormattedDate = dayjs(dueDate);

    const totalPrice = depositPrice;
    const dateDiff = dueFormattedDate.diff(issuedFormattedDate, priceUnitMapper[priceUnit]);
    return Number((totalPrice + totalPrice * dateDiff).toFixed(4));
};
