export function createHeadersObject(headers) {
    const headersObject = {};
    if (!headers) return headersObject;
    headers.forEach((header) => {
        if (header.name && header.value) {
            headersObject[header.name] = header.value;
        }
    });
    return headersObject;
}

export function extractBaseDomain(url) {
    const hostname = url.hostname;
    const hostnameParts = hostname.split(".");

    // Handle localhost and IP addresses
    if (hostnameParts.length === 1 || /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
        return hostname;
    }

    if (hostnameParts[0] === "www" || hostnameParts[0] === "m") {
        // If "www" is present, return the second part
        return hostnameParts[1];
    } else {
        // Otherwise, return the first part
        return hostnameParts[0];
    }
}

export function centsToDollars(cents) {
    // Divide by 100 to convert cents to dollars
    const dollars = cents / 100;

    // Format the number to 2 decimal places
    return dollars.toFixed(2);
}

export async function urlToDomParser(url) {
    const response = await fetch(url);
    const htmlText = await response.text();
    let parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, "text/html");
    return doc;
}


export function splitDomainFromUrl(inputString) {
    const firstUnderscoreIndex = inputString.indexOf('_');

    if (firstUnderscoreIndex === -1) {
        // No underscore found in the string
        return [inputString];
    }

    const part1 = inputString.substring(0, firstUnderscoreIndex);
    const part2 = inputString.substring(firstUnderscoreIndex + 1);

    return [part1, part2];
}

export function extractMetaData(doc, metaList, attribute = "property") {
    return metaList.reduce((acc, { property, key, itemprop }) => {
        const element = doc.querySelector(`meta[${attribute}='${property || itemprop}']`);
        if (element) {
            acc[key] = element.getAttribute("content");
        }
        return acc;
    }, {});
}

const allFunctions = {
    createHeadersObject,
    extractBaseDomain,
    centsToDollars,
    urlToDomParser,
    splitDomainFromUrl,
    extractMetaData,
};

export default allFunctions;
