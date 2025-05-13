import React, { useState } from 'react';
import api from '../../api';
import { formatDistanceToNow } from 'date-fns';

const Post = ({ post }) => {
  const [comment, setComment] = useState('');
  const [currentPost, setCurrentPost] = useState(post);

  const handleLike = async () => {
    try {
      const response = await api.post(`/api/posts/${post._id}/like`);
      setCurrentPost(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`/api/posts/${post._id}/comment`, {
        content: comment
      });
      setCurrentPost(response.data);
      setComment('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl mb-6">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
        <div>
          <p className="font-semibold text-gray-800">User {currentPost.authorId.slice(0, 5)}</p>
          <p className="text-sm text-gray-500">
            {formatDistanceToNow(new Date(currentPost.createdAt))} ago
          </p>
        </div>
      </div>
      
      <p className="text-lg text-gray-800 mb-4">{currentPost.content}</p>

      {/* Like and Comment Interaction */}
      <div className="flex items-center space-x-6 mb-4">
        <button 
          onClick={handleLike} 
          className="flex items-center text-gray-600 hover:text-red-500 transition-colors duration-300">
          <span className="mr-1 text-xl">❤️</span> {currentPost.likes.length}
        </button>
        <span className="text-gray-600">{currentPost.comments.length} comments</span>
      </div>

      {/* Comment Section */}
      <div className="space-y-4 mb-4">
        {currentPost.comments.map(comment => (
          <div key={comment._id} className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-all duration-300">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full mr-3"></div>
              <span className="text-sm font-semibold text-gray-700">User {comment.authorId.slice(0, 5)}</span>
            </div>
            <p className="text-gray-700">{comment.content}</p>
          </div>
        ))}
      </div>

      {/* Comment Input Form */}
      <form onSubmit={handleComment} className="mt-4">
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all"
          placeholder="Write a comment..."
        />
        <button 
          type="submit"
          className="mt-3 w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
          Post Comment
        </button>
      </form>
    </div>
  );
};

export default Post;
