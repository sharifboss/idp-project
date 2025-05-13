import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Loading from '../Loading';
import Navbar from '../Navbar';
import Footer from '../Footer';
import toast from 'react-hot-toast';
import RateBook from './RateBook';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const BookDetailForBrowse = () => {
    const [authChecked, setAuthChecked] = useState(false);
    const [statusLoading, setStatusLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const { id: bookId } = useParams();
    const [book, setBook] = useState(null);
    const [status, setStatus] = useState({
        shelf: 'want_to_read',
        progress: 0,
        dateStarted: null,
        dateFinished: null,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setAuthChecked(true);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const bookRes = await api.get(`/api/books/${bookId}`);
                setBook(bookRes.data);
                setLoading(false);
            } catch (err) {
                toast.error(err.response?.data?.error || 'Failed to load details');
                setLoading(false);
            }
        };

        const fetchStatus = async () => {
            try {
                const statusRes = await api.get(`/api/status/${bookId}`);
                if (statusRes.data) {
                    setStatus({
                        shelf: statusRes.data.status || 'want_to_read',
                        progress: statusRes.data.progress || 0,
                        dateStarted: statusRes.data.dateStarted,
                        dateFinished: statusRes.data.dateFinished
                    });
                }
            } catch (statusError) {
                if (statusError.response?.status === 401) {
                    navigate('/login');
                }
                console.log('No existing status found');
            } finally {
                setStatusLoading(false);
            }
        };

        if (authChecked) {
            fetchData();
            if (user) {
                fetchStatus();
            } else {
                setStatusLoading(false);
            }
        }
    }, [bookId, refreshTrigger, user, authChecked, navigate]);

    const handleStatusSubmit = async (e) => {
        e.preventDefault();
        
        if (!user) {
            toast.error('Please log in to save progress');
            navigate('/login');
            return;
        }
    
        try {
       
            const response = await api.put(`/api/status/${bookId}`, {
                status: status.shelf, 
                progress: status.progress,
                dateStarted: status.dateStarted,
                dateFinished: status.dateFinished,
                lastUpdated: new Date().toISOString()
            });
            
            
            setStatus(prev => ({
                ...prev,
                shelf: response.data.status,
                progress: response.data.progress,
                dateStarted: response.data.dateStarted,
                dateFinished: response.data.dateFinished
            }));
            
            setRefreshTrigger(prev => prev + 1);
            toast.success('Reading status updated!');
        } catch (err) {
            if (err.response?.status === 401) {
                navigate('/login');
            }
            toast.error('Failed to update status');
        }
    };

    if (loading) return <Loading />;
    if (!book) return <div className="text-red-500">Book not found</div>;

    const averageRating = parseFloat(book.averageRating) || 0;

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="container mx-auto p-10">
                {/* Book Details Section */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Book Image Section */}
                        <div className="flex justify-center items-start">
                            <div className="relative group">
                                <img
                                    src={book.imageUrl}
                                    alt={book.title}
                                    className="w-full max-w-md h-96 object-cover rounded-xl shadow-2xl transform transition-transform duration-300 group-hover:scale-105"
                                    onError={(e) => {
                                        e.target.src = '/placeholder.jpg';
                                        e.target.onerror = null;
                                    }}
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-xl" />
                            </div>
                        </div>

                        {/* Book Info Section */}
                        <div className="space-y-6">
                            <h1 className="text-4xl font-bold text-gray-900">{book.title}</h1>
                            <p className="text-2xl text-gray-600 font-light">{book.author}</p>

                            <div className="flex items-center space-x-4">
                                <div className="bg-emerald-100 px-4 py-2 rounded-full">
                                    <span className="text-emerald-600 font-semibold text-lg">
                                        ${book.price}
                                    </span>
                                </div>
                                <div className={`px-4 py-2 rounded-full ${book.stock > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                                    <span className={`text-sm font-semibold ${book.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {book.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-2xl font-semibold text-gray-800">About This Masterpiece</h3>
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    {book.description}
                                </p>
                            </div>

                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                                disabled={book.stock <= 0}
                            >
                                {book.stock > 0 ? 'Add to Cart' : 'Notify When Available'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Reading Progress Section */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Reading Journey</h2>
                    <form onSubmit={handleStatusSubmit} className="space-y-6">
                        {statusLoading ? (
                            <div className="animate-pulse p-4 text-center text-gray-600">
                                Loading reading progress...
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-lg font-medium text-gray-700">Current Status</label>
                                        <select
                                            value={status.shelf}
                                            onChange={(e) => setStatus(prev => ({
                                                ...prev,
                                                shelf: e.target.value
                                            }))}
                                            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                        >
                                            <option value="want_to_read">📖 Want to Read</option>
                                            <option value="currently_reading">🔖 Currently Reading</option>
                                            <option value="read">✅ Finished Reading</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-lg font-medium text-gray-700">
                                            Progress: {status.progress}%
                                        </label>
                                        <input
                                            type="range"
                                            value={status.progress}
                                            onChange={(e) => setStatus(prev => ({
                                                ...prev,
                                                progress: parseInt(e.target.value)
                                            }))}
                                            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-lg font-medium text-gray-700">Start Date</label>
                                        <DatePicker
                                            selected={status.dateStarted ? new Date(status.dateStarted) : null}
                                            onChange={(date) => setStatus(prev => ({
                                                ...prev,
                                                dateStarted: date
                                            }))}
                                            className="w-full p-3 border-2 border-gray-200 rounded-xl"
                                            placeholderText="Select start date"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-lg font-medium text-gray-700">Finish Date</label>
                                        <DatePicker
                                            selected={status.dateFinished ? new Date(status.dateFinished) : null}
                                            onChange={(date) => setStatus(prev => ({
                                                ...prev,
                                                dateFinished: date
                                            }))}
                                            className="w-full p-3 border-2 border-gray-200 rounded-xl"
                                            placeholderText="Select finish date"
                                            disabled={status.shelf !== 'read'}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <button
                            type="submit"
                            className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                            disabled={statusLoading}
                        >
                            📚 Save Reading Progress
                        </button>
                    </form>
                </div>

                {/* Community Reviews Section */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="mb-12">
                        <RateBook bookId={bookId} />
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Community Insights</h2>
                    <div className="space-y-8">
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                                Average Rating: {averageRating.toFixed(1)} ⭐
                            </h3>
                            <div className="flex items-center space-x-2">
                                <div className="flex text-yellow-400 text-2xl">
                                    {'★'.repeat(Math.round(averageRating))}
                                    {'☆'.repeat(5 - Math.round(averageRating))}
                                </div>
                                <span className="text-gray-600">({book.reviews?.length} reviews)</span>
                            </div>
                        </div>

                        {book.reviews?.length > 0 ? (
                            book.reviews.map((review) => (
                                <div key={review._id} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                            {review.userId?.slice(0, 2).toUpperCase() || 'GU'}
                                        </div>
                                        <div className="flex space-x-1 text-yellow-400 text-xl">
                                            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                        </div>
                                    </div>
                                    <p className="text-gray-700 text-lg leading-relaxed">
                                        {review.reviewText}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-xl">Be the first to share your thoughts!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default BookDetailForBrowse;