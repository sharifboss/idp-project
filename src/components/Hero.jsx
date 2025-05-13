import Button from "./ui/Button";
import heroImage from "../assets/IMG.png"; 
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 items-center bg-gray-100 px-8 py-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold leading-tight">Your next great read awaits you here</h1>
        <p className="text-gray-600">Join our community of book lovers. Discover new books, join reading clubs, and connect with fellow readers.</p>
        <div className="space-x-2">
          <Link to="/bookstore">
          <Button className="bg-red-500 text-white px-4 py-2 rounded">Get started</Button>
          </Link>
          
          <Link to="/browse">
           <Button  className="border px-4 py-2 rounded">Browse books</Button>
          </Link>
          
        </div>
      </div>
      <img 
        src={heroImage} 
        alt="Books flying" 
        className="w-full h-auto mt-6 md:mt-0" 
      />
    </section>
  );
}
