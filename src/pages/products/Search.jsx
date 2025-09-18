import { useState, useContext, useEffect } from "react";
import { ProductContext } from "../../context/Context";
import { Link } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function Search({ onClose }) {
  const [search, setSearch] = useState("");
  const { products } = useContext(ProductContext);


  return (


    <div className="fixed inset-0 z-50 flex justify-center items-start bg-black/30 backdrop-blur-xs p-4">
  <div className="w-full max-w-6xl bg-white p-4 shadow-lg">
    
     <div className="absolute top-0 left-0 w-full bg-white p-4 shadow-lg z-50">
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="SEARCH HERE"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-2xl p-3 border-none focus:outline-none border-b"
        />
        <button
          type="button"
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon aria-hidden="true" className="size-6" />
        </button>
      </div>

      {search && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {products
            .filter((product) =>
              product.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((product) => (
              <div key={product.id} className="group">
                <div className="relative pt-[125%]">
                  <Link to={`/productdetails/${product.id}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover rounded-lg"
                    />
                  </Link>
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
      )}
    </div>


  </div>
</div>

   
  );
}
