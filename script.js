// ============================
// MOBILE MENU
// ============================

const bar = document.getElementById("bar");
const close = document.getElementById("close");
const navbar = document.getElementById("navbar");

if (bar) {
    bar.addEventListener("click", function () {
        navbar.classList.add("active");
    });
}

if (close) {
    close.addEventListener("click", function () {
        navbar.classList.remove("active");
    });
}


// ============================
// CLOSE MOBILE MENU
// ============================

const navLinks = document.querySelectorAll("#navbar a");

navLinks.forEach(function (link) {

    link.addEventListener("click", function () {

        if (navbar) {
            navbar.classList.remove("active");
        }

    });

});


// ============================
// CART DATA
// ============================

let cart = JSON.parse(localStorage.getItem("cart")) || [];


// ============================
// CART COUNT
// ============================

function updateCartCount() {

    const cartCounter =
        document.getElementById("cart-count");

    if (cartCounter) {

        let total = 0;

        cart.forEach(function (item) {

            total += item.quantity;

        });

        cartCounter.innerText = total;
    }
}

updateCartCount();


// ============================
// ADD PRODUCT TO CART
// ============================

const cartButtons =
    document.querySelectorAll(".cart-btn");

cartButtons.forEach(function (button) {

    button.addEventListener("click", function (event) {

        event.stopPropagation();

        const product =
            button.closest(".product");

        if (!product) {
            return;
        }

        const name =
            product.querySelector("h5").innerText;

        const price =
            parseFloat(
                product
                    .querySelector("h4")
                    .innerText
                    .replace("$", "")
            );

        const image =
            product.querySelector("img").src;


        const existingProduct =
            cart.find(function (item) {

                return item.name === name;

            });


        if (existingProduct) {

            existingProduct.quantity++;

        } else {

            cart.push({

                name: name,

                price: price,

                image: image,

                quantity: 1

            });

        }


        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );


        updateCartCount();

        alert("Product added to cart!");

    });

});


// ============================
// PRODUCT DETAILS PAGE
// ============================

const products =
    document.querySelectorAll(".product");


products.forEach(function (product) {

    product.addEventListener("click", function (event) {

        // Don't open product page
        // when cart button is clicked

        if (event.target.closest(".cart-btn")) {
            return;
        }


        const name =
            product.querySelector("h5").innerText;

        const price =
            product.querySelector("h4").innerText;

        const image =
            product.querySelector("img").src;


        localStorage.setItem(
            "selectedProduct",
            JSON.stringify({

                name: name,

                price: price,

                image: image

            })
        );


        window.location.href =
            "product.html";

    });

});


// ============================
// LOAD SELECTED PRODUCT
// ============================

const selectedProduct =
    JSON.parse(
        localStorage.getItem("selectedProduct")
    );


const productName =
    document.getElementById("product-name");

const productPrice =
    document.getElementById("product-price");

const mainImage =
    document.getElementById("main-image");


if (selectedProduct && productName) {

    productName.innerText =
        selectedProduct.name;

    productPrice.innerText =
        selectedProduct.price;

    if (mainImage) {

        mainImage.src =
            selectedProduct.image;

    }

}


// ============================
// PRODUCT PAGE - ADD TO CART
// ============================

const addProductButton =
    document.getElementById("add-product");


if (addProductButton) {

    addProductButton.addEventListener(
        "click",
        function () {

            const name =
                document
                    .getElementById("product-name")
                    .innerText;


            const price =
                parseFloat(
                    document
                        .getElementById("product-price")
                        .innerText
                        .replace("$", "")
                );


            const image =
                document
                    .getElementById("main-image")
                    .src;


            const quantityInput =
                document.getElementById("quantity");


            let quantity = 1;


            if (quantityInput) {

                quantity =
                    parseInt(quantityInput.value);

            }


            const existingProduct =
                cart.find(function (item) {

                    return item.name === name;

                });


            if (existingProduct) {

                existingProduct.quantity +=
                    quantity;

            } else {

                cart.push({

                    name: name,

                    price: price,

                    image: image,

                    quantity: quantity

                });

            }


            localStorage.setItem(
                "cart",
                JSON.stringify(cart)
            );


            updateCartCount();

            alert("Product added to cart!");

        }
    );

}


