import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import { ROUTES, routeTable } from '@/routes';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  const publicNavRoutes = routeTable.filter(route => route.nav && !route.admin);

  return (
    <header className="bg-[#0D1B2A] text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to={ROUTES.HOME} className="text-2xl font-bold text-[#F26419]">
          Vikram's Fitness Studio
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 items-center">
          {publicNavRoutes.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className="hover:text-[#F26419] transition-all duration-200"
            >
              {route.nav}
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              {user?.roles?.includes('ADMIN') && (
                <Link
                  to={ROUTES.ADMIN_DASHBOARD}
                  className="hover:text-[#F26419] transition-all duration-200"
                >
                  Admin Portal
                </Link>
              )}
              <Link
                to={ROUTES.MEMBER_DASHBOARD}
                className="hover:text-[#F26419] transition-all duration-200"
              >
                Member Portal
              </Link>
              <Button
                onClick={handleLogout}
                className="bg-[#F26419] hover:bg-[#E05A15] text-white font-semibold rounded-full px-4 py-2 transition-all duration-200"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link
                to={ROUTES.LOGIN}
                className="bg-[#F26419] hover:bg-[#E05A15] text-white font-semibold rounded-full px-4 py-2 transition-all duration-200"
              >
                Login
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white focus:outline-none">
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0D1B2A] pb-4">
          <nav className="flex flex-col items-center space-y-4">
            {publicNavRoutes.map((route) => (
              <Link
                key={route.path}
                to={route.path}
                className="text-white hover:text-[#F26419] transition-all duration-200 w-full text-center py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {route.nav}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                {user?.roles?.includes('ADMIN') && (
                  <Link
                    to={ROUTES.ADMIN_DASHBOARD}
                    className="text-white hover:text-[#F26419] transition-all duration-200 w-full text-center py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin Portal
                  </Link>
                )}
                <Link
                  to={ROUTES.MEMBER_DASHBOARD}
                  className="text-white hover:text-[#F26419] transition-all duration-200 w-full text-center py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Member Portal
                </Link>
                <Button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="bg-[#F26419] hover:bg-[#E05A15] text-white font-semibold rounded-full px-6 py-2 transition-all duration-200 w-3/4"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  to={ROUTES.LOGIN}
                  className="bg-[#F26419] hover:bg-[#E05A15] text-white font-semibold rounded-full px-6 py-2 transition-all duration-200 w-3/4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;