function waitForSelector(selector, callback, maxAttemptFrames) {
    let attempts = 0;
    const waitInterval = window.setInterval(() => {
        attempts += 1;
        const element = document.querySelector(selector);
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
let isChannelDisabled = false;
let extensionIdentifier = undefined;
let currentChannel = null;
function sendSyncChannel() {
    chrome.runtime.sendMessage({ channel: currentChannel }, onBackgroundSync);
}
export function setCurrentChannel(channelName) {
    if (channelName === currentChannel) {
        return false;
    }
    currentChannel = channelName;
    sendSyncChannel();
    return true;
}
function connectToBackground(extensionName) {
    extensionIdentifier = extensionName;
    chrome.runtime.onMessage.addListener(onBackgroundSync);
}
export function injectTwitchPageOnBehalfOf(extensionName, mutationCallback) {
    let mainElement = undefined;
    const pageObserver = new window.MutationObserver((mutations) => {
        if (!mainElement) {
            return;
        }
        const newChannel = guessChannelNameFromContent(mainElement);
        setCurrentChannel(newChannel ?? null);
        mutationCallback(mutations);
    });
    function guessChannelNameFromContent(content) {
        return content.querySelector('h1')?.innerText;
    }
    waitForSelector('main', (nextElement) => {
        mainElement = nextElement;
        pageObserver.observe(nextElement, { childList: true, subtree: true });
    }, 999);
    connectToBackground(extensionName);
}
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
        const disable = background.disabled;
        if (disable !== undefined && disable !== isChannelDisabled) {
            document.body.classList.toggle(`_${extensionIdentifier}-off`, disable);
            isChannelDisabled = disable;
        }
    }
}
