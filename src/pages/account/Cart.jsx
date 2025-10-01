import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ProductContext } from "../../context/Context";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function Cart() {
  const {
    cart,
    isCartOpen,
    closeCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useContext(ProductContext);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const navigate = useNavigate()
  const handleCheckout=()=>{
    navigate('/checkout');
    closeCart();
  }

  return (
    <Dialog open={isCartOpen} onClose={closeCart} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-closed:opacity-0"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
            >
              <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
              
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                  <div className="flex items-start justify-between">
                    <DialogTitle className="text-lg font-medium text-gray-900">
                      Shopping cart
                    </DialogTitle>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        onClick={closeCart}
                        className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                      >
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon aria-hidden="true" className="cursor-pointer size-6" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-8">
                    {cart.length === 0 ? (
                      <p className="text-gray-500 text-center">
                        Your cart is empty
                      </p>
                    ) : (
                      <ul
                        role="list"
                        className="-my-6 divide-y divide-gray-200"
                      >
                        {cart.map((product) => (
                          <li key={`${product.id}-${product.selectedSize}`} className="flex py-6">
                          
                            <div className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="size-full object-cover"
                              />
                            </div>

                            <div className="ml-4 flex flex-1 flex-col">
                              <div>
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                  <h3>{product.name}</h3>
                                  <p className="ml-4">${product.price}</p>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">
                                  {product.category}
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                  Size: {product.selectedSize}
                                </p>

                              </div>
                              <div className="flex flex-1 items-end justify-between text-sm">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => decreaseQuantity(product.id,product.selectedSize)}
                                    disabled={product.quantity === 1}
                                    className="px-2 py-1 cursor-pointer border rounded"
                                  >
                                    -
                                  </button>
                                  <span>{product.quantity}</span>
                                  <button
                                    onClick={() => increaseQuantity(product.id,product.selectedSize)}
                                    className="px-2 py-1 cursor-pointer border rounded"
                                  >
                                    +
                                  </button>
                                </div>
                                <div className="flex">
                                  <button
                                    type="button"
                                    onClick={() => removeFromCart(product)}
                                    className="font-medium cursor-pointer text-black hover:text-red-500"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>total</p>
                    <p>${total.toFixed(2)}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">
                    Shipping and taxes calculated at checkout.
                  </p>
                  <div className="mt-6  cursor-pointer">
                    <div className="flex justify-center">
                    <button 
                    onClick={handleCheckout}
                    className="border border-transparent bg-black px-6 py-3 text-base font-medium text-white shadow-xs hover:bg-gray-700">Checkout</button>

                    </div>
                  </div>
                  <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                    <p>
                      or{" "}
                      <button
                        type="button"
                        onClick={closeCart}
                        className="font-medium cursor-pointer text-black hover:text-gray-700"
                      >
                        Continue Shopping →
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
