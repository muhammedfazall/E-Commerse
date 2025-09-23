import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { userApi } from "../../api";
import { ProductContext, AuthContext } from "../../context/Context";

export default function Checkout() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    contact: "",
    city: "",
    postalCode: "",
    paymentMode: "",
  });

  
  const { cart } = useContext(ProductContext);
  const { user, setUser } = useContext(AuthContext);
  
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const shipping = 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newOrder = {
      id: Date.now(),
      items: cart,
      address: formData,
      paymentMode:formData.paymentMode,
      total,
      status: "Processing",
    };

    const updatedUser = {
  ...user,
  shipmentAddress: formData,
  orders: [...(user.orders || []), newOrder],  // keep old orders + new one
  cart: [], // clear cart
};


    try {
    await axios.patch(`${userApi}/${user.id}`, updatedUser);
    setUser(updatedUser);
    console.log("Order placed successfully:", newOrder);

    // Show confirmation popup
    setShowConfirmation(true);
  } catch (error) {
    console.log("Error Saving Shipment address", error);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Right Column - Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 h-fit">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b pb-4"
                >
                  <div className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="size-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium text-gray-800">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-800">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-800">${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-800">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t pt-2 mt-2">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Your order will be processed securely. All transactions are
                encrypted and secure.
              </p>
            </div>
          </div>

          {/* Left Column - Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Shipping Information
            </h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="contact"
                  placeholder="0000000000"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required // allows only 10 digits
                  maxLength="10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shipping Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    maxLength="6"
                  />
                </div>
              </div>

              <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-6">
                Payment Options
              </h2>

              <div className="flex justify-around">
                <div>
                  <label>Card Payment</label>&nbsp;&nbsp;
                  <input
                    type="radio"
                    name="paymentMode"
                    value="Card Payment"
                    checked={formData.paymentMode === "Card Payment"}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label>UPI</label>&nbsp;&nbsp;
                  <input
                    type="radio"
                    name="paymentMode"
                    value="UPI"
                    checked={formData.paymentMode === "UPI"}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label>Cash on Delivery</label>&nbsp;&nbsp;
                  <input
                    type="radio"
                    name="paymentMode"
                    value="Cash on Delivery"
                    checked={formData.paymentMode === "Cash on Delivery"}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
              >
                Complete Purchase
              </button>
            </form>
            {showConfirmation && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
      <h2 className="text-2xl font-bold text-green-600 mb-4">
        Order Confirmed!
      </h2>
      <p className="text-gray-700 mb-6">
        Thank you for your purchase. Your order has been placed successfully.
      </p>
      <div className="flex justify-around gap-4">
        <button
          onClick={() => navigate("/orders")}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Go to My Orders
        </button>
        <button
          onClick={() => navigate("/")}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
        >
          Go to Home
        </button>
      </div>
    </div>
  </div>
)}

          </div>
        </div>
      </div>
    </div>
  );
}
