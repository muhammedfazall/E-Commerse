import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { ProductContext, AuthContext } from "../../context/Context";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

export default function ProductDetails() {
  const [product, setProduct] = useState(null);
  const { id } = useParams();
  const { products, addToCart, wishList, addToWishList, removeFromWishList } =
    useContext(ProductContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
  window.scrollTo(0, 0);
}, []);

  useEffect(() => {
    if (products.length > 0) {
      const found = products.find((p) => p.id === Number(id));
      setProduct(found || null);
    }
  }, [id, products]);

  const handleAddToCart = () => {
    if (!user) {
      alert("User not Logged in");
      navigate("/login", { state: { from: location.pathname } });
    } else {
      addToCart(product);
      alert('Added to Cart!')
    }
  };

  const isInWishList = product
    ? wishList.some((item) => item.id === product.id)
    : false;

  const handleWishList = () => {
    if (!user) {
      alert("User not Logged in");
      navigate("/login", { state: { from: location.pathname } });
    } else {
      isInWishList ? removeFromWishList(product) : addToWishList(product);
    }
  };

  return (
    <div>
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
                    <a
                      href="#"
                      className="text-sm font-medium text-black hover:text-gray-700"
                    >
                      Size guide
                    </a>
                  </div>

                  <fieldset aria-label="Choose a size" className="mt-4">
                    <div className="grid grid-cols-4 gap-3">
                      {product.sizes.map((size) => (
                        <label
                          key={size.id}
                          aria-label={size.name}
                          className="group relative flex items-center justify-center rounded-md border border-gray-300 bg-white p-3 has-checked:border-gray-600 has-checked:bg-gray-600 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-gray-600 has-disabled:border-gray-400 has-disabled:bg-gray-200 has-disabled:opacity-25"
                        >
                          <input
                            defaultValue={size.id}
                            defaultChecked={size === product.sizes[2]}
                            name="size"
                            type="radio"
                            disabled={!size.inStock}
                            className="absolute inset-0 appearance-none focus:outline-none disabled:cursor-not-allowed"
                          />
                          <span className="text-sm font-medium text-gray-900 uppercase group-has-checked:text-white">
                            {size.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                >
                  Add to Cart
                </button>
                <button onClick={handleWishList} className="ml-4">
                  {isInWishList ? (
                    <HeartSolid className="h-8 w-8 text-red-500" />
                  ) : (
                    <HeartOutline className="h-8 w-8 text-gray-400 hover:text-red-500" />
                  )}
                </button>
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
