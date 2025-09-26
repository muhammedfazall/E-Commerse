import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/Context";
import axios from "axios";
import { userApi } from "../../api";



export default function Orders() {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  
  const fetchUserOrders = async () => {
      try {
        const { data } = await axios.get(`${userApi}/${user.id}`);
        setUser(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setLoading(false);
      }
    };
  

   useEffect(() => {
  if (user) {
    const fetchUserOrders = async () => {
      try {
        const { data } = await axios.get(`${userApi}/${user.id}`);
        setUser(data); 
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchUserOrders();
  }
}, []);


  if (!user || !user.orders || user.orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center p-8">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <p className="text-xl font-medium text-gray-600 mb-2">No orders yet</p>
          <p className="text-gray-500">Your orders will appear here once you make a purchase.</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const statusColors = {
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'processing': 'bg-blue-100 text-blue-800 border-blue-200',
      'shipped': 'bg-purple-100 text-purple-800 border-purple-200',
      'delivered': 'bg-green-100 text-green-800 border-green-200',
      'cancelled': 'bg-red-100 text-red-800 border-red-200'
    };
    return statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">My Orders</h1>
          <p className="text-gray-600">View your order history and track shipments</p>

        </div>

        <div className="space-y-6">
          {user.orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 overflow-hidden"
            >
     
              <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      Order #<span className="font-mono">{order.id}</span>
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Placed on {new Date(order.date || Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>


              <div className="p-6">
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="relative">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg border-2 border-gray-100 shadow-sm"
                          />
                          {item.quantity>1 && <div className="absolute -top-2 -right-2 bg-gray-950 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                            {item.quantity}
                          </div>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{item.name}</p>
                          <p className="text-sm text-gray-600 mt-1">${item.price.toFixed(2)} x {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-900 ml-4">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Shipping Address</h3>
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        <p className="font-medium">{order.address.firstName} {order.address.lastName}</p>
                        <p>{order.address.address}</p>
                        <p>{order.address.city}, {order.address.state} {order.address.postalCode}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Order Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment Method:</span>
                          <span className="font-medium capitalize">{order.paymentMode}</span>
                        </div>
                        <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t border-gray-200">
                          <span>Total Amount:</span>
                          <span>${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}