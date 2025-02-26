const addToCart = (product) => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      alert("Please log in to add items to the cart.");
      return;
    }
  
    const cartKey = `cart_${storedUser.username}`;
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  
    const itemIndex = cart.findIndex((item) => item.id === product.id);
    if (itemIndex !== -1) {
      cart[itemIndex].quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
  
    localStorage.setItem(cartKey, JSON.stringify(cart));
  
    // Trigger storage event manually
    window.dispatchEvent(new Event("storage"));
  };
  