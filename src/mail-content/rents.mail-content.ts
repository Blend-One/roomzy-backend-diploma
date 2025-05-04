/* eslint-disable max-len */
export const newRentForLandlordMail = (renterEmail: string, roomTitle: string) => ({
    title: `Новая заявка на аренду по объявлению: "${roomTitle}"`,
    description: `У вас новая заявка на аренду! Арендатор ${renterEmail} отправил запрос на бронирование вашего объявления ${roomTitle}. Вы можете рассмотреть заявку и принять решение в личном кабинете.`,
});

export const rentIsRejectedMail = (roomTitle: string) => ({
    title: `Ваша заявка на "${roomTitle}" была отклонена`,
    description: `К сожалению, арендодатель отклонил вашу заявку на аренду объявления "${roomTitle}". Вы можете выбрать другое помещение на платформе Roomzy.`,
});

export const rentIsApprovedMail = (roomTitle: string) => ({
    title: `Ваша заявка на "${roomTitle}" была подтверждена`,
    description: `Поздравляем! Ваша заявка на аренду объявления "${roomTitle}" была одобрена арендодателем. Детали аренды доступны в личном кабинете.`,
});

export const rentIsSuccessfulMail = (roomTitle: string) => ({
    title: 'Аренда подтверждена и оплачена!',
    description: `Всё готово! Аренда по объявлению "${roomTitle}" успешно заключена и оплачена. Благодарим за использование нашей платформы. Подробности аренды и документы доступны в вашем личном кабинете.`,
});

export const rentWasRejectedByRenterForLandlordMail = (renterEmail: string, roomTitle: string) => ({
    title: `Заявка на "${roomTitle}" отменена арендатором`,
    description: `Арендатор ${renterEmail} отменил свою заявку на аренду по объявлению "${roomTitle}". Заявка арендатора больше не активна. Вы можете ожидать новые запросы от других арендаторов.`,
});

export const controversialIssuesFromRenterMail = (renterEmail: string, roomTitle: string) => ({
    title: `Были зафиксированы спорные моменты по объявлению "${roomTitle}"`,
    description: `Арендатор ${renterEmail} сообщил о спорных моментах при заселении в помещение по объявлению "${roomTitle}". Ознакомьтесь с деталями в личном кабинете`,
});

export const controversialIssuesRejectedForRenterMail = (roomTitle: string) => ({
    title: `Спорные моменты по объявлению "${roomTitle}" отклонено модерацией`,
    description: `Спорные моменты по объявлению "${roomTitle}" были отклонены модерацией из-за неподобающего или неполного содержания. Если вы считаете это ошибкой, обратитесь в службу поддержки.`,
});
