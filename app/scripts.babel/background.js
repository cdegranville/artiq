'use strict';

chrome.runtime.onInstalled.addListener(details => {
  console.log('previousVersion', details.previousVersion);
});

function InMemoryArticleQueue() {
    var queue = [];

    return {
        size: function() {
            return queue.length;
        },

        pushBack: function(url) {
            if (url) {
                queue.push(url);
            }
        },

        popFront: function() {
            return queue.splice(0, 1)[0];
        }
    };
}

var artiq = new InMemoryArticleQueue();

function refreshBadgeText() {
    var queueSize = artiq.size();
    console.log('size: ' + queueSize);
    chrome.browserAction.setBadgeText({text: queueSize.toString()});
}

function pushBack(url) {
    artiq.pushBack(url);
    refreshBadgeText();
}

function popFront() {
    var url = artiq.popFront();
    refreshBadgeText();
    return url;
}

function pushBackFromContext(context) {
    pushBack(context.linkUrl);
}

chrome.contextMenus.create({
    title: 'Push to back of queue',
    contexts: ['link'],
    onclick: pushBackFromContext
});

refreshBadgeText();
