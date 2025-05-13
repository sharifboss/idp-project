import { useState, useEffect } from 'react';
import BookCard from '../components/bookstore/BookCard';
import Filters from '../components/bookstore/Filters';
import Cart from '../components/bookstore/Cart';
import api from '../api';
import Pagination from '../components/bookstore/Pagination';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

const Bookstore = () => {
  const [books, setBooks] = useState([]);
  const { cart, addToCart, updateCart } = useCart();
  const [filters, setFilters] = useState({}); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1); 
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        // Create query parameters
        const query = new URLSearchParams(filters).toString();
        const response = await api.get(`/api/books?page=${currentPage}&${query}`);
        setBooks(response.data.books);
        setTotalPages(response.data.totalPages); 
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [currentPage, filters]);

  const total = Object.values(cart).reduce(
    (sum, item) => sum + item.book.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Section */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-lg">
          <Filters onFilter={setFilters} />
        </div>

        {/* Book List Section */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-3 text-center text-gray-600">Loading books...</div>
            ) : (
              books.map((book) => (
                <BookCard key={book._id} book={book} addToCart={addToCart} />
              ))
            )}
          </div>
        </div>

        {/* Cart Section */}
        <div className="lg:col-span-1">
          <Cart cart={cart} updateCart={updateCart} total={total} />
        </div>
      </div>

      {/* Pagination Component */}
      <div className="container mx-auto px-4 mt-6">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <Footer />
    </div>
  );
};

export default Bookstore;
