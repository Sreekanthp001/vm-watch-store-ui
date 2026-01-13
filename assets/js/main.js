/*==================== VENTUREMOND CART LOGIC ====================*/

// 1. Open/Close Cart (Already existing but making it robust)
const cart = document.getElementById('cart'),
      cartShop = document.getElementById('cart-shop'),
      cartClose = document.getElementById('cart-close')

if(cartShop){
    cartShop.addEventListener('click', () =>{
        cart.classList.add('show-cart')
        displayCart() // Refresh cart when opening
    })
}

if(cartClose){
    cartClose.addEventListener('click', () =>{
        cart.classList.remove('show-cart')
    })
}

// 2. Add to Cart Logic
let watchCart = JSON.parse(localStorage.getItem('vm_watch_cart')) || [];

/*==================== VENTUREMOND UPDATED LOGIC ====================*/

function addToCart(name, price, img) {
    const item = {
        name: name,
        price: parseFloat(price.replace('$', '')),
        img: img,
        quantity: 1
    };

    // 1. Check if already in cart
    const existingItem = watchCart.find(i => i.name === name);
    if(existingItem) {
        existingItem.quantity += 1;
    } else {
        watchCart.push(item);
    }

    // 2. Save to Storage
    localStorage.setItem('vm_watch_cart', JSON.stringify(watchCart));

    // 3. Updated Alert Message (Nuvvu korukunnattu)
    alert("Successfully added to cart!");

    // 4. Automatic Cart Close logic
    // Bedimcode template lo cart class "show-cart" tho untundi
    const cartMenu = document.getElementById('cart');
    if(cartMenu) {
        cartMenu.classList.remove('show-cart'); 
    }

    displayCart();
}

// 3. Display Cart Items
function displayCart() {
    const cartContainer = document.querySelector('.cart__container');
    const itemsCountLabel = document.querySelector('.cart__prices-item');
    const totalPriceLabel = document.querySelector('.cart__prices-total');
    
    cartContainer.innerHTML = '';
    let total = 0;
    let count = 0;

    watchCart.forEach((item, index) => {
        total += item.price * item.quantity;
        count += item.quantity;

        cartContainer.innerHTML += `
            <article class="cart__card">
                <div class="cart__box">
                    <img src="${item.img}" alt="" class="cart__img">
                </div>
                <div class="cart__details">
                    <h3 class="cart__title">${item.name}</h3>
                    <span class="cart__price">$${item.price}</span>
                    <div class="cart__amount">
                        <div class="cart__amount-content">
                            <span class="cart__amount-box" onclick="updateQty(${index}, -1)">
                                <i class='bx bx-minus'></i>
                            </span>
                            <span class="cart__amount-number">${item.quantity}</span>
                            <span class="cart__amount-box" onclick="updateQty(${index}, 1)">
                                <i class='bx bx-plus'></i>
                            </span>
                        </div>
                        <i class='bx bx-trash-alt cart__amount-trash' onclick="removeItem(${index})"></i>
                    </div>
                </div>
            </article>
        `;
    });

    itemsCountLabel.textContent = `${count} items`;
    totalPriceLabel.textContent = `$${total}`;
}

// 4. Update Quantity & Remove
window.updateQty = (index, change) => {
    watchCart[index].quantity += change;
    if(watchCart[index].quantity <= 0) {
        watchCart.splice(index, 1);
    }
    localStorage.setItem('vm_watch_cart', JSON.stringify(watchCart));
    displayCart();
}

window.removeItem = (index) => {
    watchCart.splice(index, 1);
    localStorage.setItem('vm_watch_cart', JSON.stringify(watchCart));
    displayCart();
}

// 5. Link Buttons in HTML
// Ikkada manam HTML lo unna buttons ki event listeners add chestunnam
document.addEventListener('click', (e) => {
    if(e.target.classList.contains('button') && e.target.innerText === 'ADD TO CART' || e.target.closest('.products__button')) {
        const card = e.target.closest('article');
        const name = card.querySelector('h3').innerText;
        const price = card.querySelector('span[class*="price"]').innerText;
        const img = card.querySelector('img').src;
        
        addToCart(name, price, img);
    }
});

// Initial Load
displayCart();