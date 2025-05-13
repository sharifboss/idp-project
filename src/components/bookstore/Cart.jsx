import { useNavigate } from "react-router-dom"; // Import useNavigate
import toast from "react-hot-toast"; // Import toast for notifications

const Cart = ({ cart, updateCart, total }) => {
  const navigate = useNavigate(); // Initialize useNavigate hook for routing

  const handleRemoveItem = (id) => {
    updateCart(id, 0);  // Remove item by setting quantity to 0
    toast.error("Item removed from cart");
  };

  const handleCartClick = () => {
    // Navigate to checkout page
    navigate("/checkout");
  };

  return (
    <div className="bg-white p-4 rounded shadow h-fit sticky top-4">
      <h3 className="text-xl font-bold mb-4">Shopping Cart ({Object.keys(cart).length})</h3>
      {Object.entries(cart).map(([id, item]) => (
        <div key={id} className="flex justify-between items-center mb-3 pb-2 border-b">
          <div className="w-2/3">
            <p className="font-medium">{item.book.title}</p>
            <p className="text-sm text-gray-600">${item.book.price} x {item.quantity}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => updateCart(id, item.quantity - 1)} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">-</button>
            <span>{item.quantity}</span>
            <button onClick={() => updateCart(id, item.quantity + 1)} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">+</button>
            <button onClick={() => handleRemoveItem(id)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
              Remove
            </button>
          </div>
        </div>
      ))}
      <div className="mt-4 pt-2 border-t">
        <div className="flex justify-between font-bold">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      
        <button 
          className="w-full mt-4 bg-green-500 text-white py-2 rounded hover:bg-green-600"
          onClick={handleCartClick} // Call handleCartClick on button click
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
