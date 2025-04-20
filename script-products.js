document.addEventListener("DOMContentLoaded", function () {
    const allProductsContainer = document.getElementById("all-products");

    fetch("https://script.google.com/macros/s/AKfycbwqzLNDJyNZn1MTfzIqMy_K9KYZE38ZCLcdP1FNSIFWXOAoRHBuZyviph_YTO73I_7rTA/exec")
        .then((response) => response.json())
        .then((data) => {
            allProductsContainer.innerHTML = ""; // 清空 "載入中…"

            data.forEach(item => {
                const productCard = document.createElement("div");
                productCard.classList.add("product-card");

                // 檢查 item.商品圖片 是否存在，如果不存在，提供一個預設值
                const imageSrc = item.商品圖片 || "path/to/default-image.png"; // 替換成你的預設圖片路徑

                productCard.innerHTML = `
                    <a href="item.html?id=${item.ID}">
                        <img src="${imageSrc}" alt="${item.商品名稱}"/>
                        <h3>${item.商品名稱}</h3>
                        <p>價格：${item.價格} 元</p>
                        <p>庫存：${item.庫存} 件</p>
                    </a>
                `;

                allProductsContainer.appendChild(productCard);
            });
        })
        .catch((error) => {
            console.error("Error fetching product data:", error);
            allProductsContainer.innerHTML = "<p>載入商品失敗，請稍後再試。</p>";
        });
});
