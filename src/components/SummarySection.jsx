import book1 from '../assets/IMG (10).png';
import book2 from '../assets/IMG (9).png';
import book3 from '../assets/IMG (8).png';
import book4 from '../assets/IMG (7).png';

import Button from "./ui/Button";

const SummarySection = () => {
  const books = [
    {
      cover: book1,
      title: "The Silent Patient",
      author: "Alex Michaelides",
      rating: 4.5
    },
    {
      cover: book2,
      title: "Atomic Habits",
      author: "James Clear",
      rating: 5.0
    },
    {
      cover: book3,
      title: "Project Hail Mary",
      author: "Andy Weir",
      rating: 4.0
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column */}
        <div className="flex flex-col gap-6 lg:w-1/4">
          {/* Book Summary */}
          <div className="bg-white shadow p-4 rounded flex flex-col">
            <h4 className="font-semibold mb-2">Book Summary</h4>
            <img
              src={book4}
              alt="Book Summary"
              className="w-full h-32 object-cover rounded mb-2"
            />
            <p className="text-sm text-gray-600 mb-2">
              Daily Book Summaries<br />
              Get key insights from popular books
            </p>
            <Button size="sm" className="mt-auto">Read Summaries</Button>
          </div>

          {/* Monthly Giveaway */}
          <div className="bg-white shadow p-4 rounded flex flex-col">
            <h4 className="font-semibold mb-2">Monthly Giveaway</h4>
            <div className="flex items-center gap-4 mb-4">
              <img
                src={book1}
                alt="The Silent Patient"
                className="h-24 w-16 object-cover rounded"
              />
              <div>
                <p className="font-semibold">The Silent Patient</p>
                <p className="text-sm text-gray-600">Alex Michaelides</p>
                <div className="flex items-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < 4.5 ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-xs text-gray-500 ml-1">4.5</span>
                </div>
              </div>
            </div>
            <Button size="sm" className="mt-auto">Enter Now</Button>
          </div>
        </div>

        {/* Middle Column */}
        <div className="lg:w-2/4">
          {/* Recommended for You */}
          <div className="bg-white shadow p-4 rounded">
            <h4 className="font-semibold mb-4">Recommended for You</h4>
            <div className="space-y-4">
              {books.map((book, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="h-24 w-16 object-cover rounded"
                  />
                  <div className="flex-grow">
                    <p className="font-semibold">{book.title}</p>
                    <p className="text-sm text-gray-600">{book.author}</p>
                  </div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < book.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-xs text-gray-500 ml-1">{book.rating.toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Now only contains Upcoming Events */}
        <div className="lg:w-1/4">
          {/* Upcoming Events */}
          <div className="bg-white shadow p-4 rounded h-full">
            <h4 className="font-semibold mb-4">Upcoming Events</h4>
            <div className="space-y-4">
              <div>
                <p className="font-medium">Author Q&A: Margaret Atwood</p>
                <p className="text-sm text-gray-500">Tomorrow, 7:00 PM</p>
                <Button size="sm" className="mt-2 w-full">Set Reminder</Button>
              </div>
              <div>
                <p className="font-medium">Book Launch: The New Earth</p>
                <p className="text-sm text-gray-500">Sep 15, 6:30 PM</p>
                <Button size="sm" className="mt-2 w-full">Set Reminder</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummarySection;