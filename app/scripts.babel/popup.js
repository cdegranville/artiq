'use strict';

function pushBack() {
    chrome.tabs.queryAsync({'active': true, 'lastFocusedWindow': true}).then(function(tabs) {
        var url = tabs[0].url;
        console.log('pushBack: ' + url);
        chrome.extension.getBackgroundPage().pushBack(url);
    }).catch(function(rejected) {
        console.error(rejected.message);
    });
}

function popFront() {
    chrome.tabs.queryAsync({'active': true, 'lastFocusedWindow': true}).then(function(tabs) {
        var tabId = tabs[0].id;
        var url = chrome.extension.getBackgroundPage().popFront();
        console.log('popFront: ' + url);

        if (url) {
            chrome.tabs.update(tabId, {url: url});
        }
    }).catch(function(rejected) {
        console.error(rejected.message);
    });
}

document.getElementById('pushBack').addEventListener('click', pushBack);
document.getElementById('popFront').addEventListener('click', popFront);
