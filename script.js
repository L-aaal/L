document.addEventListener("DOMContentLoaded", function () {
    // 抓取商品資料
    fetch("https://script.google.com/macros/s/AKfycbwqzLNDJyNZn1MTfzIqMy_K9KYZE38ZCLcdP1FNSIFWXOAoRHBuZyviph_YTO73I_7rTA/exec")
        .then((response) => response.json())
        .then((data) => {
            const featured = document.getElementById("featured-products");
            const productSelect = document.getElementById("product");

            // 檢查 featured 元素是否存在
            if (featured) {
                // 清空載入區域，顯示「載入中…」
                featured.innerHTML = "<p>載入中…</p>";

                // 顯示商品卡片
                data.forEach(item => {
                    const productCard = document.createElement("div");
                    productCard.classList.add("product-card");

                    productCard.innerHTML = `
                        <a href="item.html?id=${item.ID}">
                            <img src="${item.商品圖片}" alt="${item.商品名稱}">
                            <h3>${item.商品名稱}</h3>
                            <p>價格：${item.價格} 元</p>
                            </a>
                    `;

                    featured.appendChild(productCard);
                });
            }

            // 檢查 productSelect 元素是否存在
            if (productSelect) {
                // 填充商品選擇下拉選單
                data.forEach(item => {
                    const option = document.createElement("option");
                    option.value = item.ID; // 使用 item.ID 作為選項的值
                    option.textContent = item.商品名稱;
                    productSelect.appendChild(option);
                });

                // 新增這段程式碼來處理選擇事件
                productSelect.addEventListener("change", function () {
                    const selectedProductId = this.value; // 取得選取的值 (商品 ID)
                    if (selectedProductId) {
                        window.location.href = `item.html?id=${selectedProductId}`; // 導向商品詳情頁
                    }
                });
            }
        })
        .catch((error) => console.error("Error fetching product data:", error));

    // 處理訂單送出
    const orderForm = document.getElementById("order-form");
    // 檢查 orderForm 元素是否存在
    if (orderForm) {
        orderForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const formData = new FormData(event.target);
            const orderData = {};

            formData.forEach((value, key) => {
                orderData[key] = value;
            });

            fetch("https://script.google.com/macros/s/AKfycbzfFTis35Ukfn6KJ1b_v_-9IYH2sGdwLWMNOybclapjyt7UNI2IbSHC-CGuuqKGeVZTZw/exec", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData),
            })
                .then((response) => response.text())
                .then((data) => {
                    alert("訂單已提交！");
                    event.target.reset();
                })
                .catch((error) => console.error("Error submitting order:", error));
        });
    }
});
