// popup.js

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get({ items: [] }, (result) => {
        let items = result.items;
        let itemList = document.getElementById('item-list');
        items.forEach((item) => {
            let itemElement = document.createElement('div');
            itemElement.innerHTML = `
          <h2>${item.name}</h2>
          <img src="${item.imgURL}" alt="${item.name}">
          <p>Price: ${item.listPrice}</p>
          <a href="${item.prodURL}">View Item</a>
        `;
            itemList.appendChild(itemElement);
        });
    });
});
