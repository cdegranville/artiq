'use strict';

chrome.runtime.onInstalled.addListener(details => {
  console.log('previousVersion', details.previousVersion);
});

var artiq = new ArticleQueue();

function refreshBadgeText() {
    var queueSize = artiq.size();
    console.log('size: ' + queueSize);
    chrome.browserAction.setBadgeText({text: queueSize.toString()});
}

function pushBack(url) {
    // Create a copy of the article queue and apply the update to the copy
    var copy = artiq.copy();
    copy.pushBack(url);

    // TODO: Store the updated copy
    return Promise.resolve().then(function() {
        // Now apply the update to the article queue
        artiq.pushBack(url);

        // Refresh the visual indicator of the number of articles in the queue
        refreshBadgeText();

        // At this point the in memory article queue and stored article queue
        // are in sync
        return Promise.resolve();
    });
}

function popFront() {
    // Create a copy of the article queue and apply the update to the copy
    var copy = artiq.copy();
    var url = copy.popFront();

    // TODO: Store the updated copy
    return Promise.resolve().then(function() {
        // Now apply the update to the article queue
        artiq.popFront();

        // Refresh the visual indicator of the number of articles in the queue
        refreshBadgeText();

        // At this point the in memory article queue and stored article queue
        // are in sync
        return Promise.resolve(url);
    });
}

chrome.contextMenus.create({
    title: 'Push to back of queue',
    contexts: ['link'],
    onclick: function(context) {
        pushBack(context.linkUrl);
    }
});

refreshBadgeText();
