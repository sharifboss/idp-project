import { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import api from '../../api';
import Footer from '../Footer';
import Navbar from '../Navbar';

const BookDetail = () => {
    const { id } = useParams();  // Get book ID from URL
    const [book, setBook] = useState(null);
    const [relatedBooks, setRelatedBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const fromBookstore = location.state?.from === 'bookstore'; // Determine if it's from the bookstore

    useEffect(() => {
        const fetchBookAndRelated = async () => {
            try {
                // Fetch main book details
                const bookRes = await api.get(`/api/books/${id}`);
                setBook(bookRes.data);

                // Fetch all books to find related ones
                const allBooksRes = await api.get('/api/books');
                console.log("allBooksRes:", allBooksRes);  // Log the response to check the structure

                // Check if allBooksRes.data.books is an array
                if (allBooksRes.data && Array.isArray(allBooksRes.data.books)) {
                    // Filter related books (same genre, exclude current book)
                    const related = allBooksRes.data.books.filter(b =>
                        b.genre.toLowerCase() === bookRes.data.genre.toLowerCase() &&
                        b._id !== id
                    );

                    // Limit to 3-4 related books
                    setRelatedBooks(related.slice(0, 4));
                } else {
                    console.error("Error: allBooksRes.data.books is not an array", allBooksRes);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookAndRelated();
    }, [id]);

    if (loading) {
        return <div className="text-center mt-8">Loading book details...</div>;
    }

    // Add error handling for missing book
    if (!book) {
        return <div className="text-center mt-8">Book not found</div>;
    }

    // Helper function to ensure absolute URLs
    const getImageUrl = (url) => {
        if (url.startsWith('http')) return url;
        return `http://localhost:5000${url}`;
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="container mx-auto p-4">
                {/* Book details section */}
                <div className="flex flex-col md:flex-row gap-6 mb-12">
                    <div className="w-full md:w-1/3">
                        <img
                            src={getImageUrl(book.imageUrl)}
                            alt={book.title}
                            className="w-full h-64 object-contain mb-4 rounded-lg shadow-lg"
                            onError={(e) => {
                                e.target.src = '/placeholder-book.jpg'; // Add fallback image
                            }}
                        />
                    </div>

                    <div className="w-full md:w-2/3">
                        <h1 className="text-4xl font-bold mb-2">{book.title}</h1>
                        <p className="text-xl text-gray-600 mb-4">by {book.author}</p>

                        <div className="bg-gray-100 p-4 rounded-lg mb-4">
                            <p className="text-2xl font-bold text-green-600 mb-2">${book.price}</p>
                            <p className={`text-sm ${book.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {book.stock > 0 ? 'In Stock' : 'Out of Stock'}
                            </p>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-xl font-semibold mb-2">About this book</h3>
                            <p className="text-gray-700 leading-relaxed">{book.description}</p>
                        </div>

                        <button
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                            disabled={book.stock <= 0}
                        >
                            {book.stock > 0 ? 'Add to Cart' : 'Notify When Available'}
                        </button>
                    </div>
                </div>

                {/* Related books section */}
                {relatedBooks.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-3xl font-bold mb-6">More {book.genre} Books</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedBooks.map((relatedBook) => (
                                <div
                                    key={relatedBook._id}
                                    className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                                >
                                    <Link to={{ pathname: `/book/${relatedBook._id}`, state: { from: fromBookstore ? 'bookstore' : 'browse' } }} className="block">
                                        <img
                                            src={getImageUrl(relatedBook.imageUrl)}
                                            alt={relatedBook.title}
                                            className="w-full h-48 object-contain mb-4 rounded-lg"
                                        />
                                        <h3 className="font-bold text-lg mb-1">{relatedBook.title}</h3>
                                        <p className="text-gray-600 text-sm mb-2">{relatedBook.author}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-green-600">${relatedBook.price}</span>
                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                {relatedBook.genre}
                                            </span>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default BookDetail;
