import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, signOut } from "../firebase/firebase";
import toast from "react-hot-toast";
import logo from "../assets/IMG (18).png";
import { FaShoppingCart, FaBell } from 'react-icons/fa';
import { useCart } from "../context/CartContext";  // Import the useCart hook

const Navbar = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { cart } = useCart(); // Access cart from CartContext
  const [totalItemsInCart, setTotalItemsInCart] = useState(0);  // Track total items in cart
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (user) {
        user.reload().then(() => {
          const idTokenResult = user.getIdTokenResult();
          idTokenResult.then((idToken) => {
            setIsAdmin(idToken.claims.admin === true);
          });
        });
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    // Update the cart count whenever the cart changes
    setTotalItemsInCart(Object.keys(cart).length);
  }, [cart]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleCartClick = () => {
    navigate('/checkout');
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 shadow-md bg-white">
      <div className="flex items-center space-x-4">
        <img src={logo} alt="Logo" className="h-8 w-10" />
        <nav className="space-x-4 hidden md:flex">
          <NavLink to="/" className="text-sm font-medium text-blue-600 hover:text-blue-800">
            Home
          </NavLink>
          <NavLink to="/browse" className="text-sm text-gray-700 hover:text-blue-600">
            Browse Books
          </NavLink>
          <NavLink to="/recommendations" className="text-sm text-gray-700 hover:text-blue-600">Recommendations</NavLink>

          <NavLink to="/bookstore" className="text-sm text-gray-700 hover:text-blue-600">
            Bookstore
          </NavLink>
          <NavLink to="/clubs" className="text-sm text-gray-700 hover:text-blue-600">
            Book Clubs
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className="text-sm text-gray-700 hover:text-blue-600">
              Admin
            </NavLink>
          )}
          <NavLink to="/about" className="text-sm text-gray-700 hover:text-blue-600">
            About
          </NavLink>
        </nav>
      </div>

      <div className="flex items-center space-x-4">
        {currentUser ? (
          <>
            <Link to="/profile">
              <span className="text-sm text-gray-700">
                👤 {currentUser.displayName || "Book Lover"}
              </span>
            </Link>
            <button onClick={handleSignOut} className="btn btn-primary btn-sm text-sm bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded">
              Sign Out
            </button>
          </>
        ) : (
          <ul className="flex space-x-6">
            <li><Link to="/register" className="hover:text-primary text-sm">Sign Up</Link></li>
            <li><Link to="/login" className="btn btn-primary btn-sm text-sm">Sign In</Link></li>
          </ul>
        )}

        {/* Cart Icon - Only display on Bookstore page */}
        {location.pathname === '/bookstore' && (
          <div className="relative cursor-pointer" onClick={handleCartClick}>
            <FaShoppingCart className="text-xl text-gray-700" />
            {totalItemsInCart > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                {totalItemsInCart}
              </span>
            )}
          </div>
        )}

        {/* Notification icon */}
        <FaBell className="text-xl text-gray-700 cursor-pointer" />
      </div>
    </header>
  );
};

export default Navbar;
