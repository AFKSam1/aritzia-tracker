// content.js

// This function will be used to send a message to the background script
function sendMessageToBackgroundScript(message) {
    chrome.runtime.sendMessage(message, (response) => {
        console.log(response);
    });
}

// You'll need to add an event listener to the bookmark button
// This is just an example and may not work depending on the actual structure of the webpage
let bookmarkButton = document.querySelector('.bookmark-button');
bookmarkButton.addEventListener('click', () => {
    // Get the item details
    let item = {
        listPrice: document.querySelector('.item-price').innerText,
        name: document.querySelector('.item-name').innerText,
        imgURL: document.querySelector('.item-image').src,
        prodURL: window.location.href
    };

    // Send a message to the background script with the item details
    sendMessageToBackgroundScript({ action: 'bookmark', item: item });
});
