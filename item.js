document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (!productId) {
        alert("商品ID無效！");
        window.location.replace("products.html");
        return;
    }

    // 改：取得整份資料，前端篩選對應 ID
    const productDetailsURL = "https://script.google.com/macros/s/AKfycbwqzLNDJyNZn1MTfzIqMy_K9KYZE38ZCLcdP1FNSIFWXOAoRHBuZyviph_YTO73I_7rTA/exec";

    fetch(productDetailsURL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // 前端篩選符合的商品
            const product = data.find(item => item.ID === productId);
            if (!product) {
                alert("找不到此商品！");
                window.location.replace("products.html");
                return;
            }

            // 顯示商品資訊
            const productNameElement = document.getElementById("product-name");
            const productPriceElement = document.getElementById("product-price");
            const productDescriptionElement = document.getElementById("product-description");
            const productImageElement = document.getElementById("product-image");

            if (productNameElement) productNameElement.textContent = product.商品名稱;
            if (productPriceElement) productPriceElement.textContent = `${product.價格} 元`;
            if (productDescriptionElement) productDescriptionElement.textContent = product.描述;
            if (productImageElement) productImageElement.src = product.商品圖片;

            // 設定款式選擇
            const styleSelect = document.getElementById("style-select");
            if (styleSelect) {
                if (product.款式) {
                    const styles = product.款式.split(",");
                    styles.forEach(style => {
                        const option = document.createElement("option");
                        option.value = style.trim();
                        option.textContent = style.trim();
                        styleSelect.appendChild(option);
                    });
                } else {
                    styleSelect.style.display = "none";
                }
            }

            // 加入購物車
            const addToCartButton = document.getElementById("add-to-cart");
            if (addToCartButton) {
                addToCartButton.addEventListener("click", function () {
                    const quantityInput = document.getElementById("quantity");
                    const quantity = parseInt(quantityInput.value, 10);
                    const selectedStyle = styleSelect ? styleSelect.value : "";

                    if (quantity <= 0 || isNaN(quantity)) {
                        alert("請輸入有效的數量！");
                        return;
                    }

                    const cartItem = {
                        productId: product.ID,
                        productName: product.商品名稱,
                        price: product.價格,
                        quantity: quantity,
                        style: selectedStyle,
                        image: product.商品圖片
                    };

                    let cart = JSON.parse(localStorage.getItem("cart")) || [];
                    const existingItemIndex = cart.findIndex(item => item.productId === cartItem.productId && item.style === cartItem.style);

                    if (existingItemIndex > -1) {
                        cart[existingItemIndex].quantity += quantity;
                    } else {
                        cart.push(cartItem);
                    }

                    localStorage.setItem("cart", JSON.stringify(cart));

                    alert("商品已加入購物車！");
                    window.location.replace("cart.html");
                });
            }

            // 直接結帳
            const checkoutButton = document.getElementById("checkout");
            if (checkoutButton) {
                checkoutButton.addEventListener("click", function () {
                    const quantityInput = document.getElementById("quantity");
                    const quantity = parseInt(quantityInput.value, 10);
                    const selectedStyle = styleSelect ? styleSelect.value : "";

                    if (quantity <= 0 || isNaN(quantity)) {
                        alert("請輸入有效的數量！");
                        return;
                    }

                    const cartItem = {
                        productId: product.ID,
                        productName: product.商品名稱,
                        price: product.價格,
                        quantity: quantity,
                        style: selectedStyle,
                        image: product.商品圖片
                    };

                    localStorage.setItem("cart", JSON.stringify([cartItem]));
                    window.location.replace("checkout.html");
                });
            }

        })
        .catch(error => console.error("Error fetching product details:", error));
});
