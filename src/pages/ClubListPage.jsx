import React from 'react';
import ClubList from '../components/club/ClubList';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from "react-router-dom";

const ClubListPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
      <Navbar />
      <div className="container mx-auto p-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-800">Book Clubs</h1>
          <Link 
            to="/clubs/new"
            className="bg-green-600 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
          >
            Create New Club
          </Link>
        </div>

        {/* Club List */}
        <ClubList />

      </div>
      <Footer />
    </div>
  );
};

export default ClubListPage;
