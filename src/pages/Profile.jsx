import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/firebase';
import api from '../api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { format } from 'date-fns';

const ProfilePage = () => {
  const [user] = useAuthState(auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      const fetchOrders = async () => {
        try {
          setLoading(true);
          const response = await api.get('/api/orders');
          setOrders(response.data);
          setError(null);
        } catch (err) {
          console.error('Error fetching orders:', err);
          setError('Failed to load orders. Please try again later.');
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    }
  }, [user]);

  if (!user) return <div>Please sign in to view your profile</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full" />
                ) : (
                  <span className="text-2xl">{user.displayName?.charAt(0) || user.email?.charAt(0)}</span>
                )}
              </div>
              <div>
                <h2 className="font-bold">{user.displayName || 'User'}</h2>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>

            <nav>
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left p-2 rounded ${activeTab === 'profile' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left p-2 rounded ${activeTab === 'orders' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                Order History
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-grow">
            {activeTab === 'profile' && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6">Profile Information</h1>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="mt-1">{user.displayName || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1">{user.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email Verified</label>
                    <p className="mt-1">
                      {user.emailVerified ? (
                        <span className="text-green-600">Verified</span>
                      ) : (
                        <span className="text-red-600">Not verified</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6">Order History</h1>
                {error ? (
                  <div className="text-red-500 mb-4">{error}</div>
                ) : loading ? (
                  <p>Loading orders...</p>
                ) : orders.length === 0 ? (
                  <p>You haven't placed any orders yet.</p>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order._id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold">Order #{order._id.slice(-6).toUpperCase()}</h3>
                            <p className="text-sm text-gray-600">
                              {format(new Date(order.createdAt), 'MMMM d, yyyy h:mm a')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">${order.totalAmount?.toFixed(2)}</p>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              order.status === 'paid' ? 'bg-green-100 text-green-800' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4">
                          {order.items?.map((item, index) => {
                            // Create a unique key for each item
                            const itemKey = item.book?._id 
                              ? `${order._id}-${item.book._id}-${index}` 
                              : `${order._id}-${index}`;
                            
                            return (
                              <div key={itemKey} className="flex items-center gap-4 py-2 border-b">
                                <div className="w-16 h-16 flex-shrink-0">
                                  {item.book?.imageUrl ? (
                                    <img 
                                      src={item.book.imageUrl} 
                                      alt={item.book.title || 'Book'} 
                                      className="w-full h-full object-cover rounded"
                                      onError={(e) => {
                                        e.target.src = '/placeholder-book.jpg';
                                        e.target.onerror = null; // Prevent infinite loop
                                      }}
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                                      <span className="text-xs text-gray-500">No image</span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex-grow">
                                  <h4 className="font-medium">
                                    {item.book?.title || 'Unknown Book'}
                                  </h4>
                                  {item.book?.author && (
                                    <p className="text-sm text-gray-600">by {item.book.author}</p>
                                  )}
                                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                </div>
                                <div className="text-right">
                                  <p>${((item.book?.price || 0) * item.quantity).toFixed(2)}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;