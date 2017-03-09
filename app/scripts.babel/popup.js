'use strict';

function guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() +
        s4() + s4();
}

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}

function pushBack(req) {
    chrome.tabs.queryAsync({'active': true, 'lastFocusedWindow': true}).then((tabs) => {
        req['url'] = tabs[0].url;
        console.log('%s Pushing article to back of queue: %s', req.id, req.url);
        return chrome.extension.getBackgroundPage().pushBack(req);
    }).then(() => {
        console.log('%s Successfully pushed article to back of queue', req.id);
    }).catch((rejected) => {
        console.error('%s %s', req.id, rejected.message);
    });
}

function popFront(req) {
    var tabId;
    chrome.tabs.queryAsync({'active': true, 'lastFocusedWindow': true}).then((tabs) => {
        tabId = tabs[0].id;
        console.log('%s Popping article from front of queue', req.id);
        return chrome.extension.getBackgroundPage().popFront(req);
    }).then((url) => {
        console.log('%s Successfully popped article from front of queue: %s', req.id, url);

        if (url) {
            chrome.tabs.update(tabId, {url: url});
        }
    }).catch((rejected) => {
        console.error('%s %s', req.id, rejected.message);
    });
}

document.getElementById('pushBack').addEventListener('click', () => {
    pushBack({
        id: guid()
    });
});

document.getElementById('popFront').addEventListener('click', () => {
    popFront({
        id: guid()
    });
});
