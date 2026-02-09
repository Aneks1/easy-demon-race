export type FormattedResponse = Record<`${number}` | string, string>;
/**
 * Parses Geometry Dash key/value pairs into an object.
 */
export declare const formatResponse: (gdResponse: string, separator: string) => FormattedResponse;
