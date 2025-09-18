import { useContext,useEffect } from "react";
import { ProductContext } from "../../context/Context";
import { Link } from "react-router-dom";
import Header from "../homepage/Header";

export default function Collections() {
  const { products } = useContext(ProductContext);

   useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {products.map((product) => (
            <div key={product.id} className="group">
              <div className="relative pt-[125%]">
                <Link to={`/productdetails/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="absolute inset-0 h-full w-full object-cover transition-opacity duration-100 hover:opacity-0"
                  />
                  <img
                    src={product.image2}
                    alt={product.name}
                    className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-100 hover:opacity-100"
                  />
                </Link>

                {product.bestseller && (
                  <div className="absolute top-2 left-2 bg-white px-2 py-1 text-red-400 text-sm font-medium">
                    Best Seller
                  </div>
                )}
              </div>

              <div className="mt-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-gray-600">{product.category}</div>
                  </div>
                  <div className="text-right font-medium">${product.price}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
