document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (!productId) {
    document.getElementById("product-detail").innerHTML = "<p>找不到商品。</p>";
    return;
  }

  fetch("https://script.google.com/macros/s/AKfycbwqzLNDJyNZn1MTfzIqMy_K9KYZE38ZCLcdP1FNSIFWXOAoRHBuZyviph_YTO73I_7rTA/exec")
    .then(response => response.json())
    .then(data => {
      const product = data.find(item => item.ID === productId);
      if (!product) {
        document.getElementById("product-detail").innerHTML = "<p>商品不存在。</p>";
        return;
      }

      document.getElementById("product-img").src = product.商品圖片;
      document.getElementById("product-title").textContent = product.商品名稱;
      document.getElementById("product-price").textContent = `${product.價格} 元`;
      document.getElementById("product-stock").textContent = `庫存：${product.庫存} 件`;

      // 處理加入購物車
      document.getElementById("add-to-cart").addEventListener("click", () => {
        const selectedStyle = document.getElementById("style-select").value;
        const quantity = parseInt(document.getElementById("quantity-input").value);
        if (quantity <= 0) return alert("請輸入正確數量");

        const cart = JSON.parse(localStorage.getItem("cart")) ||
