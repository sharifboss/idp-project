import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import toast from 'react-hot-toast';

const EditClub = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: ''
  });

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const response = await api.get(`/api/clubs/${id}`);
        setFormData({
          name: response.data.name,
          description: response.data.description,
          imageUrl: response.data.imageUrl
        });
      } catch (err) {
        toast.error('Failed to load club data');
      }
    };
    fetchClub();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/clubs/${id}`, formData);
      toast.success('Club updated successfully!');
      navigate(`/clubs/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update club');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Book Club</h2>
      {/* Same form as CreateClub but with existing values */}
    </div>
  );
};

export default EditClub;