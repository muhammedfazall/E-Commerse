import { useContext } from "react";
import { AuthContext } from "../../context/Context";

export default function Orders() {
  const { user } = useContext(AuthContext);

  if (!user || !user.orders || user.orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">You have no orders yet.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        <div className="space-y-6">
          {user.orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
            >
              <div className="flex justify-between items-center border-b pb-4 mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Order #{order.id}
                </h2>
                <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-700">
                  {order.status}
                </span>
              </div>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md border"
                      />
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium text-gray-800">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t mt-4 pt-4 text-right">
                <p className="text-lg font-semibold">
                  Total: ${order.total.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Payment: {order.paymentMode}
                </p>
                <p className="text-sm text-gray-600">
                  Shipping to: {order.address.firstName} {order.address.lastName},{" "}
                  {order.address.address}, {order.address.city} -{" "}
                  {order.address.postalCode}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
