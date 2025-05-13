import React, { useState } from 'react';
import api from '../../api';
import toast from 'react-hot-toast';
import { auth } from '../../firebase/firebase';

const RateBook = ({ bookId }) => {
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Force token refresh before submission
      await auth.currentUser.getIdToken(true);
      
      await api.post(`/api/books/${bookId}/reviews`, {
        rating,
        reviewText
      });
      toast.success('Review submitted!');
      setReviewText('');  // Clear review text after submission
      setRating(5); // Reset rating after submission
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error.response?.data?.error || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mt-8 max-w-2xl mx-auto">
      <h3 className="text-2xl font-semibold mb-6 text-gray-800">Write a Review</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating Section */}
        <div className="flex items-center justify-start gap-4">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setRating(num)}
              className={`text-3xl ${
                num <= rating ? 'text-yellow-500' : 'text-gray-300'
              } hover:text-yellow-400 transition-colors duration-200`}
            >
              ★
            </button>
          ))}
        </div>
        
        {/* Review Textarea */}
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Share your thoughts about this book..."
          rows="6"
          required
        />
        
        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting || !reviewText.trim()}
            className={`bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-300 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RateBook;
