import extend from 'extend';
import sinon from 'sinon';

const originalFetch = window.fetch;
let mockedFetch;
const defaultResponse = {
    headers: {
        has: () => true,
        get: () => 'application/json'
    },
    json: () => ({})
};

/**
 * Mocks global fetch
 * @param {object} response
 * @return {object} mocked fetch
 */
export function mock(response = {}) {
    mockedFetch = window.fetch = sinon.stub();
    const resp = extend(true, {}, defaultResponse, response);
    mockedFetch.returns(resp);
    return mockedFetch;
}

/**
 * Sets mock to N-th call
 * @param {number} callNumber
 * @param {*} response
* @return {object} mocked fetch
 */
export function onCall(callNumber, response = {}) {
    const resp = extend(true, {}, defaultResponse, response);
    mockedFetch.onCall(callNumber).returns(resp);
    return mockedFetch;
}

/**
 * Restores global fetch to original state
 */
export function restore() {
    window.fetch = originalFetch;
}