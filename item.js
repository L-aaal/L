document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  const detailContainer = document.getElementById("product-detail");

  if (!productId) {
    detailContainer.innerHTML = "<p>無效的商品 ID。</p>";
    return;
  }

  fetch("https://script.google.com/macros/s/AKfycbwqzLNDJyNZn1MTfzIqMy_K9KYZE38ZCLcdP1FNSIFWXOAoRHBuZyviph_YTO73I_7rTA/exec")
    .then((res) => res.json())
    .then((data) => {
      const product = data.find(item => item.ID === productId);
      if (!product) {
        detailContainer.innerHTML = "<p>找不到此商品。</p>";
        return;
      }

      const styles = product.款式 ? product.款式.split(",") : [];

      detailContainer.innerHTML = `
        <div class="product-page">
          <img src="${product.圖片連結}" alt="${product.商品名稱}">
          <div class="info">
            <h2>${product.商品名稱}</h2>
            <p>價格：${product.價格} 元</p>
            <p>庫存：${product.庫存} 件</p>

            ${styles.length ? `
              <label for="style">款式：</label>
              <select id="style">
                ${styles.map(style => `<option value="${style}">${style}</option>`).join("")}
              </select><br><br>
            ` : ""}

            <label for="quantity">數量：</label>
            <input type="number" id="quantity" min="1" max="${product.庫存}" value="1" /><br><br>

            <button onclick="addToCart('${product.商品名稱}')">加入購物車</button>
          </div>
        </div>
      `;
    })
    .catch((err) => {
      detailContainer.innerHTML = "<p>載入失敗，請稍後再試。</p>";
      console.error("Error:", err);
    });
});

function addToCart(productName) {
  const style = document.getElementById("style")?.value || "無";
  const quantity = document.getElementById("quantity")?.value || 1;

  alert(`已加入購物車：${productName}（款式：${style}，數量：${quantity}）`);

  // ⬇️ 這邊你可以擴充實際加到購物車邏輯（儲存到 localStorage 或全局變數）
}
