import uuid from 'short-uuid';

/**
 * Gets current user session id
 * @return {string} session id
 */
export function getSessionId() {
    let sessionId = localStorage.getItem('session');
    if (!sessionId) {
        sessionId = uuid().new();
        localStorage.setItem('session', sessionId);
    }

    return sessionId;
}