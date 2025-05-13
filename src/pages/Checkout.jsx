import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const stripePromise = loadStripe('pk_test_51RNeaNRbbVwaxPdBttNqLG0saUyzwjp3PVvhMatxyWjfiDKQv8lcqUnFnsKKR0ImBnJE8MrpqmuMLDRdqyiAdCaZ00HJz6vNwj');

const CheckoutForm = ({ cart, total, billingDetails, clearCart }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      setProcessing(false);
      return;
    }

    try {
      // 1. Create payment intent
      const { data: { clientSecret } } = await api.post('/api/orders/create-payment-intent', {
        items: Object.values(cart).map(item => ({
          bookId: item.book._id,
          quantity: item.quantity
        }))
      });

      // 2. Confirm payment
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: billingDetails.fullName,
            email: billingDetails.email,
            address: {
              line1: billingDetails.address,
              city: billingDetails.city,
              postal_code: billingDetails.zipCode,
              country: billingDetails.country
            }
          }
        }
      });

      if (error) {
        toast.error(error.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // 3. Create order
        await api.post('/api/orders', {
          items: Object.values(cart).map(item => ({
            bookId: item.book._id,
            quantity: item.quantity
          })),
          totalAmount: total,
          paymentId: paymentIntent.id,
          shippingAddress: {
            address: billingDetails.address,
            city: billingDetails.city,
            postalCode: billingDetails.zipCode,
            country: billingDetails.country
          }
        });

        // Clear cart and show success
        clearCart();
        toast.success('Payment successful!');
        navigate('/order-confirmation');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Payment failed');
      console.error('Checkout error:', err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Payment Details</h3>
      <CardElement 
        className="p-4 border rounded mb-4" 
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }}
      />
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
      >
        {processing ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          `Pay $${total.toFixed(2)}`
        )}
      </button>
    </form>
  );
};

const Checkout = () => {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [billingDetails, setBillingDetails] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    country: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingDetails(prev => ({ ...prev, [name]: value }));
  };

  if (Object.keys(cart).length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto p-6 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-md">
            <h3 className="text-xl font-bold mb-4">Your cart is empty</h3>
            <p className="mb-4">There are no items in your cart to checkout</p>
            <button
              onClick={() => navigate('/bookstore')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Continue Shopping
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-semibold mb-4">Billing Information</h3>
              <form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name*</label>
                    <input
                      type="text"
                      name="fullName"
                      value={billingDetails.fullName}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email*</label>
                    <input
                      type="email"
                      name="email"
                      value={billingDetails.email}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Address*</label>
                  <input
                    type="text"
                    name="address"
                    value={billingDetails.address}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">City*</label>
                    <input
                      type="text"
                      name="city"
                      value={billingDetails.city}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Zip Code*</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={billingDetails.zipCode}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Country*</label>
                  <input
                    type="text"
                    name="country"
                    value={billingDetails.country}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
              {Object.values(cart).map(item => (
                <div key={item.book._id} className="flex justify-between items-center mb-4 pb-4 border-b">
                  <div className="flex items-center">
                    <img 
                      src={item.book.imageUrl} 
                      alt={item.book.title}
                      className="w-16 h-16 object-cover rounded mr-4"
                    />
                    <div>
                      <h4 className="font-medium">{item.book.title}</h4>
                      <p className="text-sm text-gray-600">${item.book.price.toFixed(2)} × {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-medium">${(item.book.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Elements stripe={stripePromise}>
              <CheckoutForm 
                cart={cart} 
                total={total} 
                billingDetails={billingDetails}
                clearCart={clearCart}
              />
            </Elements>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;