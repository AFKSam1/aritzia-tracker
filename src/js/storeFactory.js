// In storeFactory.js
async function createStoreHandler(domain) {
    let storeClass;
    try {
      storeClass = await import(`./stores/${domain}.js`);
    } catch (error) {
      console.log(`Handler for ${domain} not found`);
      return null;
    }
    return new storeClass.default();
  }
  export default createStoreHandler;
  