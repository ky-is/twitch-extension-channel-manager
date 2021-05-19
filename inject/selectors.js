"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitForSelector = void 0;
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
exports.waitForSelector = waitForSelector;
