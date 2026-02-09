export type FormattedResponse = Record<`${number}` | string, string>;

/**
 * Parses Geometry Dash key/value pairs into an object.
 */
export const formatResponse = (gdResponse: string, separator: string): FormattedResponse => {
  const formatted: FormattedResponse = {};
  if (!gdResponse) {
    return formatted;
  }

  const keyVals = gdResponse.split(separator);
  for (let i = 0; i < keyVals.length; i += 2) {
    const key = keyVals[i];
    if (!key) {
      continue;
    }

    formatted[key as `${number}`] = keyVals[i + 1] ?? '';
  }

  return formatted;
};
