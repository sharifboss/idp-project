import { Navigate } from 'react-router-dom';
import { auth } from '../../firebase/firebase';
import Dashboard from '../Admin/Dashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Only check authentication for protected routes
  if (!auth.currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  // Optional: Add email verification check if needed
  if (!auth.currentUser.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }
  
  return children;
};

// const ProtectedAdminRoute = ({ children }) => {
//   const user = auth.currentUser;
  
//   if (!user) {
//     return <Navigate to="/login" />;
//   }

//   const [isAdmin, setIsAdmin] = useState(false);

//   useEffect(() => {
//     if (user) {
//       user.getIdTokenResult().then((idTokenResult) => {
//         setIsAdmin(idTokenResult.claims.admin === true);
//       });
//     }
//   }, [user]);

//   if (!isAdmin) {
//     return <Navigate to="/login" />;
//   }

//   return children;
// };

// // Use ProtectedAdminRoute in your router
// <Route path="/admin" element={
//   <ProtectedAdminRoute>
//     <Dashboard></Dashboard>
//   </ProtectedAdminRoute>
// } />


export default ProtectedRoute;