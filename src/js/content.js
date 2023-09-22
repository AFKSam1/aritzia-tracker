// Simple logic to check if the page is a product page.
function isProductPage() {
    return true;  // Replace with actual logic
}

function setPosition(elem, pos) {
    if (pos) {
        elem.style.left = `${pos.left}px`;
        elem.style.top = `${pos.top}px`;
        elem.style.right = 'auto';
        elem.style.bottom = 'auto';
    } else {
        // default position if no position is stored
        elem.style.bottom = '10px';
        elem.style.right = '10px';
    }
}

let isDragging = false;
let diffX = 0;
let diffY = 0;
let dragStartTime;  // New: Track when dragging starts

chrome.storage.local.get('buttonPosition', function (data) {
    if (isProductPage()) {
        const bookmarkButton = document.createElement('button');
        bookmarkButton.innerHTML = "Bookmark Product";
        bookmarkButton.style.position = 'fixed';
        bookmarkButton.style.zIndex = '10000';
        bookmarkButton.style.cursor = 'move';

        setPosition(bookmarkButton, data.buttonPosition);

        bookmarkButton.addEventListener('mousedown', function (event) {
            isDragging = true;
            dragStartTime = new Date().getTime();  // New: Record the time when dragging starts
            diffX = event.clientX - bookmarkButton.getBoundingClientRect().left;
            diffY = event.clientY - bookmarkButton.getBoundingClientRect().top;
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onStop);
        });

        function onMove(event) {
            if (!isDragging) return;
            const left = event.clientX - diffX;
            const top = event.clientY - diffY;

            bookmarkButton.style.left = `${left}px`;
            bookmarkButton.style.top = `${top}px`;
            bookmarkButton.style.right = 'auto';
            bookmarkButton.style.bottom = 'auto';
        }

        function onStop() {
            let dragEndTime = new Date().getTime();
            let dragDuration = dragEndTime - dragStartTime;

            if (dragDuration < 200) {
                bookmarkProduct();
            } else {
                chrome.storage.local.set({
                    'buttonPosition': {
                        left: parseInt(bookmarkButton.style.left),
                        top: parseInt(bookmarkButton.style.top)
                    }
                });
            }

            isDragging = false;
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onStop);
        }

        function bookmarkProduct() {
            // Your bookmark logic here
            chrome.runtime.sendMessage({ action: "bookmarkProduct", url: window.location.href });
        }

        bookmarkButton.onclick = function (event) {
            // The logic to determine if it was a click is now in onStop,
            // so we don't need any additional checks here.
            bookmarkProduct();
        };

        document.body.appendChild(bookmarkButton);
    }
});
