import { useContext,useState } from "react";
import { ProductContext } from "../../context/Context";

export default function Checkout() {

const { cart,
    removeFromCart, } = useContext(ProductContext);

const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);


  return (
    <div>
      <section>
        <div className="w-96">
 {cart.map((product) => (
                          <li key={product.id} className="flex py-6">
                          
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
                              </div>
                              <div className="flex flex-1 items-end justify-between text-sm">
                               
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
<div className="flex justify-between text-base font-medium text-gray-900">
                    <p>total</p>
                    <p className="text-4xl">${total.toFixed(2)}</p>
                  </div>

        </div>
      </section>

      <section>
        <h2 className="font-bold">Shipping Address</h2>
        <form >
          <input className="border" placeholder="Full Name" /><br/>
          <input className="border" placeholder="Phone" /><br/>
          <input className="border" placeholder="Street Address" /><br/>
          <input className="border" placeholder="City" /><br/>
          <input className="border" placeholder="Zip Code" /><br/>
          <input className="border" placeholder="Country" /><br/>
        </form>
      </section>


      <section>
        <h2>Payment Method</h2>
        <label><input type="radio" value="COD" /> Cash on Delivery</label>
        <label><input type="radio" value="Card" /> Credit / Debit Card</label>
      </section>

      <button className="border">Place Order</button>
    </div>
  )
}
