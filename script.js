document.addEventListener("DOMContentLoaded", function () {
  // 抓取商品資料
  fetch("https://script.google.com/macros/s/AKfycbxUgsxmXIDmBGoiHzggwoEN2iexJ1WIrDevXrAEbg671nmOwCVvuATm9oStDpoa6A8B/exec")
    .then((response) => response.json())
    .then((data) => {
      const productList = document.getElementById("product-list");
      const productSelect = document.getElementById("product");

      data.forEach(item => {
        // 顯示商品卡片
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        productCard.innerHTML = `
          <img src="${item.商品圖片}" alt="${item.商品名稱}">
          <h3>${item.商品名稱}</h3>
          <p>價格：${item.價格} 元</p>
          <p>庫存：${item.庫存} 件</p>
          <button onclick="addToCart('${item.商品名稱}')">加入購物車</button>
        `;

        productList.appendChild(productCard);

        // 填充商品選擇下拉選單
        const option = document.createElement("option");
        option.value = item.商品名稱;
        option.textContent = item.商品名稱;
        productSelect.appendChild(option);
      });
    })
    .catch((error) => console.error("Error fetching product data:", error));
});

// 處理訂單送出
document.getElementById("order-form").addEventListener("submit", function (event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const orderData = {};

  formData.forEach((value, key) => {
    orderData[key] = value;
  });

  fetch("https://script.google.com/macros/s/AKfycbxUgsxmXIDmBGoiHzggwoEN2iexJ1WIrDevXrAEbg671nmOwCVvuATm9oStDpoa6A8B/exec", {
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
