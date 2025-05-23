export const roomCharacteristics = [
    {
        id: 'FLOORING_TYPE',
        fallbackName: 'Тип покрытия',
        ru: 'Тип покрытия',
        kz: 'Жер жабынының түрі',
        type: 'OPTIONS',
        roomSectionTypes: [
            'LIVING_ROOM',
            'BEDROOM',
            'KITCHEN',
            'RESTROOM',
            'HALLWAY',
            'STORAGE',
            'YARD',
            'BASEMENT',
            'ATTIC',
            'SALES_FLOOR',
        ],
    },
    {
        id: 'ROOM_SIZE',
        fallbackName: 'Размер комнаты',
        ru: 'Размер комнаты',
        kz: 'Бөлменің өлшемі',
        type: 'OPTIONS',
        roomSectionTypes: [
            'LIVING_ROOM',
            'BEDROOM',
            'KITCHEN',
            'RESTROOM',
            'BALCONY',
            'HALLWAY',
            'STORAGE',
            'SALES_FLOOR',
            'BAR_AREA',
        ],
    },
    {
        id: 'CEILING_HEIGHT',
        fallbackName: 'Высота потолка',
        ru: 'Высота потолка',
        kz: 'Төбе биіктігі',
        type: 'OPTIONS',
        roomSectionTypes: ['LIVING_ROOM', 'BEDROOM', 'KITCHEN', 'RESTROOM', 'BALCONY', 'HALLWAY', 'STORAGE'],
    },
    {
        id: 'WINDOWS_TYPE',
        fallbackName: 'Тип окон',
        ru: 'Тип окон',
        kz: 'Терезелердің түрі',
        type: 'OPTIONS',
        roomSectionTypes: ['LIVING_ROOM', 'BEDROOM', 'KITCHEN', 'RESTROOM', 'BALCONY'],
    },
    {
        id: 'HEATING_TYPE',
        fallbackName: 'Тип отопления',
        ru: 'Тип отопления',
        kz: 'Жылытудың түрі',
        type: 'OPTIONS',
        roomSectionTypes: ['LIVING_ROOM', 'BEDROOM', 'KITCHEN', 'RESTROOM'],
    },
    {
        id: 'WATER_SUPPLY',
        fallbackName: 'Водоснабжение',
        ru: 'Водоснабжение',
        kz: 'Су құбыры',
        type: 'OPTIONS',
        roomSectionTypes: ['KITCHEN', 'RESTROOM', 'SALES_FLOOR', 'WASHING_AREA'],
    },
    {
        id: 'ELECTRICITY',
        fallbackName: 'Электричество',
        ru: 'Электричество',
        kz: 'Электр энергиясы',
        type: 'OPTIONS',
        roomSectionTypes: ['LIVING_ROOM', 'BEDROOM', 'KITCHEN', 'RESTROOM', 'SALES_FLOOR', 'BAR_AREA'],
    },
    {
        id: 'VENTILATION',
        fallbackName: 'Вентиляция',
        ru: 'Вентиляция',
        kz: 'Вентиляция',
        type: 'OPTIONS',
        roomSectionTypes: ['KITCHEN', 'RESTROOM', 'SALES_FLOOR', 'BAR_AREA', 'WASHING_AREA'],
    },
    {
        id: 'AC',
        fallbackName: 'Кондиционер',
        ru: 'Кондиционер',
        kz: 'Кондиционер',
        type: 'OPTIONS',
        roomSectionTypes: ['LIVING_ROOM', 'BEDROOM', 'KITCHEN', 'BAR_AREA'],
    },
];

