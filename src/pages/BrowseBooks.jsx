import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';
import Filters from '../components/bookstore/Filters';
import Footer from '../components/Footer';

const BrowseBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({});
  const [genres, setGenres] = useState([]); // New state for genres

  // Fetch genres when component mounts
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await api.get('/api/books/genres');
        setGenres(response.data);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const query = new URLSearchParams(filters).toString();
        const response = await api.get(`/api/books?page=${currentPage}&limit=6&${query}`);
        if (Array.isArray(response.data.books)) {
          setBooks(response.data.books);
          setTotalPages(response.data.totalPages);
        } else {
          setError('Data format is incorrect');
        }
      } catch (error) {
        setError('Error fetching books');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [currentPage, filters]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-8 text-xl text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Section */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-lg">
          <Filters onFilter={setFilters} genres={genres} />
        </div>

        {/* Book List Section */}
        <div className="lg:col-span-3">
          <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">Browse Books</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {books.length > 0 ? (
              books.map((book) => (
                <div
                  key={book._id}
                  className="bg-white p-6 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl flex flex-col relative" // Added 'relative' for positioning
                >
                  {/* Genre Badge - Top Right Corner */}
                  <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {book.genre}
                  </div>

                  <Link to={{ pathname: `/book/${book._id}`, state: { from: 'browse' } }}>
                    <img
                      src={book.imageUrl}
                      alt={book.title}
                      className="w-full h-80 object-cover rounded-lg mb-4"
                      onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                    />
                    <h3 className="font-semibold text-xl text-gray-800 hover:text-blue-500 transition duration-300">{book.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{book.author}</p>
                    <p className="text-sm font-semibold text-gray-800 mt-1">${book.price}</p> {/* Added price display */}

                    <div className="mt-2">
                      <span className="font-semibold text-yellow-500">
                        {'★'.repeat(Math.floor(book.averageRating))}{'☆'.repeat(5 - Math.floor(book.averageRating))}
                      </span>
                      <span className="text-sm text-gray-500"> ({book.averageRating}/5)</span>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-center text-lg text-gray-600">No books available</div>
            )}
          </div>
        </div>
      </div>

      {/* Pagination Section */}
      <div className="container mx-auto px-4 mt-6 flex justify-center items-center pb-5">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Prev
          </button>
          <span className="text-lg font-semibold">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BrowseBooks;