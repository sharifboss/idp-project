import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { RouterProvider } from 'react-router-dom';
import router from './components/routes/routes.jsx';
import { CartProvider } from './context/CartContext';  // Import CartProvider
import { Toaster } from 'react-hot-toast'; // Import Toaster

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <div data-theme="mylight" className="min-h-screen bg-[#F9FAFB] text-black">
        <RouterProvider router={router} />
        <Toaster />  
      </div>
    </CartProvider>
  </StrictMode>
);
