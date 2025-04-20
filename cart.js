document.addEventListener("DOMContentLoaded", function () {
    const cartItemsList = document.getElementById("cart-items");
    const cartTotalElement = document.getElementById("cart-total");
    const checkoutButton = document.getElementById("checkout-button");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let total = 0;

    // 顯示購物車商品
    if (cart.length > 0) {
        cartItemsList.innerHTML = ""; // 清空預設的 "購物車是空的。"

        cart.forEach(item => {
            const listItem = document.createElement("li");
            listItem.textContent = `${item.productName}（${item.style}）x ${item.quantity} - ${item.price} 元`;
            cartItemsList.appendChild(listItem);
            total += parseInt(item.price) * parseInt(item.quantity);
        });

        cartTotalElement.textContent = `總金額：${total} 元`;
    } else {
        cartItemsList.innerHTML = "<p>購物車是空的。</p>";
        cartTotalElement.textContent = "總金額：0 元";
        checkoutButton.style.display = "none"; // 如果購物車是空的，隱藏結帳按鈕
    }

    // 結帳按鈕的點擊事件
    checkoutButton.addEventListener("click", function () {
        window.location.href = "checkout.html";
    });
});
