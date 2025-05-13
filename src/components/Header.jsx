import { Link } from 'react-router-dom';
import Button from "./ui/Button";
export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 shadow-md bg-white">
      <div className="flex items-center space-x-4">
        <img src="/logo.png" alt="Logo" className="h-8" />
        <nav className="space-x-4">
          <Link to="/" className="text-sm font-medium text-blue-600">Home</Link>
          <Link to="/browse" className="text-sm text-gray-700">Browse</Link>
          <Link to="/clubs" className="text-sm text-gray-700">Book Clubs</Link>
          <Link to="/about" className="text-sm text-gray-700">About</Link>
        </nav>
      </div>
      <div className="space-x-2">
        <Button className="text-sm px-4 py-2 border rounded">Sign Up</Button>
        <Button className="text-sm px-4 py-2 bg-blue-600 text-white rounded">Sign In</Button>
      </div>
    </header>
  );
}
