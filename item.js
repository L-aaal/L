document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (!productId) {
        alert("商品ID無效！");
        window.location.href = "products.html"; // 導回商品列表頁
        return;
    }

    // 假設你的商品資料是從這裡取得
    fetch(`https://script.google.com/macros/s/YOUR_GOOGLE_APPS_SCRIPT_ID/exec?id=${productId}`) // 替換成你的 Google Apps Script URL
        .then(response => response.json())
        .then(product => {
            if (!product) {
                alert("找不到此商品！");
                window.location.href = "products.html"; // 導回商品列表頁
                return;
            }

            // 顯示商品資訊
            document.getElementById("product-name").textContent = product.商品名稱;
            document.getElementById("product-price").textContent = `${product.價格} 元`;
            document.getElementById("product-description").textContent = product.描述;
            document.getElementById("product-image").src = product.商品圖片;

            // 設定款式選擇
            const styleSelect = document.getElementById("style-select");
            if (product.款式) {
                const styles = product.款式.split(",");
                styles.forEach(style => {
                    const option = document.createElement("option");
                    option.value = style.trim();
                    option.textContent = style.trim();
                    styleSelect.appendChild(option);
                });
            } else {
                styleSelect.style.display = "none"; // 隱藏款式選擇框
            }

            // 加入購物車
            document.getElementById("add-to-cart").addEventListener("click", function () {
                const quantity = parseInt(document.getElementById("quantity").value);
                const selectedStyle = styleSelect.value;

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
                    image: product.商品圖片 // 加上商品圖片
                };

                let cart = JSON.parse(localStorage.getItem("cart")) || [];
                // 檢查購物車中是否已有相同商品
                const existingItemIndex = cart.findIndex(item => item.productId === cartItem.productId && item.style === cartItem.style);

                if (existingItemIndex > -1) {
                    // 如果有，則增加數量
                    cart[existingItemIndex].quantity += quantity;
                } else {
                    // 如果沒有，則加入新商品
                    cart.push(cartItem);
                }

                localStorage.setItem("cart", JSON.stringify(cart));

                alert("商品已加入購物車！");
                window.location.href = "cart.html"; // 導向購物車頁面
            });

            // 直接結帳
            document.getElementById("checkout").addEventListener("click", function () {
                const quantity = parseInt(document.getElementById("quantity").value);
                const selectedStyle = styleSelect.value;

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
                    image: product.商品圖片 // 加上商品圖片
                };

                localStorage.setItem("cart", JSON.stringify([cartItem]));
                window.location.href = "checkout.html";
            });

        })
        .catch(error => console.error("Error fetching product details:", error));

});
