
// Fonts Array (Now with more styles)
const fonts = [
    "Arial",
    "Cursive",
    "Times New Roman",
    "Comic Sans MS",
    "Verdana",
    "Georgia",
    "Monospace",
    "Impact"
];

// Generate font buttons dynamically
const fontButtonsContainer = document.getElementById("fontButtons");

fonts.forEach((font) => {
    const button = document.createElement("button");
    button.textContent = font;
    button.style.fontFamily = font;
    button.onclick = () => updateFont(font);
    fontButtonsContainer.appendChild(button);
});

// Update displayed text
function updateText() {
    const inputText = document.getElementById("textInput").value;
    const neonDisplay = document.getElementById("neonDisplay");
    neonDisplay.textContent = inputText || "Your Text";
}

// Change font
function updateFont(font) {
    const neonDisplay = document.getElementById("neonDisplay");
    neonDisplay.style.fontFamily = font;
}

// Change color
function updateColor() {
    const color = document.getElementById("colorPicker").value;
    const neonDisplay = document.getElementById("neonDisplay");
    neonDisplay.style.color = color;
    neonDisplay.style.textShadow = `
0 0 5px ${color}, 
0 0 10px ${color}, 
0 0 20px ${color}, 
0 0 40px ${color}
`;
}

// Change size
function changeSize(size) {
    const neonDisplay = document.getElementById("neonDisplay");
    switch (size) {
        case "regular":
            neonDisplay.style.fontSize = "40px";
            break;
        case "medium":
            neonDisplay.style.fontSize = "60px";
            break;
        case "large":
            neonDisplay.style.fontSize = "80px";
            break;
        default:
            neonDisplay.style.fontSize = "40px";
    }
}





// Select the main image, neon display, and all the thumbnails
const mainImage = document.getElementById('mainImage');
const neonDisplay = document.getElementById('neonDisplay');
const thumbnails = document.querySelectorAll('.four-images img');

// Add a click event listener to each thumbnail
thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener('click', () => {
        // Update the src of the main image with the clicked thumbnail's src
        mainImage.src = thumbnail.src;

        // Toggle neon display visibility based on the main image src
        if (mainImage.src.includes('Bed-Room.jpeg')) {
            neonDisplay.style.display = 'block';
        } else {
            neonDisplay.style.display = 'none';
        }
    });
});

// Ensure neon display is visible for the initial state
if (!mainImage.src.includes('Bed-Room.jpeg')) {
    neonDisplay.style.display = 'none';
}







// Select the cart count element in the navbar
const cartCount = document.getElementById('cartCount');

// Function to initialize product functionality
function initializeProduct(productElement) {
    const mainImage = productElement.querySelector('#mainImage');
    const addToCartButton = productElement.querySelector('.add-to-cart h3');
    const thumbnails = productElement.querySelectorAll('.four-images img');
    const cartItems = document.getElementById('cartItems');

    // Update main image when a thumbnail is clicked
    thumbnails.forEach((thumbnail) => {
        thumbnail.addEventListener('click', () => {
            mainImage.src = thumbnail.src;
            mainImage.setAttribute('data-name', thumbnail.getAttribute('data-name'));
        });
    });

    // Add the current product to the cart
    addToCartButton.addEventListener('click', () => {
        const itemName = mainImage.getAttribute('data-name') || 'Unknown Item';
        const itemSrc = mainImage.src;

        // Create a new cart item
        const li = document.createElement('li');
        li.innerHTML = `
<span>${itemName}</span>
<img src="${itemSrc}" alt="${itemName}" width="50">
`;

        // Append the cart item to the cart list
        cartItems.appendChild(li);

        // Update the cart count
        cartCount.textContent = cartItems.children.length;
    });
}

// Initialize all products
document.querySelectorAll('.product').forEach((product) => {
    initializeProduct(product);
});





document.querySelector('.whatsapp-icon').addEventListener('click', () => {
    console.log('WhatsApp icon clicked');
    // Add your analytics tracking code here
});






// Variables for product customization
const mainimage = document.getElementById("mainImage");
const neondisplay = document.getElementById("neonDisplay");
const textInput = document.getElementById("textInput");
const colorPicker = document.getElementById("colorPicker");
const productPriceElement = document.querySelector(".price"); // Assuming the price is in a <h3>
const whatsappOrderLink = document.getElementById("whatsappOrderLink");

// New: Add a way to fetch the selected size
let selectedSize = "Regular"; // Default size

// Add an event listener to size buttons to update selectedSize
document.querySelectorAll(".size-btn").forEach((button) => {
    button.addEventListener("click", () => {
        selectedSize = button.textContent.trim(); // Update selected size based on button text
    });
});

// Add an event listener to the WhatsApp button
whatsappOrderLink.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent default link behavior

    // Collect user inputs
    const selectedText = textInput.value || "No custom text entered";
    const selectedColor = colorPicker.value;
    const selectedImageSrc = mainImage.src;
    const selectedFont = window.getComputedStyle(neonDisplay).fontFamily || "Default Font";
    const productPrice = productPriceElement.innerText.trim(); // Get the price text

    // Create a WhatsApp message
    const whatsappMessage = `
Hello, I would like to order the following product:
- Product: Customize Name Neon Sign Board
- Price: ${productPrice}
- Selected Text: ${selectedText}
- Selected Color: ${selectedColor}
- Selected Font: ${selectedFont}
- Selected Size: ${selectedSize}
- Reference Image: ${selectedImageSrc}

Please provide further details about shipping and payment. Thank you!
`;

    // Encode the message and update the WhatsApp link
    const whatsappNumber = "9351136553"; // Replace with your WhatsApp number
    const encodedMessage = encodeURIComponent(whatsappMessage.trim());
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Redirect to the dynamically generated WhatsApp link
    window.open(whatsappURL, "_blank");
});


