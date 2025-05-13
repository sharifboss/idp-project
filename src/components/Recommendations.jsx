import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import Loading from './Loading';
import Navbar from './Navbar';
import Footer from './Footer';
import toast from 'react-hot-toast';

const Recommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await api.get('/api/recommendations');
                if (response.data.message) {
                    setMessage(response.data.message);
                } else {
                    setRecommendations(response.data);
                }
            } catch (err) {
                toast.error(err.response?.data?.error || 'Failed to load recommendations');
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    if (loading) return <Loading />;

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
            <Navbar />
            <div className="container mx-auto p-8">
                <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8 tracking-wide">
                    Personalized Recommendations
                </h1>

                {message ? (
                    <div className="bg-white p-6 rounded-lg shadow-xl text-center">
                        <p className="text-lg text-gray-600">{message}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {recommendations.map(book => (
                            <div key={book._id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow transform hover:scale-105 relative overflow-hidden">
                                {/* Blue Genre Badge - Top Right Corner */}
                                <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
                                    {book.genre}
                                </div>
                                
                                <Link to={`/book/${book._id}`}>
                                    <div className="relative group">
                                        <img
                                            src={book.imageUrl}
                                            alt={book.title}
                                            className="w-full h-64 object-cover rounded-lg transition-transform duration-500 ease-in-out group-hover:scale-110"
                                            onError={(e) => e.target.src = '/placeholder.jpg'}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-lg" />
                                        <div className="absolute inset-0 bg-blue-500 opacity-0 transition-all duration-300 ease-out group-hover:opacity-30 rounded-lg"></div>
                                    </div>

                                    <h3 className="text-xl font-semibold mb-2 text-gray-800 hover:text-indigo-600 transition-colors duration-300 mt-4">
                                        {book.title}
                                    </h3>
                                    <p className="text-gray-600 mb-2">{book.author}</p>

                                    <div className="flex items-center mb-2">
                                        <div className="text-yellow-500 mr-2">
                                            {'★'.repeat(Math.round(book.averageRating))}
                                            {'☆'.repeat(5 - Math.round(book.averageRating))}
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            ({book.averageRating}/5)
                                        </span>
                                    </div>

                                    <div className="text-lg text-gray-900 font-semibold">${book.price}</div>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Recommendations;