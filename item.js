document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (!productId) {
    document.getElementById("product-detail").innerHTML = "<p>找不到商品</p>";
    return;
  }

  try {
    const res = await fetch("https://script.google.com/macros/s/AKfycbwqzLNDJyNZn1MTfzIqMy_K9KYZE38ZCLcdP1FNSIFWXOAoRHBuZyviph_YTO73I_7rTA/exec");
    const products = await res.json();

    const product = products.find(p => String(p.ID) === productId);

    if (!product) {
      document.getElementById("product-detail").innerHTML = "<p>找不到此商品</p>";
      return;
    }

    document.getElementById("product-detail").innerHTML = `
      <div class="item-page">
        <img src="${product.商品圖片}" alt="${product.商品名稱}">
        <div class="info">
          <h2>${product.商品名稱}</h2>
          <p class="price">NT$ ${product.價格}</p>
          <p>庫存：${product.庫存}</p>
          <button onclick="addToCart('${product.ID}')">加入購物車</button>
        </div>
      </div>
    `;
  } catch (error) {
    console.error(error);
    document.getElementById("product-detail").innerHTML = "<p>載入錯誤</p>";
  }
});

// 範例購物車功能
function addToCart(productId) {
  alert("商品 " + productId + " 已加入購物車！");
  // 這邊可改用 localStorage 實作完整購物車儲存
}
