'use strict';

function pushBack() {
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        var url = tabs[0].url;
        console.log('pushBack: ' + url);
    });
}

function popFront() {
    console.log('popFront');
}

document.getElementById('pushBack').addEventListener('click', pushBack);
document.getElementById('popFront').addEventListener('click', popFront);
