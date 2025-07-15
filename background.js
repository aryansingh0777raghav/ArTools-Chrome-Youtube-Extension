// This script runs in the background.

// A rule to enable the extension only on YouTube video pages.
const youtubeRule = {
    conditions: [
        new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: 'www.youtube.com', pathContains: '/watch' },
        })
    ],
    actions: [new chrome.declarativeContent.ShowAction()],
};

// Fired when the extension is first installed, updated, or Chrome is updated.
chrome.runtime.onInstalled.addListener(() => {
    // The declarativeContent API is not available in Manifest V3.
    // We will handle the UI logic in the popup script instead.
    console.log("ArTools extension installed.");
});