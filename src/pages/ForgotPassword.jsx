import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { auth } from '../firebase/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import toast, { Toaster } from 'react-hot-toast';

const schema = yup.object().shape({
  email: yup.string().email().required('Please enter your email address'),
});

const ForgotPassword = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await sendPasswordResetEmail(auth, data.email);
      toast.success("Password reset email sent. Please check your inbox.");
      setIsSubmitted(true);
    } catch (err) {
      toast.error(err.message || "Failed to send reset email");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <Toaster />
      <main className="flex-grow flex items-center justify-center py-12 px-6">
        <div className="w-full max-w-md bg-white p-8 rounded-lg border border-gray-200">
          {!isSubmitted ? (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Forgot Password</h1>
              <p className="text-gray-600 mb-6">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-semibold">Email</span>
                  </label>
                  <input
                    className="w-full px-3 py-2 border rounded"
                    type="email"
                    placeholder="Email"
                    {...register("email")}
                  />
                  {errors?.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email?.message}</p>
                  )}
                </div>
                <button type="submit" className="btn btn-primary w-full mb-4 bg-blue-600 border-blue-600 hover:bg-blue-700">
                  Send Reset Link
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Check Your Email</h2>
              <p className="text-gray-600 mb-6">
                We've sent an email with instructions to reset your password.
              </p>
              <Link to="/login" className="text-blue-600 hover:text-blue-800">
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ForgotPassword;