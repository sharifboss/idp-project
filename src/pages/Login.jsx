import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { auth, signInWithGooglePopup } from '../firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import toast, { Toaster } from 'react-hot-toast';
import { FaGoogle, FaGithub, FaTwitter } from 'react-icons/fa';
import { useEffect } from "react";


const schema = yup.object().shape({
  email: yup.string()
    .required('Email is required')
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Invalid email format'
    ),
  password: yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[!@#$%^&*])(?=.*\d).+$/,
      'Invalid password format'
    ),
});

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        // Redirect to Admin or Home if already logged in
        navigate('/admin'); // Change this to the appropriate page
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onSubmitNew = async (data) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      if (!auth.currentUser.emailVerified) {
        toast.error("Please verify your email first");
        return;
      }
      const user = auth.currentUser;
      const idTokenResult = await user.getIdTokenResult();

      if (idTokenResult.claims.admin !== true) {
        // Redirect non-admin users to a non-admin page
        toast.error("You are not authorized to access the admin panel.");
        toast.success("Login successful!");
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
        return;
      }
      toast.success("Login successful!");
      navigate('/admin');
     

    } catch (err) {
      toast.error(err.message || "Login failed");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGooglePopup();
      toast.success("Login successful!");
      navigate('/');
    } catch (err) {
      toast.error(err.message || "Google login failed");
    }
  };
  const handleTwitterLogin = () => {
    toast('Twitter login coming soon!');
  };

  const handleGitHubLogin = () => {
    toast('GitHub login coming soon!');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <Toaster />
      <main className="flex-grow flex items-center justify-center py-12 px-6">
        <div className="w-full max-w-md bg-white p-8 rounded-lg border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Welcome back</h1>
          <p className="text-gray-600 mb-6">Please enter your details to sign in</p>

          <form onSubmit={handleSubmit(onSubmitNew)}>
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

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-semibold">Password</span>
              </label>
              <input
                className="w-full px-3 py-2 border rounded"
                type="password"
                placeholder="Password"
                {...register("password")}
              />
              {errors?.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password?.message}</p>
              )}
            </div>

            <div className="flex justify-between items-center mb-6">
              <label className="cursor-pointer label">
                <input type="checkbox" className="checkbox checkbox-sm mr-2" />
                <span className="label-text">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">Forgot password?</Link>
            </div>

            <button type="submit" className="btn btn-primary w-full mb-4 bg-blue-600 border-blue-600 hover:bg-blue-700">
              Sign in
            </button>

            <div className="divider text-gray-500">Or continue with</div>

            {/* Social buttons section */}
            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={handleGoogleSignIn}
                type="button"
                className="btn btn-outline flex items-center gap-2 border-gray-300 hover:border-red-500 hover:bg-red-50"
              >
                <FaGoogle className="text-red-500 w-5 h-5" />
                <span>Google</span>
              </button>

              <button
                onClick={handleTwitterLogin}
                type="button"
                className="btn btn-outline flex items-center gap-2 border-gray-300 hover:bg-blue-50 hover:border-blue-400"
              >
                <FaTwitter className="text-blue-400 w-5 h-5" />
                <span>Twitter</span>
              </button>

              <button
                onClick={handleGitHubLogin}
                type="button"
                className="btn btn-outline flex items-center gap-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
              >
                <FaGithub className="text-gray-800 w-5 h-5" />
                <span>GitHub</span>
              </button>
            </div>

            <p className="text-center text-gray-600">
              Don't have an account? <Link to="/register" className="text-blue-600 hover:text-blue-800">Sign up</Link>
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;