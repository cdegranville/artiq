'use strict';

/**
 * Returns a function that promisifies Chrome APIs.
 */
function ChromePromisifier(originalMethod) {
    return function promisified() {
        var args = [].slice.call(arguments);
        var self = this;
        return new Promise(function(resolve, reject) {
            // Get the arguments passed to the original method, appends the
            // resolve function to the end, and calls the original method
            args.push(resolve);
            originalMethod.apply(self, args);
        });
    };
}

// Promisify the Chrome tabs APIs
Promise.promisifyAll(chrome.tabs, {
    promisifier: ChromePromisifier
});
