const parsers = {
    aritzia: function (doc) {
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

        // Get all the 'li' elements with the class 'ar-dropdown__option' from the document
        const listItems = doc.querySelectorAll(".ar-dropdown__option");

        // Initialize an array to hold sizes and inventory statuses
        const stockInfo = [];

        // Loop through each 'li' element
        listItems.forEach((item) => {
            // Find the 'span' with class 'f1' inside each 'li'
            const sizeSpan = item.querySelector(".f1");

            // Find the 'span' with class 'js-size-dropdown__inventory-status' inside each 'li'
            const inventorySpan = item.querySelector(".js-size-dropdown__inventory-status");

            // If both 'span' elements exist, capture their text content
            if (sizeSpan && sizeSpan.textContent && inventorySpan) {
                const size = sizeSpan.textContent.trim();
                var inventoryStatus = inventorySpan.textContent.trim();
                if (inventoryStatus == "") {
                    inventoryStatus = "In Stock";
                }

                // Store the size and its inventory status in an object, and add it to the array
                stockInfo.push({ size, inventoryStatus });
            }
        });

        // Log the sizes array to the console
        console.log(stockInfo);
        parsedData.stockInfo = stockInfo;

        console.log(parsedData);
        return parsedData;
    },
    primitiveskate: function (doc) {
        // Fetch and parse the document using jsdom or other methods to get 'doc' as a DOM object.
        // Assuming 'doc' is your parsed DOM object...

        let parsedData = {};

        // Extract JSON object embedded in the script tag
        const scriptElement = doc.querySelector('script[data-section-type="static-product"]');
        if (scriptElement) {
            const jsonText = scriptElement.innerHTML;
            const jsonObj = JSON.parse(jsonText);

            // Extract relevant product information
            parsedData.title = jsonObj.product.title;
            //Froms cents to dollars
            parsedData.price = (jsonObj.product.price/100).toFixed(2);
            parsedData.imgUrl ="https:"+(jsonObj.product.featured_image);
            // parsedData.imgUrl = "https://primitiveskate.com/cdn/shop/products/PAPHO2123-SKINLSTEE-BLK-F.jpg?v=1646946822"
            // console.log(jsonObj.product.featured_image).slice(2)
            // console.log(parsedData.imgUrl)
            // Extract stock information
            const stockInfo = jsonObj.product.variants.map((variant) => {
                return {
                    size: variant.title,
                    inventoryStatus: variant.inventory_quantity,
                };
            });
            parsedData.stockInfo = stockInfo;
        }

        console.log(parsedData);
        return parsedData;
    },
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
