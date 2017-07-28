/**
 * Promise-based version of setTimeout
 * @param {*} fn
 * @param {*} [ms=0]
 * @return {promise}
 */
export default function timer(fn, ms = 0) {
    return new Promise((res, rej) => {
        setTimeout(() => {
            try {
                fn();
            } catch (e) {
                rej(e);
                return;
            }
            res();
        }, ms);
    });
}