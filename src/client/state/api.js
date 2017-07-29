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
    const response = await fetch(`api${url}?${sessionParam}`, {
        headers: {
            ['Content-Type']: 'application/json'
        },
        method,
        body: JSON.stringify(body)
    });

    const headers = response.headers;
    if (headers.has('Content-Type') &&
        headers.get('Content-Type').startsWith('application/json')) {
        return await response.json();
    }
}