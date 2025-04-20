document.addEventListener("DOMContentLoaded", function () {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const cartList = document.getElementById("cart-list");
  const totalPrice = document.getElementById("total-price");
  let total = 0;

  if (cartItems.length === 0) {
    cartList.innerHTML = "<p>購物車是空的。</p>";
    return;
  }

  cartItems.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${item.productName}（${item.style}）x ${item.quantity} - ${item.price}元`;
    cartList.appendChild(listItem);
    total += parseInt(item.price) * parseInt(item.quantity);
  });

  totalPrice.textContent = `總金額：${total} 元`;

  document.getElementById("checkout-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const order = {};

    formData.forEach((value, key) => {
      order[key] = value;
    });

    // 自動產生訂單編號（使用時間戳+亂數）
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    order["訂單編號"] = `LAL${timestamp}${random}`;

    // 購買清單轉文字
    order["購買清單"] = cartItems
      .map((item) => `${item.productName}（${item.style}）x ${item.quantity}`)
      .join(", ");

    // 加上時間
    order["時間"] = new Date().toLocaleString();

    // 傳送到 Google Apps Script
    fetch("https://script.google.com/macros/s/AKfycbzPOjIm9CQW6tUkPjIbocP7gw99xltPZ8uMW-RiSQLB5bh1gULZ3oVDu7ZP8HHcfDJ_/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    })
      .then((response) => response.text())
      .then((data) => {
        alert("訂單已提交！");
        localStorage.removeItem("cart"); // 清空購物車
        window.location.href = "index.html"; // 跳回首頁或其他頁
      })
      .catch((error) => {
        console.error("Error submitting order:", error);
        alert("提交失敗，請再試一次。");
      });
  });
});
