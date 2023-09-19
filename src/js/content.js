chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    if (request.action === 'parseHtml') {
        const parser = new DOMParser();
        const doc = parser.parseFromString(request.htmlText, 'text/html');

        // Call the appropriate parsing function based on the domain
        const parsedData = parseDomainHtml(request.domain, doc);
        sendResponse({ parsedData });
    }
});

function parseDomainHtml(domain, doc) {
    let parsedData = {};
    if (domain === 'aritzia') {
        const title = doc.querySelector('.f1').textContent;

        parsedData.title = title;
        // Add more parsing logic here
    }
    // else if(domain === 'anotherStore') {...}
    return parsedData;
}
