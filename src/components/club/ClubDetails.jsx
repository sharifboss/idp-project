import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api';
import Post from './Post';
import Loading from '../Loading';
import toast from 'react-hot-toast';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Navbar from '../Navbar';
import Footer from '../Footer';

const ClubDetail = () => {
    const { id } = useParams();
    const [club, setClub] = useState(null);
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [loading, setLoading] = useState(true);
    const [isMember, setIsMember] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [clubRes, postsRes] = await Promise.all([
                    api.get(`/api/clubs/${id}`).catch(err => {
                        if (err.response?.status === 404) {
                            throw new Error('Club not found');
                        }
                        throw err;
                    }),
                    api.get(`/api/clubs/${id}/posts`)
                ]);

                setClub(clubRes.data);
                setPosts(postsRes.data);

                if (user && clubRes.data.members.includes(user.uid)) {
                    setIsMember(true);
                }
            } catch (err) {
                toast.error(err.message);
                setClub(null);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id, user]);

    const handleJoinClub = async () => {
        try {
            await api.post(`/api/clubs/${id}/join`);
            setIsMember(true);
            // Refresh club data to update member count
            const clubRes = await api.get(`/api/clubs/${id}`);
            setClub(clubRes.data);
            toast.success('Joined club successfully!');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to join club');
        }
    };

    const handleSubmitPost = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/posts', {
                clubId: id,
                content: newPost
            });
            setPosts([response.data, ...posts]);
            setNewPost('');
        } catch (err) {
            toast.error('Failed to create post');
        }
    };

    const handleDeleteClub = async () => {
        if (window.confirm('Are you sure you want to delete this club?')) {
            try {
                await api.delete(`/api/clubs/${id}`);
                toast.success('Club deleted successfully!');
                navigate('/clubs');
            } catch (err) {
                toast.error(err.response?.data?.error || 'Failed to delete club');
            }
        }
    };

    const handleLeaveClub = async () => {
        if (window.confirm('Are you sure you want to leave this club?')) {
            try {
                await api.post(`/api/clubs/${id}/leave`);
                setIsMember(false);
                // Refresh club data
                const clubRes = await api.get(`/api/clubs/${id}`);
                setClub(clubRes.data);
                toast.success('Left club successfully!');
            } catch (err) {
                toast.error(err.response?.data?.error || 'Failed to leave club');
            }
        }
    };

    if (loading) return <Loading />;

    if (!club) return <div className="text-center p-8 text-red-500">Club not found</div>;

    return (
        <div className="space-y-6">
            <Navbar />
            <div className="bg-gradient-to-r from-indigo-100 to-blue-200 p-6 rounded-lg shadow-lg mb-12">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-4xl font-bold mb-2 text-gray-800">{club.name}</h1>
                        <p className="text-lg text-gray-600 mb-4">{club.description}</p>
                    </div>

                    <div className="flex items-center gap-4">
                        {!isMember && user && (
                            <button
                                onClick={handleJoinClub}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all"
                            >
                                Join Club
                            </button>
                        )}
                        {isMember && user?.uid !== club?.admin && (
                            <button
                                onClick={handleLeaveClub}
                                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-all"
                            >
                                Leave Club
                            </button>
                        )}
                        {user?.uid === club?.admin && (
                            <button
                                onClick={handleDeleteClub}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
                            >
                                Delete Club
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                        {club.members?.length || 0} Members
                    </span>
                    {club.bookOfTheMonth?.title && (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                            Current Book: {club.bookOfTheMonth.title}
                        </span>
                    )}
                </div>
            </div>

            {isMember && (
                <form onSubmit={handleSubmitPost} className="bg-white p-6 rounded-lg shadow-lg mb-12">
                    <textarea
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        className="w-full p-4 border-2 border-gray-300 rounded-lg mb-4"
                        placeholder="Share your thoughts with the club..."
                        rows="3"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all"
                    >
                        Post Discussion
                    </button>
                </form>
            )}

            <div className="space-y-4">
                {posts.map(post => (
                    <Post key={post._id} post={post} />
                ))}
            </div>

            <Footer />
        </div>
    );
};

export default ClubDetail;
