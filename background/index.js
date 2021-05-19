"use strict";
function getStorageKey(channelName) {
    return "__" + (channelName === null || channelName === void 0 ? void 0 : channelName.toUpperCase());
}
function isChannelDisabled(channelName) {
    return !!localStorage.getItem(getStorageKey(channelName));
}
function setChannelDisabled(channelName, disabled) {
    localStorage.setItem(getStorageKey(channelName), disabled ? '1' : '');
}
var currentChannel = undefined;
var activeTabId = undefined;
function updateIcon(disabled) {
    chrome.browserAction.setIcon({ path: "images/icon-" + (disabled ? 'off' : 'on') + ".png" });
}
function setPrimaryTabId(tabId) {
    chrome.tabs.sendMessage(tabId, { sync: true });
    activeTabId = tabId;
}
function resetTabState() {
    currentChannel = undefined;
    updateIcon(true);
}
chrome.browserAction.onClicked.addListener(function (tab) {
    if (!currentChannel) {
        return;
    }
    var toggledDisabled = !isChannelDisabled(currentChannel);
    setChannelDisabled(currentChannel, toggledDisabled);
    updateIcon(toggledDisabled);
    var tabId = tab === null || tab === void 0 ? void 0 : tab.id;
    if (tabId) {
        chrome.tabs.sendMessage(tabId, { channel: currentChannel, disabled: toggledDisabled });
    }
});
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    var _a;
    if (((_a = sender.tab) === null || _a === void 0 ? void 0 : _a.id) !== activeTabId || request.channel === undefined) {
        return;
    }
    currentChannel = request.channel;
    if (!currentChannel) {
        return;
    }
    var isDisabled = isChannelDisabled(currentChannel);
    sendResponse({ channel: currentChannel, disabled: isDisabled });
    updateIcon(isDisabled);
});
chrome.tabs.onActivated.addListener(function (tab) {
    resetTabState();
    setPrimaryTabId(tab.tabId);
});
function updateCurrentTabInWindow() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var _a;
        var firstTabId = (_a = tabs[0]) === null || _a === void 0 ? void 0 : _a.id;
        if (firstTabId) {
            setPrimaryTabId(firstTabId);
        }
    });
}
chrome.windows.onFocusChanged.addListener(function () {
    resetTabState();
    updateCurrentTabInWindow();
});
