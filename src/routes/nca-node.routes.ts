export const NCA_NODE_ROUTES = {
    DEFAULT: process.env.NCA_NODE_ADDRESS,
    VERIFY: '/cms/verify',
    EXTRACT: '/cms/extract',
} satisfies Record<string, string>;
