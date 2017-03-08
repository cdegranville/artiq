'use strict';

/**
 * An article queue class. If a falsy value is passed to the constructor an
 * empty queue is created. Otherwise, if a list is passed to the constructor
 * it is used to initialize the queue by pushing each item to the back of the
 * queue.
 */
function ArticleQueue(list) {
    var queue = list ? list.slice() : [];

    return {
        /**
         * @return The size of the queue.
         */
        size: function() {
            return queue.length;
        },

        /**
         * Pushes the url of an article (if it is truthy) onto the back of the
         * queue.
         *
         * @param url An article url.
         */
        pushBack: function(url) {
            if (url) {
                queue.push(url);
            }
        },

        /**
         * Pops the url of the article at the front of the queue.
         *
         * @return An article url.
         */
        popFront: function() {
            return queue.splice(0, 1)[0];
        },

        /**
         * @return A list representation of the queue where the first elelement
         * is the front of the queue and the last element is the back of the
         * queue.
         */
        toList: function() {
            return queue.slice();
        },

        /**
         * @return A copy of the queue.
         */
        copy: function() {
            return new ArticleQueue(queue.slice());
        }
    };
}
