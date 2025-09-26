import { Toaster } from 'sonner';
import AuthProvider from "./context/AuthProvider";
import ProductProvider from "./context/ProductProvider";
import MainRoutes from "./Routes/MainRoutes";

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <MainRoutes/>
        <Toaster position="top-center" richColors closeButton />
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
