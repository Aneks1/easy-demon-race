/**
 * Parses Geometry Dash key/value pairs into an object.
 */
export const formatResponse = (gdResponse, separator) => {
    const formatted = {};
    if (!gdResponse) {
        return formatted;
    }
    const keyVals = gdResponse.split(separator);
    for (let i = 0; i < keyVals.length; i += 2) {
        const key = keyVals[i];
        if (!key) {
            continue;
        }
        formatted[key] = keyVals[i + 1] ?? '';
    }
    return formatted;
};
