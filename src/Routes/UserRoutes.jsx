import { Routes, Route } from "react-router-dom";
import Header from "../pages/homepage/Header";
import Cart from "../pages/account/Cart";
import Account from "../pages/account/Account";

import Home from "../pages/homepage/Home";
import Register from "../pages/account/register";
import Login from "../pages/account/login";
import Collections from "../pages/products/Collections";
import ProductDetails from "../pages/products/ProductDetails";
import WishList from "../pages/account/WishList";
import Search from "../pages/products/Search";
import Checkout from "../pages/account/Checkout";
import Orders from "../pages/account/Orders";

export default function UserRoutes() {
  return (
    <>
      <Header />
      <Cart />
      <Account />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/productdetails/:id" element={<ProductDetails />} />
        <Route path="/wishlist" element={<WishList />} />
        <Route path="/search" element={<Search />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </>
  );
}
