import { useEffect, useState } from 'react';
import api from '../api'; 
import BookForm from '../components/Admin/BookForm';
import Dashboard from '../components/Admin/Dashboard';
import Navbar from '../components/Navbar';

const Admin = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  // Fetch books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get('/api/admin/books');
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };
    fetchBooks();
  }, []);

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/admin/books/${id}`);
      setBooks(books.filter(book => book._id !== id));
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />

      <div className="container mx-auto p-6">
        {/* Admin Stats Dashboard */}
        <Dashboard />

        <div className="my-8">
          <h2 className="text-3xl font-bold text-center mb-8">Book Management</h2>

          {/* Book Management Form */}
          <BookForm
            selectedBook={selectedBook}
            setSelectedBook={setSelectedBook}
            setBooks={setBooks}
          />

          {/* Display List of Books */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Books List</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map(book => (
                <div key={book._id} className="border rounded-lg shadow-lg bg-white p-6 hover:shadow-2xl transition-all">
                  <div className="h-56 mb-4">
                    <img
                      src={book.imageUrl}
                      alt={book.title}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = '/placeholder.jpg'; // Fallback image
                      }}
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{book.title}</h3>
                  <p className="text-gray-600 mb-2">{book.author}</p>
                  <p className="text-green-600 text-lg font-bold">${book.price}</p>
                  <p className={`text-sm ${book.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {book.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </p>

                  <div className="mt-4 flex justify-between gap-2">
                    <button
                      onClick={() => setSelectedBook(book)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(book._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
