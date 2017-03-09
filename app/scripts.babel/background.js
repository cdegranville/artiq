'use strict';

var artiqDeets;
var artiq = new ArticleQueue();
var artiqStore = new ArticleQueueStore();

function init(details) {
    var currentVersion = chrome.runtime.getManifest().version;
    var previousVersion = details ? details.previousVersion : undefined;

    artiqDeets = {
        currentVersion: currentVersion,
        previousVersion: previousVersion
    };

    console.log('Deets on artiq: ' + JSON.stringify(artiqDeets, null, 4));
    console.log('Loading article queue');

    var version = previousVersion || currentVersion;
    artiqStore.get(version).then((q) => {
        console.log('Loaded article queue of size: ' + q.size());
        artiq = q;
        refreshBadgeText();
    }).catch((rejected) => {
        console.error(rejected.message);
    });
}

chrome.runtime.onStartup.addListener(init);
chrome.runtime.onInstalled.addListener(init);

function refreshBadgeText() {
    var queueSize = artiq.size();
    chrome.browserAction.setBadgeText({text: queueSize.toString()});
}

function pushBack(req) {
    // Create a copy of the article queue and apply the update to the copy
    var copy = artiq.copy();
    copy.pushBack(req.url);

    console.log('%s Handling pushBack: %s', req.id, req.url);
    console.log('%s Storing updated copy of queue after pushing to back of it', req.id);
    return artiqStore.put(artiqDeets.currentVersion, copy).then(() => {
        console.log('%s Stored updated copy of queue: applying push back to original queue', req.id);

        artiq.pushBack(req.url);
        refreshBadgeText();

        // At this point the in-memory article queue and stored article queue
        // are in sync so resolve the pushBack request
        return Promise.resolve();
    });
}

function popFront(req) {
    // Create a copy of the article queue and apply the update to the copy
    var copy = artiq.copy();
    var url = copy.popFront();

    console.log('%s Handling popFront: %s', req.id, url);
    console.log('%s Storing updated copy of queue after popping from front of it', req.id);
    return artiqStore.put(artiqDeets.currentVersion, copy).then(() => {
        console.log('%s Stored updated copy of queue: applying pop front to original queue', req.id);
        artiq.popFront();
        refreshBadgeText();

        // At this point the in-memory article queue and stored article queue
        // are in sync so resolve the popFront request
        return Promise.resolve(url);
    });
}

chrome.contextMenus.create({
    title: 'Push to back of queue',
    contexts: ['link'],
    onclick: (context) => {
        pushBack(context.linkUrl);
    }
});
