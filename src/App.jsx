import { Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
import ProductProvider from "./context/ProductProvider";
import UserRoutes from "./Routes/UserRoutes";
import AdminRoutes from "./Routes/AdminRoutes";

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <Routes>

          {/* User side */}
          <Route path="/*" element={<UserRoutes/>} />

          {/* Admin side */}
          <Route path="/admin/*" element={<AdminRoutes/>} />
        </Routes>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
