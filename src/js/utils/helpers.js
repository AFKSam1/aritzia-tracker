export function createHeadersObject(headers) {
    const headersObject = {};
    if(!headers) return headersObject;
    headers.forEach(header => {
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
  
    if (hostnameParts[0] === 'www') {
      // If "www" is present, return the second part
      return hostnameParts[1];
    } else {
      // Otherwise, return the first part
      return hostnameParts[0];
    }
  }
  
  
const allFunctions = {
    createHeadersObject,
    extractBaseDomain
  };
  
  export default allFunctions;