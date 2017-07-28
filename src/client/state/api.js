import {getSessionId} from './session';

const sessionId = getSessionId();
const sessionParam = `session=${sessionId}`;

/**
 * Makes request to rest api
 * @param {string} method
 * @param {string} url
 * @param {object} [body]
 * @return {promise.<*>}
 */
export default async function api(method, url, body) {
    return await fetch(`api${url}?${sessionParam}`, {
        headers: {
            ['Content-Type']: 'application/json'
        },
        method,
        body: JSON.stringify(body)
    });
}