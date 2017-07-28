const sessions = {};

/**
 * Sets data to user session
 * @param {string} userToken 
 * @param {*} data 
 */
export function set(userToken, data) {
    if (!userToken) {
        throw Error('User token should be specified');
    }

    sessions[userToken] = data;
}

/**
 * Gets user session
 * @param {string} userToken
 * @return {*} data
 */
export function get(userToken) {
    return sessions[userToken];
}