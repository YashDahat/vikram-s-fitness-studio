<footer className="bg-[#0D1B2A] text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-[#F26419]">Contact Us</h3>
          <p className="text-gray-300 mb-2">
            Chinar Heights, 33/9, Prabhat Rd, opp. Shri Mahila Griha Udyog Lijjat Papad Factory, Abhiman Society, Kachare Colony, Papad, Pune, Maharashtra 411004
          </p>
          <p className="text-gray-300">Phone: 095277 30493</p>
        </div>

        {/* Social Media Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-[#F26419]">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-300 hover:text-[#F26419] transition-all duration-200">
              Facebook
            </a>
            <a href="#" className="text-gray-300 hover:text-[#F26419] transition-all duration-200">
              Instagram
            </a>
            <a href="#" className="text-gray-300 hover:text-[#F26419] transition-all duration-200">
              Twitter
            </a>
          </div>
        </div>

        {/* Sitemap / Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-[#F26419]">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="/" className="text-gray-300 hover:text-[#F26419] transition-all duration-200">Home</a></li>
            <li><a href="/classes" className="text-gray-300 hover:text-[#F26419] transition-all duration-200">Classes</a></li>
            <li><a href="/membership" className="text-gray-300 hover:text-[#F26419] transition-all duration-200">Membership</a></li>
            <li><a href="/blog" className="text-gray-300 hover:text-[#F26419] transition-all duration-200">Blog</a></li>
            <li><a href="/about" className="text-gray-300 hover:text-[#F26419] transition-all duration-200">About Us</a></li>
            <li><a href="/contact" className="text-gray-300 hover:text-[#F26419] transition-all duration-200">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
        &copy; {new Date().getFullYear()} Vikram's Fitness Studio. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;