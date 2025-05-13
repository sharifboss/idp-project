import React, { useEffect, useState } from 'react';
import api from '../api';  // Import API for data fetching
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast'; 

const TrendingBooks = () => {
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingBooks = async () => {
      try {
        const response = await api.get('/api/books');
        
        // Assuming the first 4 books are trending (or any condition you'd like to apply to "trending")
        setTrendingBooks(response.data.books.slice(0, 4)); // Limit to 4 books only
      } catch (error) {
        setError('Error fetching books');
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingBooks();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div> {/* Simple loading animation */}
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
    <section className="px-8 py-6">
      <h2 className="text-xl font-semibold mb-4">Trending Books</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {trendingBooks.length > 0 ? (
          trendingBooks.map((book) => (
            <div key={book._id} className="bg-white p-4 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl flex flex-col">
              <Link to={{ pathname: `/book/${book._id}`, state: { from: 'browse' } }}>
                <img
                  src={book.imageUrl}
                  alt={book.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                  onError={(e) => { e.target.src = '/placeholder.jpg'; }} // Fallback image
                />
                <h3 className="font-semibold text-xl text-gray-800 hover:text-blue-500 transition duration-300">{book.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{book.author}</p>

                {/* Average Rating */}
                <div className="mt-2">
                  <span className="font-semibold text-yellow-500">
                    {'★'.repeat(book.averageRating)}{'☆'.repeat(5 - book.averageRating)}
                  </span>
                  <span className="text-sm text-gray-500">({book.averageRating}/5)</span>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <div className="text-center text-lg text-gray-600">No books available</div>
        )}
      </div>
    </section>
  );
};

export default TrendingBooks;
