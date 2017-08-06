/**
 * Tag function for encoding URI components
 * 
 * @example
 * uri`http://example.com/?search=${'ok?'}`
 * // 'http://example.com/?search=ok%3F'
 * 
 * @param {*} strings
 * @param {*} values
 * @return {string}
 */
export default function uri(strings, ...values) {
    return strings.map((string, i) => {
        const value = values[i] === undefined ?
            '' :
            encodeURIComponent(values[i]);
        
        return string + value;
    }).join('');
}