document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (!productId) {
        alert("商品ID無效！");
        return;
    }

    fetch("https://script.google.com/macros/s/AKfycbwqzLNDJyNZn1MTfzIqMy_K9KYZE38ZCLcdP1FNSIFWXOAoRHBuZyviph_YTO73I_7rTA/exec")
        .then((response) => response.json())
        .then((data) => {
            const product = data.find(item => item.ID === productId);
            if (!product) {
                alert("找不到此商品！");
                return;
            }

            const stock = parseInt(product.庫存);

            // 顯示商品資訊
            document.getElementById("product-name").textContent = product.商品名稱;
            document.getElementById("product-price").textContent = `${product.價格} 元`;
            document.getElementById("product-stock").textContent = `庫存：${stock} 件`;
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
                const option = document.createElement("option");
                option.value = "無";
                option.textContent = "無";
                styleSelect.appendChild(option);
            }

            // 加入購物車
            document.getElementById("add-to-cart").addEventListener("click", function () {
                const quantity = parseInt(document.getElementById("quantity").value);
                const selectedStyle = styleSelect.value;

                if (quantity <= 0 || quantity > stock) {
                    alert(`請輸入 1 ~ ${stock} 的數量！`);
                    return;
                }

                const cartItem = {
                    productId: product.ID,
                    productName: product.商品名稱,
                    price: product.價格,
                    quantity,
                    style: selectedStyle,
                };

                let cart = JSON.parse(localStorage.getItem("cart")) || [];
                cart.push(cartItem);
                localStorage.setItem("cart", JSON.stringify(cart));

                alert("商品已加入購物車！");
            });

            // 直接結帳
            document.getElementById("checkout").addEventListener("click", function () {
                const quantity = parseInt(document.getElementById("quantity").value);
                const selectedStyle = styleSelect.value;

                if (quantity <= 0 || quantity > stock) {
                    alert(`請輸入 1 ~ ${stock} 的數量！`);
                    return;
                }

                const cartItem = {
                    productId: product.ID,
                    productName: product.商品名稱,
                    price: product.價格,
                    quantity,
                    style: selectedStyle,
                };

                localStorage.setItem("cart", JSON.stringify([cartItem]));

                window.location.href = "checkout.html";
            });
        });
});
