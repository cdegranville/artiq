'use strict';

/**
 * A context object that provides a request id and logging functionality.
 */
function Context() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16)
            .substring(1);
    }

    function guid() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() +
            s4() + s4();
    }

    // Generate a unique request id
    var reqId = guid();

    return {
        /**
         * @return The generated request id.
         */
        getReqId: function() {
            return reqId;
        },

        /**
         * Logs an info message.
         */
        log: function() {
            var args = Array.prototype.slice.call(arguments);
            args.unshift('(' + reqId + ')');
            console.log.apply(console, args);
        },

        /**
         * Logs an error message.
         */
        error: function() {
            var args = Array.prototype.slice.call(arguments);
            args.unshift('(' + reqId + ')');
            console.error.apply(console, args);
        }
    };
};
