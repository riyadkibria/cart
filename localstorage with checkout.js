<script>
// Select the cart container, total price element, and cart count element
const cartDiv = document.getElementById('my-cart');
const totalPriceElement = document.getElementById('product-total');
const cartCountElement = document.getElementById('cart-count');

// Initialize variables to store the total price and the number of items
let totalPrice = 0;
let cartItemCount = 0;

// Load cart data from localStorage on page load
window.addEventListener('DOMContentLoaded', () => {
  const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
  savedCart.forEach(product => {
    addProductToCartDOM(product.name, product.price, product.quantity);
  });

  // Recalculate the total price and update the cart count
  recalculateTotal();
  cartCountElement.textContent = document.querySelectorAll('.my-product').length;
});

// Add event listener to all Add-to-Cart buttons
document.querySelectorAll('.add-to-cart-button').forEach(button => {
  button.addEventListener('click', function () {
    // Get product name and price from the button's data attributes
    const productName = this.getAttribute('data-name');
    const productPrice = parseFloat(this.getAttribute('data-price'));

    // Check if the product is already in the cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(product => product.name === productName);

    if (existingProduct) {
      // If product exists, update its quantity
      existingProduct.quantity++;
    } else {
      // Add new product to the cart
      cart.push({ name: productName, price: productPrice, quantity: 1 });
    }

    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update the cart UI
    addProductToCartDOM(productName, productPrice, 1);

    // Update the cart count and total price
    cartItemCount++;
    recalculateTotal();
    cartCountElement.textContent = cartItemCount;
  });
});

// Function to add a product to the cart in the DOM
function addProductToCartDOM(productName, productPrice, quantity) {
  // Create a new product div for the cart
  const productDiv = document.createElement('div');
  productDiv.classList.add('my-product'); // Optional: Add a class for styling
  productDiv.setAttribute('data-name', productName); // Set product name as data attribute for easy removal

  // Create and set the product name element
  const productNameElement = document.createElement('div');
  productNameElement.id = 'product-name';
  productNameElement.textContent = productName;

  // Create and set the input field for quantity
  const quantityDiv = document.createElement('div');
  quantityDiv.id = 'quantity-div';

  const quantityInput = document.createElement('input');
  quantityInput.type = 'number';
  quantityInput.min = '1';
  quantityInput.value = quantity; // Default quantity
  quantityInput.classList.add('quantity-input'); // Optional: Add a class for styling

  // Append quantity input to the quantity div
  quantityDiv.appendChild(quantityInput);

  // Create and set the product price element
  const productPriceElement = document.createElement('div');
  productPriceElement.id = 'product-price';
  productPriceElement.textContent = `$${(productPrice * quantity).toFixed(2)}`;

  // Add an event listener to the quantity input to update the price dynamically
  quantityInput.addEventListener('input', function () {
    const updatedQuantity = parseInt(this.value) || 1; // Default to 1 if input is invalid
    const updatedPrice = productPrice * updatedQuantity;

    // Update the price display for this product
    productPriceElement.textContent = `$${updatedPrice.toFixed(2)}`;

    // Update the quantity in localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = cart.find(p => p.name === productName);
    if (product) {
      product.quantity = updatedQuantity;
      localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Recalculate the total price
    recalculateTotal();
  });

  // Create and set the remove button
  const removeButton = document.createElement('button');
  removeButton.textContent = 'Remove';
  removeButton.classList.add('remove-button'); // Optional: Add a class for styling
  removeButton.addEventListener('click', function () {
    removeProductFromCart(productName, productDiv);
  });

  // Append all elements to the new product div
  productDiv.appendChild(productNameElement);
  productDiv.appendChild(quantityDiv);
  productDiv.appendChild(productPriceElement);
  productDiv.appendChild(removeButton);

  // Append the new product div to the cart
  cartDiv.appendChild(productDiv);
}

// Function to remove a product from the cart
function removeProductFromCart(productName, productDiv) {
  // Remove the product div from the DOM
  productDiv.remove();

  // Remove the product from localStorage
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart = cart.filter(product => product.name !== productName);
  localStorage.setItem('cart', JSON.stringify(cart));

  // Recalculate the total price and update the cart count
  recalculateTotal();
  cartCountElement.textContent = document.querySelectorAll('.my-product').length;
}

// Function to recalculate the total price
function recalculateTotal() {
  totalPrice = 0;

  // Loop through all products in the cart and sum up their prices
  document.querySelectorAll('.my-product').forEach(product => {
    const priceElement = product.querySelector('#product-price');
    const price = parseFloat(priceElement.textContent.replace('$', '')) || 0;
    totalPrice += price;
  });

  // Update the total price element
  totalPriceElement.textContent = `Total: $${totalPrice.toFixed(2)}`;
}
</script>
