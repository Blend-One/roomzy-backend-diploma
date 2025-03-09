export type InferArrayElement<T extends Record<string, any>[]> = T extends Array<infer R> ? R : never;
