/**
 * Removes react text comment nodes from HTML string
 * 
 * @example
 * const html = '<!-- react-text: 1 -->example<!-- /react-text -->';
 * removeReactText(html) // 'example'
 * 
 * @param {string} html 
 * @return {string} html
 */
export default function removeReactText(html) {
    return html.replace(/<!-- \/?react-text.*? -->/g, '');
}