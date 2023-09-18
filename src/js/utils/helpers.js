function createHeadersObject(headers) {
    const headersObject = {};
    if(!headers) return headersObject;
    headers.forEach(header => {
      if (header.name && header.value) {
        headersObject[header.name] = header.value;
      }
    });
    return headersObject;
}

export default createHeadersObject;