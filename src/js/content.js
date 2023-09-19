const parsers = {
    aritzia: function(doc) {
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
    let parsedData = {};
    if (domain === "aritzia") {
        // Extract title
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
        

        // Log or return the extracted data
        console.log(parsedData);
        return parsedData;
    }
    // else if(domain === 'anotherStore') {...}
    return parsedData;
}
