// The following is needed to open option page automatically
// if the locale is not set
// https://stackoverflow.com/questions/49192636/how-can-i-open-my-options-html-currently-i-get-cannot-read-property-create-of
//
// This Js file is run in the background, see:
// https://developer.chrome.com/extensions/background_pages
chrome.runtime.onMessage.addListener(function(message) {
    switch (message.action) {
        case "openOptionsPage":
            openOptionsPage();
            break;
        default:
            break;
    }
});

chrome.commands.onCommand.addListener(function (command) {
    if (command === "translate-math") {
      //Send keyboard shortcut click to the current tab
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {"action": "translate-math"});
      });
    }
});

function openOptionsPage(){
    chrome.runtime.openOptionsPage();
}
