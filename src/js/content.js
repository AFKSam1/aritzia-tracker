
const parsers = {
    aritzia: function (doc) {
        const parsedData = extractMetaData(doc, [
            { property: "og:title", key: "title" },
            { property: "og:price:amount", key: "price" },
            { property: "og:description", key: "description" },
            { property: "og:image", key: "imgUrl" }
        ]);

        parsedData.stockInfo = extractStockInfoAritzia(doc);
        return parsedData;
    },
    primitiveskate: function (doc) {
        const parsedData = {};
        const scriptElement = doc.querySelector('script[data-section-type="static-product"]');
        if (scriptElement) {
            const jsonObj = JSON.parse(scriptElement.innerHTML);
            parsedData.title = jsonObj.product.title;
            parsedData.price = (jsonObj.product.price / 100).toFixed(2);
            parsedData.imgUrl = `https:${jsonObj.product.featured_image}`;
            parsedData.stockInfo = jsonObj.product.variants.map(({ title, inventory_quantity }) => ({
                size: title,
                inventoryStatus: inventory_quantity,
            }));
        }
        return parsedData;
    },
    simons: function (doc) {
        const parsedData = extractMetaData(doc, [
            { itemprop: "image", key: "imgUrl" },
            { itemprop: "name", key: "title" }
        ], "itemprop");
    
        // Extracting the price
        const priceElement = doc.querySelector(".single-product-price");
        if (priceElement) {
            parsedData.price = parseFloat(priceElement.innerText);
        }
    
        const scriptContent = Array.from(doc.querySelectorAll('script')).map(el => el.textContent).join('\n');
        const maxStocks = extractJsonFromScript(scriptContent, /product\.maxStocks\s*=\s*(\{[\s\S]*?\});/);
        const sizesEn = extractJsonFromScript(scriptContent, /product\.sizesEn\s*=\s*(\{[\s\S]*?\});/);
    
        parsedData.stockInfo = mapColorsToStocks(doc, maxStocks, sizesEn);
        return parsedData;
    },
    
};



function extractMetaData(doc, metaList, attribute = "property") {
    return metaList.reduce((acc, { property, key, itemprop }) => {
        const element = doc.querySelector(`meta[${attribute}='${property || itemprop}']`);
        if (element) {
            acc[key] = element.getAttribute("content");
        }
        return acc;
    }, {});
}

function extractJsonFromScript(scriptContent, regex) {
    const match = scriptContent.match(regex);
    return match ? JSON.parse(match[1]) : null;
}

function extractStockInfoAritzia(doc) {
    return Array.from(doc.querySelectorAll(".ar-dropdown__option")).map(item => {
        const sizeSpan = item.querySelector(".f1");
        const inventorySpan = item.querySelector(".js-size-dropdown__inventory-status");
        if (sizeSpan && inventorySpan) {
            const size = sizeSpan.textContent.trim();
            let inventoryStatus = inventorySpan.textContent.trim() || "In Stock";
            return { size, inventoryStatus };
        }
        return null;
    }).filter(Boolean);
}


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
    return parser ? parser(doc) : null;
}

function mapColorsToStocks(doc, maxStocks,sizesEn) {
    const colorStockMap = {}; // Object to hold the mapping between color names and their stocks

    // Iterate over each color element in the DOM
    const colorElements = doc.querySelectorAll('.single-product-color.backup-color.js-color');
    colorElements.forEach((element) => {
        const colorName = element.getAttribute('title'); // Get the color name from the title attribute
        const colorId = element.getAttribute('data-product-color-id'); // Get the color ID

        // Create an object to hold the stocks of each size for this color
        const colorStocks = {};
        
        // Iterate over the maxStocks object to find the stocks that belong to this color
        for (const [key, value] of Object.entries(maxStocks)) {
            const [stockColorId, sizeCode] = key.split(':'); // Split the key to get the color ID and size code
            if (stockColorId === colorId) {
                const sizeName = sizesEn[sizeCode] || sizeCode; // Get the size name, or use the code if the name is not found
                colorStocks[sizeName] = value; // Add this size and its stock to the colorStocks object
            }
        }

        // Add this color and its stocks to the colorStockMap object
        colorStockMap[colorName] = colorStocks;
    });

    return colorStockMap; // Return the mapping
}