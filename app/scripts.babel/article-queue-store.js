'use strict';

/**
 * An article queue store class.
 */
function ArticleQueueStore() {
    return {
        /**
         * Gets the article queue associated with the given key from the store.
         *
         * @param key A key string.
         * @return The article queue associated with the key or undefined if
         * one could not be found.
         */
        get: (key) => {
            return chrome.storage.local.getAsync(key).then((items) => {
                const list = items[key];
                return list ? new ArticleQueue(list) : undefined;
            });
        },

        /**
         * Puts the article queue associated with the given key into the store.
         *
         * @param key A key string.
         * @param artiq An article queue.
         */
        put: (key, artiq) => {
            const keyValue = {};
            keyValue[key] = artiq.toList();
            return chrome.storage.local.setAsync(keyValue);
        }
    };
}
