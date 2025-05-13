import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { auth } from '../firebase/firebase';
import { signInWithGooglePopup } from '../firebase/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import toast, { Toaster } from 'react-hot-toast';
import { updateProfile } from 'firebase/auth';
import Navbar from '../components/Navbar';
import { FaGoogle, FaGithub, FaTwitter } from 'react-icons/fa';

const schema = yup.object().shape({
  name: yup.string()
    .required('Name is required')
    .min(5, 'Name must be at least 5 characters')
    .matches(
      /^[A-Z][a-zA-Z]*(?:\s[A-Z][a-zA-Z]*)*$/,
      '• Each word must start with uppercase\n• Only letters (A-Z) allowed'
    ),
  email: yup.string()
    .required('Email is required')
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      '• Must include @ symbol\n• Valid domain required (e.g., .com, .net)'
    ),
  password: yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[!@#$%^&*])(?=.*\d).+$/,
      '• Requires 1 special character (!@#$%^&*)\n• Requires 1 number'
    ),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
});

const Register = () => {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    }
  });

  const onSubmitNew = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);


      await updateProfile(userCredential.user, {
        displayName: data.name
      });

      // Refresh auth state
      await auth.updateCurrentUser(userCredential.user);
      await sendEmailVerification(userCredential.user);
      toast.success("Registration successful! Please check your email for verification.");
      navigate('/login');
    } catch (err) {
      toast.error(err.message || "Registration failed");
    }
  };

  // Add dummy handlers
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGooglePopup();
      toast.success("Registration successful!");
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
    <div className="min-h-screen flex flex-col bg-gray-300">
      <Navbar />
      <Toaster />
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-gray-700">Create your account</h1>
          <p className="mb-6 text-gray-600">Join our community of book lovers</p>

          <form onSubmit={handleSubmit(onSubmitNew)}>
            {/* Name Field */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-semibold text-gray-700">Full Name</span>
              </label>
              <input
                className="w-full px-3 py-2 border rounded"
                type="text"
                placeholder="John Doe"
                {...register("name")}
              />
              {errors?.name && (
                <p className="text-red-500 text-xs mt-1 whitespace-pre-line">
                  {errors.name?.message}
                </p>
              )}
            </div>
            {/* Email Field */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-semibold text-gray-700">Email</span>
              </label>
              <input
                className="w-full px-3 py-2 border rounded"
                type="email"
                placeholder="example@domain.com"
                {...register("email")}
              />
              {errors?.email && (
                <p className="text-red-500 text-xs mt-1 whitespace-pre-line">
                  {errors.email?.message}
                </p>
              )}
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-semibold text-gray-700">Password</span>
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

            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text font-semibold text-gray-700">Confirm Password</span>
              </label>
              <input
                className="w-full px-3 py-2 border rounded"
                type="password"
                placeholder="Confirm Password"
                {...register("confirmPassword")}
              />
              {errors?.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword?.message}</p>
              )}
            </div>

            <button type="submit" className="btn btn-primary w-full mb-4 bg-blue-600 hover:bg-blue-700 border-none">
              Sign up
            </button>

            <div className="divider text-gray-500">Or continue with</div>

            {/* Updated social buttons section */}
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
              Already have an account? <Link to="/login" className="text-blue-600 hover:text-blue-800">Sign in</Link>
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;