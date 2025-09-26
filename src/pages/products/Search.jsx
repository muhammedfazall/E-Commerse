import { useState, useContext, useEffect } from "react";
import { ProductContext } from "../../context/Context";
import { Link } from "react-router-dom";
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function Search({ onClose }) {
  const [search, setSearch] = useState("");
  const { products } = useContext(ProductContext);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleEscape = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-white">
      {/* Ultra-compact Header */}
      <div className="px-3 py-2 border-b">
        <div className="flex items-center gap-2">
          <MagnifyingGlassIcon className="size-10 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-3xl h-20 p-1 border-none focus:outline-none"
            autoFocus
          />
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="size-10" />
          </button>
        </div>
      </div>

      {/* Ultra-compact Content */}
      <div className="h-[calc(100vh-48px)] overflow-y-auto p-3">
        

        {filteredProducts.length > 0 && (
          <>
            <div className="text-m text-gray-500 mb-3">
              {filteredProducts.length} results
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/productdetails/${product.id}`}
                  onClick={onClose}
                  className="block group"
                >
                  <div className="aspect-square mb-1">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover rounded group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="font-medium text-xs line-clamp-2">{product.name}</div>
                  <div className="text-gray-600 text-xs">${product.price}</div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}