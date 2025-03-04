export const IMAGE_ROUTES = {
    DEFAULT: 'images/rooms',
    GET_ROOM_IMAGE: ':imageId',
    GET_CONTROVERSIAL_ISSUE_IMAGE: 'controversial_issues/:imageId',
} satisfies Record<string, string>;
