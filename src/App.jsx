import { Routes, Route } from "react-router-dom";
import Register from "./pages/account/register";
import Login from "./pages/account/login";
import Home from "./pages/homepage/Home";
import Header from "./pages/homepage/Header";
import Collections from "./pages/products/Collections";
import AuthProvider from "./context/AuthProvider";
import ProductProvider from "./context/ProductProvider";
import ProductDetails from "./pages/products/ProductDetails";
import Cart from "./pages/account/Cart";
import WishList from "./pages/account/WishList";
import Account from "./pages/account/Account";
import Search from "./pages/products/Search";
import Checkout from "./pages/account/Checkout";

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <Header />
        <Cart />
        <Account />
        <Routes>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/" element={<Home />}></Route>
          <Route path="/productdetails/:id" element={<ProductDetails />}></Route>
          <Route path="/collections" element={<Collections />}></Route>
          <Route path="/wishlist" element={<WishList />} />
          <Route path="/search" element={<Search/>}></Route>
          <Route path="/checkout" element={<Checkout/>}></Route>
        </Routes>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
