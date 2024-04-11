import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);

  useEffect(() => {
    axios
      .get(
        "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json"
      )
      .then((response) => {
        const data = response.data;
        setItems(data.categories);
        setFilteredItems(data.categories);
      });
  }, []);

  const filterItems = (category) => {
    if (category === "all") {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(
        (item) => item.category_name.toLowerCase() === category.toLowerCase()
      );
      setFilteredItems(filtered);
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = items.map((item) => {
      return {
        ...item,
        category_products: item.category_products.filter((product) =>
          product.title.toLowerCase().includes(query) ||
          product.vendor.toLowerCase().includes(query)
        ),
      };
    });
    setFilteredItems(filtered);
  };

  const addToCart = (product) => {
    setCartItems([...cartItems, { ...product, quantity: 1 }]);
  };

  const removeFromCart = (index) => {
    const updatedCart = [...cartItems];
    updatedCart.splice(index, 1);
    setCartItems(updatedCart);
  };

  const updateQuantity = (index, quantity) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity = quantity;
    setCartItems(updatedCart);
  };

  return (
    <div className="page">
      <h1>Our Products</h1>
      <div className="cart-icon" onClick={() => setIsCartVisible(!isCartVisible)}>
        <span>Cart ({cartItems.length})</span>
      </div>
      <div className="buttons">
        <button onClick={() => filterItems("Men")}>Men</button>
        <button onClick={() => filterItems("Women")}>Women</button>
        <button onClick={() => filterItems("Kids")}>Kids</button>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <div className="categories">
        {filteredItems.map((category) =>
          category.category_products.map((product) => (
            <div className="product" key={product.title}>
              <img src={product.image} alt={product.title} />
              <h3>{product.title}</h3>
              <p>Price: ${product.price} <strike>${product.compare_at_price}</strike></p>
              <p>Vendor: {product.vendor}</p>
              {product.badge_text && <span className="badge">{product.badge_text}</span>}
              <button onClick={() => addToCart(product)}>Add to Cart</button>
            </div>
          ))
        )}
      </div>
      {isCartVisible && <Cart items={cartItems} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />}
    </div>
  );
}

function Cart({ items, removeFromCart, updateQuantity }) {
 
  const totalAmount = items.reduce((acc, curr) => {
    const price = parseFloat(curr.price) * curr.quantity; 
    return acc + (isNaN(price) ? 0 : price);
  }, 0);

  const formattedTotal = isNaN(totalAmount) ? "0.00" : totalAmount.toFixed(2);

  return (
    <div className="cart">
      <h2>Shopping Cart</h2>
      {items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          <ul>
            {items.map((item, index) => (
              <li key={index}>
                <strong>{item.title}</strong> - ${item.price || 0} x{" "}
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(index, parseInt(e.target.value))}
                  min={1}
                />
                <button onClick={() => removeFromCart(index)}>Remove</button>
                <div>
                  <img src={item.image} alt={item.title} style={{ width: "50px", height: "auto" }} />
                </div>
                <p>{item.vendor}</p>
              </li>
            ))}
          </ul>
          <p>Total: ${formattedTotal}</p>
        </div>
      )}
    </div>
  );
}

export default App;