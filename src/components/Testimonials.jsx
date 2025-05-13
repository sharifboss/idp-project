import book4 from '../assets/IMG (13).png';
const Testimonials = () => {
  return (
    <section className="bg-[#F9FAFB] px-8 py-6">
      <h2 className="text-xl font-semibold mb-4 text-black">What Our Members Say</h2>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center space-x-4">
          <img
            src={book4}
            alt="User"
            className="h-10 w-10 rounded-full"
          />
          <div>
            <h4 className="font-semibold text-black">Emma Thompson</h4>
            <p className="text-yellow-400 text-sm">⭐⭐⭐⭐⭐</p>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-800">
          "BookClub has transformed my reading experience. The recommendations are spot-on, and the community discussions add so much depth to each book."
        </p>
      </div>
    </section>
  );
};

export default Testimonials;