// ============================
// DISPLAY CART
// ============================

const cartItems =
    document.getElementById("cart-items");


function displayCart() {

    if (!cartItems) {
        return;
    }


    cartItems.innerHTML = "";


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <tr>

                <td colspan="6">
                    Your cart is empty.
                </td>

            </tr>

        `;

        updateTotal();

        return;
    }


    cart.forEach(function (item, index) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>

                <button
                    class="remove-item"
                    onclick="removeItem(${index})">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>


            <td>

                <img
                    src="${item.image}"
                    alt="${item.name}">

            </td>


            <td>
                ${item.name}
            </td>


            <td>
                $${item.price}
            </td>


            <td>

                <input
                    class="quantity-input"
                    type="number"
                    min="1"
                    value="${item.quantity}"
                    onchange="changeQuantity(${index}, this.value)">

            </td>


            <td>
                $${(
                    item.price *
                    item.quantity
                ).toFixed(2)}
            </td>

        `;


        cartItems.appendChild(row);

    });


    updateTotal();

}


displayCart();


// ============================
// REMOVE PRODUCT
// ============================

function removeItem(index) {

    cart.splice(index, 1);


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    updateCartCount();

    displayCart();

}


// ============================
// CHANGE QUANTITY
// ============================

function changeQuantity(index, quantity) {

    quantity =
        parseInt(quantity);


    if (
        quantity < 1 ||
        isNaN(quantity)
    ) {

        quantity = 1;

    }


    cart[index].quantity =
        quantity;


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    updateCartCount();

    displayCart();

}


// ============================
// CART TOTAL
// ============================

function updateTotal() {

    const subtotal =
        document.getElementById("cart-subtotal");

    const total =
        document.getElementById("cart-total");


    if (!subtotal || !total) {
        return;
    }


    let amount = 0;


    cart.forEach(function (item) {

        amount +=
            item.price *
            item.quantity;

    });


    subtotal.innerText =
        "$" + amount.toFixed(2);


    total.innerText =
        "$" + amount.toFixed(2);

}


// ============================
// COUPON
// ============================

const couponButton =
    document.getElementById("apply-coupon");


if (couponButton) {

    couponButton.addEventListener(
        "click",
        function () {

            const coupon =
                document
                    .getElementById("coupon-input")
                    .value
                    .trim()
                    .toUpperCase();


            if (coupon === "SAVE10") {

                let amount = 0;


                cart.forEach(function (item) {

                    amount +=
                        item.price *
                        item.quantity;

                });


                amount =
                    amount * 0.90;


                document.getElementById(
                    "cart-total"
                ).innerText =
                    "$" + amount.toFixed(2);


                alert(
                    "10% discount applied!"
                );

            } else {

                alert("Invalid coupon!");

            }

        }
    );

}


// ============================
// CHECKOUT
// ============================

const checkout =
    document.getElementById("checkout");


if (checkout) {

    checkout.addEventListener(
        "click",
        function () {

            if (cart.length === 0) {

                alert(
                    "Your cart is empty!"
                );

            } else {

                alert(
                    "Order placed successfully!"
                );

            }

        }
    );

}


// ============================
// NEWSLETTER
// ============================

const subscribeButton =
    document.getElementById("subscribe");


if (subscribeButton) {

    subscribeButton.addEventListener(
        "click",
        function () {

            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();


            if (email === "") {

                alert(
                    "Please enter your email."
                );

            } else {

                alert(
                    "Thank you for subscribing!"
                );


                document.getElementById(
                    "email"
                ).value = "";

            }

        }
    );

}

const sendMessage = document.getElementById("send-message");

if (sendMessage) {

    sendMessage.addEventListener("click", function () {

        alert("Thank you! Your message has been submitted.");

    });

}
