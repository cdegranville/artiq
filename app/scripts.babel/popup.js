'use strict';

function pushBack() {
    chrome.tabs.queryAsync({'active': true, 'lastFocusedWindow': true}).then(function(tabs) {
        var url = tabs[0].url;
        console.log('Pushing article to back of queue: ' + url);
        return chrome.extension.getBackgroundPage().pushBack(url);
    }).then(function() {
        console.log('Successfully pushed article to back of queue');
    }).catch(function(rejected) {
        console.error(rejected.message);
    });
}

function popFront() {
    var tabId;

    chrome.tabs.queryAsync({'active': true, 'lastFocusedWindow': true}).then(function(tabs) {
        tabId = tabs[0].id;
        console.log('Popping article from front of queue');
        return chrome.extension.getBackgroundPage().popFront();
    }).then(function(url) {
        console.log('Successfully popped article from front of queue: ' + url);

        if (url) {
            chrome.tabs.update(tabId, {url: url});
        }
    }).catch(function(rejected) {
        console.error(rejected.message);
    });
}

document.getElementById('pushBack').addEventListener('click', pushBack);
document.getElementById('popFront').addEventListener('click', popFront);
