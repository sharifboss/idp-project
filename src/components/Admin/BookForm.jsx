import { useState, useEffect } from 'react';
import api from '../../api';
import { auth } from '../../firebase/firebase';

const BookForm = ({ selectedBook, setSelectedBook, setBooks }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: 0,
    genre: 'Fiction',
    description: '',
    imageUrl: '',
    stock: 0,
    imageFile: null,
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedBook) {
      setFormData(selectedBook);
    }
  }, [selectedBook]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = await auth.currentUser.getIdToken();

      if (selectedBook) {
        await api.put(`/api/admin/books/${selectedBook._id}`, formData, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
      } else {
        await api.post('/api/admin/books', formData, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
      }

      const response = await api.get('/api/admin/books', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      setBooks(response.data);
      setSelectedBook(null);
      setFormData({
        title: '',
        author: '',
        price: 0,
        genre: 'Fiction',
        description: '',
        imageUrl: '',
        stock: 0,
        imageFile: null,
      });
    } catch (error) {
      console.error('Error saving book:', error);
      setError('Failed to save the book, please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload a JPG, PNG, or GIF image.');
      return;
    }

    setUploading(true);
    setFormData({ ...formData, imageFile: file });

    const formDataForUpload = new FormData();
    formDataForUpload.append('image', file);

    try {
      const token = await auth.currentUser.getIdToken();
      const res = await api.post('/api/upload', formDataForUpload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setFormData({ ...formData, imageUrl: res.data.imageUrl });
    } catch (error) {
      console.error('Image upload failed:', error);
      setError('Failed to upload the image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto my-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Add or Update Book</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Author</label>
          <input
            type="text"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Price</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Genre</label>
          <select
            value={formData.genre}
            onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
            className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="Fiction">Fiction</option>
            <option value="Science">Science</option>
            <option value="Mystery">Mystery</option>
            <option value="Romance">Romance</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Biography">Biography</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            rows="4"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Stock</label>
          <input
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="col-span-2">
          <label className="block text-gray-700 mb-2">Upload Image</label>
          <input
            type="file"
            onChange={handleImageUpload}
            className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          />
          {uploading && <div className="text-blue-500 mt-2">Uploading image...</div>}
          {formData.imageUrl && (
            <div className="mt-2">
              <img src={formData.imageUrl} alt="Book cover" className="w-32 h-32 object-cover" />
            </div>
          )}
        </div>
      </div>

      {error && <div className="text-red-500 mt-2">{error}</div>}

      <button
        type="submit"
        className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        disabled={loading || uploading}
      >
        {loading ? 'Saving...' : selectedBook ? 'Update Book' : 'Add Book'}
      </button>
    </form>
  );
};

export default BookForm;
