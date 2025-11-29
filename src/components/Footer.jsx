import { Link } from 'react-router-dom'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'Jost, Poppins, sans-serif' }}>
              🥤 BlendBase
            </h3>
            <p className="text-gray-300 text-sm">
              Discover and share amazing smoothie recipes. Join our community of healthy living enthusiasts!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-300 hover:text-primary transition">
                  Recipes
                </Link>
              </li>
              <li>
                <Link to="/create" className="text-gray-300 hover:text-primary transition">
                  Create Recipe
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-primary transition">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect Section */}
          <div>
            <h4 className="font-semibold mb-3">Connect</h4>
            <p className="text-gray-300 text-sm">
              Follow us on social media for recipe inspiration and updates!
            </p>
            <div className="flex gap-3 mt-3">
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary transition">
                Pinterest
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary transition">
                Facebook
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary transition">
                Twitter
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary transition">
                Instagram
              </a>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} BlendBase. All rights reserved. Made with 💚 for smoothie lovers.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer