import xml2js from 'xml2js';

const parser = new xml2js.Parser({
    mergeAttrs: true,
    explicitArray: false
});

/**
 * Parses XML string
 * @param {string} xmlstr
 * @return {object} JS objects
 */
export default function(xmlstr) {
    return new Promise((res, rej) =>
        parser.parseString(xmlstr, function(err, data) {
            if (err) {
                rej(err);
            }
            res(data);
        }));
}