import { FaShoppingCart } from "react-icons/fa";
import toast from "react-hot-toast";
import { Link } from 'react-router-dom'; // Import Link for navigation

const BookCard = ({ book, addToCart }) => {
  const handleAddToCart = () => {
    addToCart(book);
    toast.success(`${book.title} added to cart!`);
  };

  return (
    <div className="group border rounded-xl p-4 shadow-lg bg-white hover:shadow-2xl transition-all transform hover:scale-105 hover:bg-gray-50">
      {/* Image link to the Book's detail page */}
      <Link
        to={{ pathname: `/bookstore/book/${book._id}`, state: { from: 'bookstore' } }}  
      >
        <div className="relative overflow-hidden rounded-lg mb-4">
          <img
            src={book.imageUrl}
            alt={book.title}
            className="w-full h-48 object-cover rounded-lg group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.target.src = '/placeholder.jpg'; 
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-40"></div>
        </div>
      </Link>

      <h3 className="font-semibold text-xl text-gray-800 mb-2 group-hover:text-blue-500 transition-colors duration-300">{book.title}</h3>
      <p className="text-gray-600 text-sm mb-2">{book.author}</p>

      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`text-xl ${i < book.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
        ))}
      </div>

      {/* Price, stock, and add to cart section */}
      <div className="flex justify-between items-center mt-4">
        <div>
          <span className="font-bold text-green-600 text-lg">bdt{book.price}</span>
        </div>
        <div className="text-sm text-gray-500">
          <span className="block">Stock: {book.stock}</span>
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <button
          onClick={handleAddToCart}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 group-hover:scale-105"
        >
          <FaShoppingCart className="inline-block mr-2" /> Add to Cart
        </button>
      </div>
    </div>
  );
};

export default BookCard;
