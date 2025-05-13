import { createBrowserRouter } from "react-router-dom";
import Home from '../../pages/Home';
import Login from '../../pages/Login';
import Register from '../../pages/Register';
import ForgotPassword from '../../pages/ForgotPassword';
import ProtectedAdminRoute from './ProtectedAdminRoute';
import Admin from "../../pages/Admin";
import Bookstore from "../../pages/Bookstore";
import ProfilePage from "../../pages/Profile";
import BookDetail from "../bookstore/BookDetail";  // Bookstore book detail page
import BookDetailForBrowse from "../Browsebooks/BookDetailForBrowse";  // Browse Books book detail page
import BrowseBooks from "../../pages/BrowseBooks";  // Browse Books page
import Recommendations from "../Recommendations";
import ClubListPage from "../../pages/ClubListPage";
import ClubDetail from "../club/ClubDetails";
import CreateClub from "../club/CreateClub";
import Checkout from "../../pages/Checkout";
import OrderConfirmation from "../bookstore/OrderConfirmation";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedAdminRoute>
        <Admin />
      </ProtectedAdminRoute>
    ),
  },
  {
    path: "/bookstore",
    element: <Bookstore />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "*",
    element: <h1>Error</h1>,
  },
  {
    path: "/checkout",
    element: <Checkout></Checkout>
  },
  {
    path: "/bookstore/book/:id",
    element: <BookDetail />,
  },
  {
    path: "/browse",
    element: <BrowseBooks />,
  },
  {
    path: "/book/:id",
    element: <BookDetailForBrowse />,
  },
  {
    path: '/recommendations',
    element: <Recommendations></Recommendations>
  },

  {
    path: '/clubs',
    element: <ClubListPage></ClubListPage>
  },
  {
    path: '/clubs/:id',
    element: <ClubDetail></ClubDetail>
  },

  {
    path: '/clubs/new',
    element: <CreateClub></CreateClub>
  },
  {
    path: "/order-confirmation",
    element: <OrderConfirmation></OrderConfirmation>


  },
]);

export default router;
