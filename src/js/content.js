import ProductUpdater from "./services/ProductUpdater.js";


// Simple logic to check if the page is a product page. This will vary based on the store.
function isProductPage() {
    return true;
  }
  
  if (isProductPage()) {
    document.addEventListener("DOMContentLoaded", function() {

    const bookmarkButton = document.createElement('button');
    bookmarkButton.innerHTML = "Bookmark Product";
    bookmarkButton.style.position = 'fixed';
    bookmarkButton.style.bottom = '10px';
    bookmarkButton.style.right = '10px';
    bookmarkButton.style.zIndex = '10000';  // Ensure it's above other page elements
  
    bookmarkButton.onclick = function() {
    
      test();
    };
  
    document.body.appendChild(bookmarkButton);
})
}

function test(){

    ProductUpdater.handleBookmarkPage(window.location.href)
    .then(() => {
      console.log("Product saved successfulllyyy");
    })
    .catch((error) => {
      console.log("Errror saving product");
    });
}
  

