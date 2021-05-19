"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setChannelDisabled = exports.isChannelDisabled = void 0;
function getStorageKey(channelName) {
    return "__" + (channelName === null || channelName === void 0 ? void 0 : channelName.toUpperCase());
}
function isChannelDisabled(channelName) {
    return !!localStorage.getItem(getStorageKey(channelName));
}
exports.isChannelDisabled = isChannelDisabled;
function setChannelDisabled(channelName, disabled) {
    localStorage.setItem(getStorageKey(channelName), disabled ? '1' : '');
}
exports.setChannelDisabled = setChannelDisabled;
