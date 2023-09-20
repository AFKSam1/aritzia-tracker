// background.js
import Store from "./models/store.js";
// Chrome runtime message listener
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    switch (request.command) {
        case "clearChromeStorage":
            Store.clearAllChromeStorage();
            break;
        case "":
            break;
        case "":
            // Your code for fetching all products
            break;
        default:
            console.error("Unknown command");
    }
});












