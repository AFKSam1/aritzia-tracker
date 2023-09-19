const parsers = {
    aritzia: function(doc) {
        let parsedData = {};
        const titleElement = doc.querySelector("meta[property='og:title']");
        if (titleElement) {
            parsedData.title = titleElement.getAttribute("content");
        }

        // Extract price
        const priceElement = doc.querySelector("meta[property='og:price:amount']");
        if (priceElement) {
            parsedData.price = priceElement.getAttribute("content");
        }

        // Extract description
        const descriptionElement = doc.querySelector("meta[property='og:description']");
        if (descriptionElement) {
            parsedData.description = descriptionElement.getAttribute("content");
        }
        const imgUrl = doc.querySelector("meta[property='og:image']");
        if (imgUrl) {
            parsedData.imgUrl = imgUrl.getAttribute("content");
        }
        const stockInfo = doc.querySelector("meta[property='og:availability']");
        if (stockInfo) {
            parsedData.stockInfo = stockInfo.getAttribute("content");
        }
        // Get all the 'li' elements with the class 'ar-dropdown__option' from the document
        const listItems = document.querySelectorAll('.ar-dropdown__option');

        // Initialize an array to hold sizes and inventory statuses
        const sizeInfo = [];

        // Loop through each 'li' element
        listItems.forEach((item) => {
        // Find the 'span' with class 'f1' inside each 'li'
        const sizeSpan = item.querySelector('.f1');

        // Find the 'span' with class 'js-size-dropdown__inventory-status' inside each 'li'
        const inventorySpan = item.querySelector('.js-size-dropdown__inventory-status');

        // If both 'span' elements exist, capture their text content
        if (sizeSpan && sizeSpan.textContent && inventorySpan) {
            const size = sizeSpan.textContent.trim();
            var inventoryStatus = inventorySpan.textContent.trim();
            if(inventoryStatus == ''){
                inventoryStatus = "In Stock";
            }

            // Store the size and its inventory status in an object, and add it to the array
            sizeInfo.push({ size, inventoryStatus });
        }
        });

        // Log the sizes array to the console
        console.log(sizeInfo);
        parsedData.sizes = sizeInfo;


        console.log(parsedData);
        return parsedData;
    },
    anotherStore: function(doc) {
      // specific parsing logic for another store
    }
    // ...
  };




chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    if (request.action === "parseHtml") {
        const parser = new DOMParser();
        const doc = parser.parseFromString(request.htmlText, "text/html");

        // Call the appropriate parsing function based on the domain
        const parsedData = parseDomainHtml(request.domain, doc);
        sendResponse({ parsedData });
    }
});

function parseDomainHtml(domain, doc) {
    const parser = parsers[domain];
    return parser(doc);
}
