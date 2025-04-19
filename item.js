document.addEventListener("DOMContentLoaded", function () {
  // 從 URL 中抓取商品 ID
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  // 確認是否有有效的商品 ID
  if (!productId) {
    alert("商品ID無效！");
    return;
  }

  // 從 Google Apps Script 載入商品資料
  fetch("https://script.google.com/macros/s/AKfycbwqzLNDJyNZn1MTfzIqMy_K9KYZE38ZCLcdP1FNSIFWXOAoRHBuZyviph_YTO73I_7rTA/exec")
    .then((response) => response.json())
    .then((data) => {
      const product = data.find(item => item.ID === productId);
      if (!product) {
        alert("找不到此商品！");
        return;
      }

      // 顯示商品詳細資料
      document.getElementById("product-name").textContent = product.商品名稱;
      document.getElementById("product-price").textContent = `${product.價格} 元`;
      document.getElementById("product-stock").textContent = `庫存：${product.庫存} 件`;
      document.getElementById("product-image").src = product.商品圖片;

      // 設定款式選擇
      const styleSelect = document.getElementById("style-select");
      const styles = ["A款", "B款"];
      styles.forEach(style => {
        const option = document.createElement("option");
        option.value = style;
        option.textContent = style;
        styleSelect.appendChild(option);
      });

      // 處理加入購物車
      document.getElementById("add-to-cart").addEventListener("click", function () {
        const quantity = document.getElementById("quantity").value;
        const selectedStyle = styleSelect.value;

        if (quantity <= 0) {
          alert("請選擇有效的數量！");
          return;
        }

        // 儲存選擇的商品和數量到 localStorage
        const cartItem = {
          productId: product.ID,
          productName: product.商品名稱,
          price: product.價格,
          quantity: quantity,
          style: selectedStyle,
        };

        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push(cartItem);
        localStorage.setItem("cart", JSON.stringify(cart));

        alert("商品已加入購物車！");
      });

      // 處理直接結帳
      document.getElementById("checkout").addEventListener("click", function () {
        const quantity = document.getElementById("quantity").value;
        const selectedStyle = styleSelect.value;

        if (quantity <= 0) {
          alert("請選擇有效的數量！");
          return;
        }

        const orderData = {
          productId: product.ID,
          productName: product.商品名稱,
          price: product.價格,
          quantity: quantity,
          style: selectedStyle,
        };

        // 將訂單資料送到 Google Apps Script
        fetch("https://script.google.com/macros/s/AKfycbzPOjIm9CQW6tUkPjIbocP7gw99xltPZ8uMW-RiSQLB5bh1gULZ3oVDu7ZP8HHcfDJ_/exec", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        })
          .then((response) => response.text())
          .then((data) => {
            alert("訂單已提交！");
            window.location.href = "checkout.html";  // 跳轉到結帳頁面
          })
          .catch((error) => console.error("Error submitting order:", error));
      });
    })
    .catch((error) => console.error("Error fetching product data:", error));
});
