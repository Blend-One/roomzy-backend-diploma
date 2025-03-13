export interface RelationsConfigItem {
    withId?: boolean;
    withLocale?: boolean;
    joinedField: string | null;
    additionalFields?: string[];
}
