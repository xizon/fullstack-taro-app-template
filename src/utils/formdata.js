/**
 * Manually splicing FormData strings
 * @param {*} params 
 * @param {*} boundary 
 * @returns new strings.
 */
export function createFormData(params = {}, boundary = '') {
    let result = '';
    for (let i in params) {
        result += `\r\n--${boundary}`;
        result += `\r\nContent-Disposition: form-data; name="${i}"`;
        result += '\r\n';
        result += `\r\n${params[i]}`
    }
    // If obj is not empty, add boundary to the last line
    if (result) {
        result += `\r\n--${boundary}`
    }
    return result;
}