const Giveaway = () => {
    return (
      <section className="py-12 px-6 border-t border-gray-200">
        <div className="container mx-auto">
          <div className="bg-white p-6 rounded-lg border border-gray-200 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Monthly Giveaway</h2>
            <h3 className="font-medium text-gray-900 mb-1">Win a Book Bundle!</h3>
            <p className="text-gray-600 mb-4">Enter our monthly giveaway for a chance to win a Recruiting books</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Enter Now
            </button>
            <p className="mt-4 text-sm text-gray-500">Next drawing 2 days left</p>
          </div>
        </div>
      </section>
    );
  };
  
  export default Giveaway;
  