export const roomAttributes = [
    {
        id: 'TILE',
        fallbackName: 'Плитка',
        ru: 'Плитка',
        kz: 'Плитка',
        roomCharacteristics: ['FLOORING_TYPE'],
    },
    {
        id: 'WOOD',
        fallbackName: 'Дерево',
        ru: 'Дерево',
        kz: 'Ағаш',
        roomCharacteristics: ['FLOORING_TYPE'],
    },
    {
        id: 'CARPET',
        fallbackName: 'Ковровое покрытие',
        ru: 'Ковровое покрытие',
        kz: 'Кілем',
        roomCharacteristics: ['FLOORING_TYPE'],
    },
    {
        id: 'LAMINATE',
        fallbackName: 'Ламинат',
        ru: 'Ламинат',
        kz: 'Ламинат',
        roomCharacteristics: ['FLOORING_TYPE'],
    },
    {
        id: 'CONCRETE',
        fallbackName: 'Бетон',
        ru: 'Бетон',
        kz: 'Бетон',
        roomCharacteristics: ['FLOORING_TYPE'],
    },
    {
        id: 'SIZE_15',
        fallbackName: '15 м²',
        ru: '15 м²',
        kz: '15 м²',
        roomCharacteristics: ['ROOM_SIZE'],
    },
    {
        id: 'SIZE_20',
        fallbackName: '20 м²',
        ru: '20 м²',
        kz: '20 м²',
        roomCharacteristics: ['ROOM_SIZE'],
    },
    {
        id: 'SIZE_25',
        fallbackName: '25 м²',
        ru: '25 м²',
        kz: '25 м²',
        roomCharacteristics: ['ROOM_SIZE'],
    },
    {
        id: 'SIZE_30',
        fallbackName: '30 м²',
        ru: '30 м²',
        kz: '30 м²',
        roomCharacteristics: ['ROOM_SIZE'],
    },
    {
        id: 'SIZE_40',
        fallbackName: '40 м²',
        ru: '40 м²',
        kz: '40 м²',
        roomCharacteristics: ['ROOM_SIZE'],
    },
    {
        id: 'CEILING_2_5',
        fallbackName: '2.5 м',
        ru: '2.5 м',
        kz: '2.5 м',
        roomCharacteristics: ['CEILING_HEIGHT'],
    },
    {
        id: 'CEILING_3',
        fallbackName: '3 м',
        ru: '3 м',
        kz: '3 м',
        roomCharacteristics: ['CEILING_HEIGHT'],
    },
    {
        id: 'CEILING_3_5',
        fallbackName: '3.5 м',
        ru: '3.5 м',
        kz: '3.5 м',
        roomCharacteristics: ['CEILING_HEIGHT'],
    },
    {
        id: 'CEILING_4',
        fallbackName: '4 м',
        ru: '4 м',
        kz: '4 м',
        roomCharacteristics: ['CEILING_HEIGHT'],
    },
    {
        id: 'CEILING_5',
        fallbackName: '5 м',
        ru: '5 м',
        kz: '5 м',
        roomCharacteristics: ['CEILING_HEIGHT'],
    },
    {
        id: 'SINGLE',
        fallbackName: 'Одинарные',
        ru: 'Одинарные',
        kz: 'Жеке',
        roomCharacteristics: ['WINDOWS_TYPE'],
    },
    {
        id: 'DOUBLE',
        fallbackName: 'Двойные',
        ru: 'Двойные',
        kz: 'Екі қабатты',
        roomCharacteristics: ['WINDOWS_TYPE'],
    },
    {
        id: 'TRIPLE',
        fallbackName: 'Тройные',
        ru: 'Тройные',
        kz: 'Үш қабатты',
        roomCharacteristics: ['WINDOWS_TYPE'],
    },
    {
        id: 'SLIDING',
        fallbackName: 'Раздвижные',
        ru: 'Раздвижные',
        kz: 'Сырғымалы',
        roomCharacteristics: ['WINDOWS_TYPE'],
    },
    {
        id: 'FIXED',
        fallbackName: 'Нераскрывающиеся',
        ru: 'Нераскрывающиеся',
        kz: 'Ашылмайтын',
        roomCharacteristics: ['WINDOWS_TYPE'],
    },
    {
        id: 'ELECTRIC',
        fallbackName: 'Электрическое',
        ru: 'Электрическое',
        kz: 'Электрлік',
        roomCharacteristics: ['HEATING_TYPE'],
    },
    {
        id: 'GAS',
        fallbackName: 'Газовое',
        ru: 'Газовое',
        kz: 'Газдық',
        roomCharacteristics: ['HEATING_TYPE'],
    },
    {
        id: 'WATER',
        fallbackName: 'Водяное',
        ru: 'Водяное',
        kz: 'Су',
        roomCharacteristics: ['HEATING_TYPE'],
    },
    {
        id: 'UNDERFLOOR',
        fallbackName: 'Теплый пол',
        ru: 'Теплый пол',
        kz: 'Жылы еден',
        roomCharacteristics: ['HEATING_TYPE'],
    },
    {
        id: 'MUNICIPAL',
        fallbackName: 'Городской водопровод',
        ru: 'Городской водопровод',
        kz: 'Қалалық су құбыры',
        roomCharacteristics: ['WATER_SUPPLY'],
    },
    {
        id: 'WELL',
        fallbackName: 'Скважина',
        ru: 'Скважина',
        kz: 'Су ұңғымасы',
        roomCharacteristics: ['WATER_SUPPLY'],
    },
    {
        id: 'TANK',
        fallbackName: 'Цистерна',
        ru: 'Цистерна',
        kz: 'Цистерна',
        roomCharacteristics: ['WATER_SUPPLY'],
    },
    {
        id: 'NATURAL',
        fallbackName: 'Естественная',
        ru: 'Естественная',
        kz: 'Табиғи',
        roomCharacteristics: ['VENTILATION'],
    },
    {
        id: 'MECHANICAL',
        fallbackName: 'Механическая',
        ru: 'Механическая',
        kz: 'Механикалық',
        roomCharacteristics: ['VENTILATION'],
    },
    {
        id: 'YES',
        fallbackName: 'Есть',
        ru: 'Есть',
        kz: 'Бар',
        roomCharacteristics: ['AC', 'ELECTRICITY'],
    },
    {
        id: 'NO',
        fallbackName: 'Нет',
        ru: 'Нет',
        kz: 'Жоқ',
        roomCharacteristics: ['AC', 'ELECTRICITY', 'VENTILATION'],
    },
];
