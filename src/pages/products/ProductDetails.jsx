import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { ProductContext, AuthContext } from "../../context/Context";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { showToast } from "../../lib/toast";

export default function ProductDetails() {
  const { products, addToCart, wishList, addToWishList, removeFromWishList } =
    useContext(ProductContext);
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      console.log("Products:", products);
      const found = products.find((p) => p.id === String(id));
      console.log("Found product:", found);
      setProduct(found || null);
    }
  }, [id, products]);

  const handleAddToCart = () => {
    if (!user) {
      showToast.error("User not Logged in");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    if (!selectedSize) {
    showToast.error("Please select a size before adding to cart");
    return;
  }

  const itemToAdd = {
    ...product,
    sizes:product.sizes.filter((s)=>s.name === selectedSize),
    selectedSize,
    quantity:1
  }

  addToCart(itemToAdd, selectedSize);
  showToast.success("Added to Cart")
  };

  const isInWishList = product ? wishList.includes(product.id) : false;

  const handleWishList = () => {
  if (!user) {
    showToast.error("User not Logged in");
    navigate("/login", { state: { from: location.pathname } });
  } else {
    isInWishList
      ? removeFromWishList(product.id)
      : addToWishList(product.id);
  }
};


  return (
    <div className="pt-40" >
      {product ? (
        <div>
          <div className="mx-auto max-w-2xl px-4 pt-10 pb-16 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto_auto_1fr] lg:gap-x-8 lg:px-8 lg:pt-16 lg:pb-24">
            <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
              <div className="flex gap-4">
                <img className="w-85" src={product.image} alt={product.name} />
                <img className="w-85" src={product.image2} alt={product.name} />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {product.name}
              </h1>
            </div>

            <div className="mt-4 lg:row-span-3 lg:mt-0">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-gray-900">{`$${product.price}`}</p>

              <div className="mt-10">
                <div className="mt-10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">Size</h3>
                    <Link className="text-sm font-medium text-black hover:text-gray-700">
                      Size guide
                    </Link>
                  </div>

                  <fieldset aria-label="Choose a size" className="mt-4">
                    <div className="grid grid-cols-4 gap-3">
                      {product.sizes.map((size) => (
                        <label
                          key={size.name}
                          aria-label={size.name}
                          className={`group relative flex items-center justify-center p-3 border-3 
          ${
            selectedSize === size.name
              ? "border-gray-600 bg-black"
              : "border-gray-300 bg-white"
          }
          ${
            !size.inStock ? "opacity-50" : "cursor-pointer  hover:border-b-black" 
          }`}
                        >
                          <input
                            value={size.name}
                            checked={selectedSize === size.name}
                            onChange={(e) => setSelectedSize(e.target.value)}
                            name="size"
                            type="radio"
                            disabled={!size.inStock}
                            className="absolute inset-0 appearance-none focus:outline-none cursor-pointer disabled:cursor-not-allowed"
                          />
                          <span
                            className={`text-sm font-medium uppercase ${
                              selectedSize === size.name
                                ? "text-white"
                                : "text-gray-900"
                            }`}
                          >
                            {size.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </div>
                <div className="flex justify-between">
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedSize}
                  className={`mt-4 px-4 py-3 border-3 ${
                    !selectedSize ? "bg-gray-300 text-white border-gray-100 cursor-not-allowed" : "bg-black text-white cursor-pointer border-gray-600"
                  }`}
                  >
                  Add to Cart
                </button>

                <button onClick={handleWishList} className="ml-4 mt-4 cursor-pointer">
                  {isInWishList ? (
                    <HeartSolid className="h-10 w-10 text-red-500" />
                  ) : (
                    <HeartOutline className="h-10 w-10 text-gray-400 hover:text-red-500" />
                  )}
                </button>
                  </div>
              </div>
            </div>

            <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pt-6 lg:pr-8 lg:pb-16">
              <div>
                <h3 className="sr-only">Description</h3>

                <div className="space-y-6">
                  <p className="text-base text-gray-900">
                    {product.description}
                  </p>
                </div>
              </div>

              <div className="mt-10">
                <h2 className="text-sm font-medium text-gray-900">Details</h2>

                <div className="mt-4 space-y-6">
                  <p className="text-sm text-gray-600">{product.details}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Not Found!</p>
      )}
    </div>
  );
}
