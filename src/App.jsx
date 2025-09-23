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
import Orders from "./pages/account/Orders";
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import Users from "./admin/Users"
import AllOrders from "./admin/AllOrders";
import Products from "./admin/Products";


function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <Header />
        <Cart />
        <Account />
        <Routes>
  {/* Public pages */}
  <Route path="/" element={<Home />} />
  <Route path="/register" element={<Register />} />
  <Route path="/login" element={<Login />} />
  <Route path="/productdetails/:id" element={<ProductDetails />} />
  <Route path="/collections" element={<Collections />} />
  <Route path="/wishlist" element={<WishList />} />
  <Route path="/search" element={<Search />} />
  <Route path="/checkout" element={<Checkout />} />
  <Route path="/orders" element={<Orders />} />

  {/* Admin pages */}
  <Route path="/admin" element={<AdminLayout />}>
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="users" element={<Users />} />
    <Route path="products" element={<Products />} />
    <Route path="orders" element={<AllOrders />} />
  </Route>
</Routes>

      </ProductProvider>
    </AuthProvider>
  );
}

export default App;

function UserRoutes(){
  return
}