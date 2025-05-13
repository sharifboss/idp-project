import React, { useEffect, useState } from 'react';
import api from '../../api';
import { Link } from 'react-router-dom';
import Loading from '../Loading';

const ClubList = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await api.get('/api/clubs');
        setClubs(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchClubs();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-r bg-white">
      {clubs.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <p className="text-xl text-gray-600 mb-4">No clubs found. Be the first to create one!</p>
          <Link
            to="/clubs/new"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all"
          >
            Create First Club
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {clubs.map(club => (
            <div key={club._id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <Link to={`/clubs/${club._id}`}>
                <div className="relative mb-6">
                  <img
                    src={club.imageUrl || '/default-club.jpg'}
                    alt={club.name}
                    className="w-full h-48 object-cover rounded-lg transition-transform duration-300 transform hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-lg" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 hover:text-blue-600 transition-colors duration-300">{club.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{club.description}</p>
                <div className="text-sm text-gray-500 flex justify-between items-center">
                  <span>{club.members.length} members</span>
                  {club.bookOfTheMonth?.title && (
                    <span className="text-green-500">{club.bookOfTheMonth.title}</span>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClubList;
