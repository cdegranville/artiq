'use strict';

/**
 * Returns a function that promisifies Chrome APIs.
 */
function ChromePromisifier(originalMethod) {
    return function promisified() {
        var args = [].slice.call(arguments);
        var self = this;
        return new Promise((resolve, reject) => {
            args.push((response) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(response);
                }
            });
            originalMethod.apply(self, args);
        });
    };
}

// Promisify the Chrome tabs APIs
Promise.promisifyAll(chrome.tabs, {
    promisifier: ChromePromisifier
});

// Promisify the Chrome local storage APIs
Promise.promisifyAll(chrome.storage.local, {
    promisifier: ChromePromisifier
});
