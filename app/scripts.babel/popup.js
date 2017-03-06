'use strict';

function pushBack() {
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        var url = tabs[0].url;
        console.log('pushBack: ' + url);
        chrome.extension.getBackgroundPage().pushBack(url);
    });
}

function popFront() {
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        var tabId = tabs[0].id;
        var url = chrome.extension.getBackgroundPage().popFront();
        console.log('popFront: ' + url);

        if (url) {
            chrome.tabs.update(tabId, {url: url});
        }
    });
}

document.getElementById('pushBack').addEventListener('click', pushBack);
document.getElementById('popFront').addEventListener('click', popFront);
