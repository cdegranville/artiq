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

    var version = previousVersion || currentVersion;
    console.log('Loading queue for version', version);
    artiqStore.get(version).then((q) => {
        artiq = q;
        console.log('Refreshing displayed queue size to', artiq.size());
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

function pushBack(req, context) {
    context.log('Handling pushBack:', req.url);
    context.log('Creating copy of queue and pushing to back of it');
    var copy = artiq.copy();
    copy.pushBack(req.url);

    context.log('Storing updated copy of queue');
    return artiqStore.put(artiqDeets.currentVersion, copy).then(() => {
        context.log('Pushing to back of original queue');
        artiq.pushBack(req.url);

        context.log('Refreshing displayed queue size to', artiq.size());
        refreshBadgeText();

        // Stored and in-memory queues are in sync
        return Promise.resolve();
    });
}

function popFront(req, context) {
    context.log('Handling popFront');
    context.log('Creating copy of queue and popping from front of it');
    var copy = artiq.copy();
    var url = copy.popFront();

    context.log('Popped article:', url);
    context.log('Storing updated copy of queue');
    return artiqStore.put(artiqDeets.currentVersion, copy).then(() => {
        context.log('Popping from front of original queue');
        artiq.popFront();

        context.log('Refreshing displayed queue size to', artiq.size());
        refreshBadgeText();

        // Stored and in-memory queues are in sync
        return Promise.resolve(url);
    });
}

chrome.contextMenus.create({
    title: 'Push to back of queue',
    contexts: ['link'],
    onclick: (context) => {
        pushBack({
            url: context.linkUrl
        }, new Context());
    }
});
