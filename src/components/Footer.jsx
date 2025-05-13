const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white px-8 py-6 text-sm">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <h5 className="font-bold mb-2">About Us</h5>
          <ul className="space-y-1">
            <li><a href="#" className="hover:underline">About</a></li>
            <li><a href="#" className="hover:underline">Careers</a></li>
            <li><a href="#" className="hover:underline">Press</a></li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold mb-2">Support</h5>
          <ul className="space-y-1">
            <li><a href="#" className="hover:underline">Help Center</a></li>
            <li><a href="#" className="hover:underline">Safety Center</a></li>
            <li><a href="#" className="hover:underline">Community Guidelines</a></li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold mb-2">Legal</h5>
          <ul className="space-y-1">
            <li><a href="#" className="hover:underline">Terms of Service</a></li>
            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            <li><a href="#" className="hover:underline">Cookie Policy</a></li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold mb-2">Follow Us</h5>
          <div className="flex space-x-2 text-xl">
            <a href="#" className="hover:text-blue-400"></a>
            <a href="#" className="hover:text-blue-400"></a>
            <a href="#" className="hover:text-blue-400"></a>
          </div>
        </div>
      </div>
      <p className="mt-4 text-center">© 2024 Book Review & Social Sharing. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
