import { ProductContext } from "../../context/Context";
import { useContext } from "react";
import { Link } from "react-router-dom";

export default function WishList() {
  const { wishList, removeFromWishList, addToCart, products } =
    useContext(ProductContext);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>

      {wishList.length === 0 ? (
        <p className="text-gray-600">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishList.map((productId) => {
            const product = products.find((p) => p.id === productId);
            if (!product) return null; // Product not loaded yet

            return (
              <div
                key={product.id}
                className="border rounded-lg shadow-sm p-4 relative group"
              >
                <Link to={`/productdetails/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded"
                  />
                </Link>

                <div className="mt-3">
                  <h2 className="font-semibold text-lg">{product.name}</h2>
                  <p className="text-gray-500 text-sm">{product.category}</p>
                  <p className="text-gray-500 font-bold">${product.price}</p>
                </div>

                <div className="flex gap-2 mt-3">
                  
                  <button
                    onClick={() => removeFromWishList(product.id)}
                    className="flex-1 px-3 py-1 bg-black text-white text-sm rounded hover:bg-gray-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
