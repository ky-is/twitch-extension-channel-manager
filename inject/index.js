"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.injectTwitchPageOnBehalfOf = exports.setCurrentChannel = void 0;
function waitForSelector(selector, callback, maxAttemptFrames) {
    var attempts = 0;
    var waitInterval = window.setInterval(function () {
        attempts += 1;
        var element = document.querySelector(selector);
        if (element || attempts > maxAttemptFrames) {
            if (attempts > 999) {
                console.error('Failed to load', selector, attempts);
            }
            window.clearInterval(waitInterval);
        }
        if (element) {
            callback(element);
        }
    }, 0);
}
var isChannelDisabled = false;
var extensionIdentifier = undefined;
var currentChannel = null;
function sendSyncChannel() {
    chrome.runtime.sendMessage({ channel: currentChannel }, onBackgroundSync);
}
function setCurrentChannel(channelName) {
    if (channelName === currentChannel) {
        return false;
    }
    currentChannel = channelName;
    sendSyncChannel();
    return true;
}
exports.setCurrentChannel = setCurrentChannel;
function connectToBackground(extensionName) {
    extensionIdentifier = extensionName;
    chrome.runtime.onMessage.addListener(onBackgroundSync);
}
function injectTwitchPageOnBehalfOf(extensionName, mutationCallback) {
    var mainElement = undefined;
    var pageObserver = new window.MutationObserver(function (mutations) {
        if (!mainElement) {
            return;
        }
        var newChannel = guessChannelNameFromContent(mainElement);
        setCurrentChannel(newChannel !== null && newChannel !== void 0 ? newChannel : null);
        mutationCallback(mutations);
    });
    function guessChannelNameFromContent(content) {
        var _a;
        return (_a = content.querySelector('h1')) === null || _a === void 0 ? void 0 : _a.innerText;
    }
    waitForSelector('main', function (nextElement) {
        mainElement = nextElement;
        pageObserver.observe(nextElement, { childList: true, subtree: true });
    }, 999);
    connectToBackground(extensionName);
}
exports.injectTwitchPageOnBehalfOf = injectTwitchPageOnBehalfOf;
function onBackgroundSync(background) {
    if (!background) {
        return;
    }
    if (background.sync) {
        if (currentChannel) {
            sendSyncChannel();
        }
    }
    else {
        if (background.channel !== currentChannel) {
            return;
        }
        var disable = background.disabled;
        if (disable !== undefined && disable !== isChannelDisabled) {
            document.body.classList.toggle("_" + extensionIdentifier + "-off", disable);
            isChannelDisabled = disable;
        }
    }
}
