import Hero from '../components/Hero';
import Navbar from '../components/Navbar';
import TrendingBooks from '../components/TrendingBooks';
import SummarySection from '../components/SummarySection';
import BookClubs from '../components/BookClubs';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col ">
      <Navbar />
      <div className='container mx-auto p-5'>
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 ">
          <Hero />
          <TrendingBooks />
          <SummarySection />
          <BookClubs />
          <Testimonials />
        </main>

      </div>

      <Footer />
    </div>
  );
};

export default Home;