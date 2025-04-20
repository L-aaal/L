document.addEventListener("DOMContentLoaded", function () {
    const cartItemsList = document.getElementById("cart-items");
    const cartTotalElement = document.getElementById("cart-total");
    const customerInfoForm = document.getElementById("customer-info");
    const submitOrderButton = document.getElementById("submit-order");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let total = 0;

    // 顯示購物車商品
    if (cart.length > 0) {
        cartItemsList.innerHTML = ""; // 清空預設的 "您的購物車是空的。"
        cart.forEach(item => {
            const listItem = document.createElement("li");
            listItem.textContent = `${item.productName}（${item.style}）x ${item.quantity} - ${item.price} 元`;
            cartItemsList.appendChild(listItem);
            total += parseInt(item.price) * parseInt(item.quantity);
        });
        cartTotalElement.textContent = `總金額：${total} 元`;
    } else {
        cartItemsList.innerHTML = "<p>您的購物車是空的。</p>";
        cartTotalElement.textContent = "總金額：0 元";
        submitOrderButton.disabled = true; // 如果購物車是空的，停用結帳按鈕
    }

    // 處理訂單提交
    customerInfoForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(customerInfoForm);
        const order = {};

        // 檢查必填欄位
        let missingFields = [];
        formData.forEach((value, key) => {
            if (!value.trim()) missingFields.push(key);
            order[key] = value.trim();
        });

        if (missingFields.length > 0) {
            alert(`請填寫以下欄位：${missingFields.join(", ")}`);
            return;
        }

        // 自動產生訂單編號（時間戳 + 亂數）
        const timestamp = new Date().getTime();
        const random = Math.floor(Math.random() * 1000);
        order["訂單編號"] = `LAL${timestamp}${random}`;

        // 購買清單轉文字
        order["購買清單"] = cart
            .map(item => `${item.productName}（${item.style}）x ${item.quantity}`)
            .join(", ");

        // 加上時間
        order["時間"] = new Date().toLocaleString();

        console.log("即將送出的訂單資料：", order); // 🐞 Debug 用

        // 傳送到 Google Apps Script
        fetch("https://script.google.com/macros/s/AKfycbxbqlZ34fGCJL7-dUJF4fKIyD4a3GemLGelwLhIyH_yIGlbsUaBVKxIAEmy0vUftEq9pA/exec", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(order),
        })
            .then(response => response.text())
            .then(data => {
                console.log("伺服器回應：", data); // 🐞 Debug 回應
                alert("訂單已提交！");
                localStorage.removeItem("cart"); // 清空購物車
                window.location.href = "thankyou.html"; // ✅ 可改跳轉頁
            })
            .catch(error => {
                console.error("提交錯誤：", error);
                alert("提交失敗，請再試一次。\n錯誤訊息：" + error.message);
            });
    });
});
