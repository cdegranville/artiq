'use strict';

function pushBack(context) {
    chrome.tabs.queryAsync({'active': true, 'lastFocusedWindow': true}).then((tabs) => {
        const req = {url: tabs[0].url};
        context.log('Pushing article to back of queue:', req.url);
        return chrome.extension.getBackgroundPage().pushBack(req, context);
    }).then(() => {
        context.log('Successfully pushed article to back of queue');
    }).catch((rejected) => {
        context.error(rejected.message);
    });
}

function popFront(context) {
    let tabId;
    chrome.tabs.queryAsync({'active': true, 'lastFocusedWindow': true}).then((tabs) => {
        tabId = tabs[0].id;
        context.log('Popping article from front of queue');
        return chrome.extension.getBackgroundPage().popFront({}, context);
    }).then((url) => {
        context.log('Successfully popped article from front of queue:', url);

        if (url) {
            chrome.tabs.update(tabId, {url: url});
        }
    }).catch((rejected) => {
        context.error(rejected.message);
    });
}

document.getElementById('pushBack').addEventListener('click', () => {
    pushBack(new Context());
});

document.getElementById('popFront').addEventListener('click', () => {
    popFront(new Context());
});
