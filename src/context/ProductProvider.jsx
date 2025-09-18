import { ProductContext, AuthContext } from "./Context";
import { useState, useEffect, useContext } from "react";
import { productsApi, userApi } from "../api";
import axios from "axios";


export default function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishList, setWishList] = useState([]);
  const { user } = useContext(AuthContext);



  useEffect(() => {
    if(user && user.cart){
      setCart(user.cart);
    } else {
      setCart([]);
    }
  }, [user]);


  useEffect(()=>{
    if(user && user.wishlist){
      setWishList(user.wishlist);
    }else{
      setWishList([]);
    }
  },[user]);


  useEffect(() => {
    if(user){
      const updatedUser = { ...user, cart, wishList };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  }, [cart, user, wishList]);
  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(productsApi);
        setProducts(data);
        console.log("fetched products", data);
      } catch (error) {
        console.log("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);


  const addToCart = async (product)=>{
    setCart((prev)=>{ 
    if(prev.some((item) => item.id === product.id)){
      return prev;
      
    }
    return [...prev, { ...product, quantity: 1 }];
  });

   try {
      await axios.patch(`${userApi}/${user.id}`, { cart: cart });
      console.log("Updated cart in db.json");
    } catch (err) {
      console.error("Error updating cart in db.json", err);
    }
  
};
  const removeFromCart = (product) => {
    setCart((prev) => prev.filter((item) => item.id !== product.id));
  };

  const increaseQuantity=(productId) => {
  setCart((prev) =>
    prev.map((item) =>
      item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
    )
  );
};

const decreaseQuantity = (productId) => {
  setCart((prev) =>
    prev
      .map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0)
  );
};


  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const addToWishList = async (product) => {
    setWishList((prev) => {
      if (prev.some((item) => item.id === product.id)) {
        return prev;
      }
      return [...prev, product];
    });

    try {
      await axios.patch(`${userApi}/${user.id}`, { wishList: wishList });
      console.log("Updated wishlist in db.json");
    } catch (err) {
      console.error("Error updating wishlist in db.json", err);
    }
  };

  const removeFromWishList = (product) => {
    setWishList((prev) => prev.filter((item) => item.id !== product.id));
  };

  return (
    <ProductContext.Provider value={{
        products,
        cart,
        addToCart,
        openCart,
        closeCart,
        isCartOpen,
        wishList,
        addToWishList,
        removeFromWishList,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}
