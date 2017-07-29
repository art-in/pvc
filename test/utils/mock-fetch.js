import extend from 'extend';
import sinon from 'sinon';

const originalFetch = window.fetch;
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
    window.fetch = sinon.stub();

    const resp = extend(true, {}, defaultResponse, response);
    window.fetch.returns(resp);

    return window.fetch;
}

/**
 * Restores global fetch to original state
 */
export function restore() {
    window.fetch = originalFetch;
}