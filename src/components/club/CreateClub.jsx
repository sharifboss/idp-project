import React, { useState } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../Navbar';
import Footer from '../Footer';

const CreateClub = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/clubs', formData);
      toast.success('Club created successfully!');
      navigate(`/clubs/${response.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create club');
    }
  };

  return (
   <div className=''>
    <Navbar></Navbar>
     <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create New Book Club</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Club Name</label>
          <input
            type="text"
            required
            className="w-full p-2 border rounded-lg mt-1"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            className="w-full p-2 border rounded-lg mt-1"
            rows="3"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Image URL</label>
          <input
            type="url"
            className="w-full p-2 border rounded-lg mt-1"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Create Club
        </button>
      </form>
    </div>
    <Footer></Footer>
   </div>
  );
};

export default CreateClub;