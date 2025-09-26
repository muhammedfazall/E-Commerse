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


  useEffect(()=>{
    if(!user)return;

    const updateCartOnServer= async () => {
      try{
        await axios.patch(`${userApi}/${user.id}`,{cart});
        console.log("updated cart on server")
      }catch(error){
        console.log("Error updating on server",error);
        
      }
    }

    updateCartOnServer();
  },[cart,user]);


  useEffect(() => {
  if (!user) return;

  const updateWishListOnServer = async () => {
    try {
      await axios.patch(`${userApi}/${user.id}`, { wishList });
      console.log("Updated wishlist on server");
    } catch (err) {
      console.error("Error updating wishlist on server:", err);
    }
  };

  updateWishListOnServer();
}, [wishList, user]);


  const addToCart = (product, size) => {
  setCart((prev) => {
    const existingItem = prev.find(
      (item) => item.id === product.id && item.selectedSize === size
    );

    if (existingItem) {
      return prev.map((item) =>
        item.id === product.id && item.selectedSize === size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      selectedSize:size,
      quantity:1,
    }
    
    return [...prev,cartItem];
  });
};



  const removeFromCart = (product) => {
    setCart((prev) =>
  prev.filter(
    (item) => !(item.id === product.id && item.selectedSize === product.selectedSize)
  )
);

  };

  const increaseQuantity=(productId,size) => {
  setCart((prev) =>
  prev.map((item) => item.id === productId && item.selectedSize === size ?
    {...item, quantity : item.quantity + 1} : item
  )
  );
};

const decreaseQuantity = (productId, size) => {
  setCart((prev) =>
    prev
      .map((item) =>
        item.id === productId && item.selectedSize === size
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0)
  );
};


  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToWishList = (productId) => {
  setWishList((prev) => {
    if (prev.includes(productId)) return prev;
    return [...prev, productId];
  });
};



  const removeFromWishList = (productId) => {
    setWishList((prev) => prev.filter((id) => id !== productId));
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
