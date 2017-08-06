/** 
 * Avoid `console` errors in browsers that lack a console.
 * Eg. IE9 will only show page when dev tools is opened
 * 
 * Discussion: 
 * https://stackoverflow.com/a/7742862/1064570
 * Source:
 * https://github.com/h5bp/html5-boilerplate/blob/master/src/js/plugins.js
*/
(function() {
    let method;
    const noop = function() {};
    const methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    let length = methods.length;
    const console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());