import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { ROUTES, routeTable } from '@/routes';
import { useAuth } from '@/hooks/useAuth';

const AdminLayout: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();

  const adminNavRoutes = routeTable.filter(route => route.nav && route.admin);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-[#0D1B2A] text-white p-4 space-y-6">
        <h2 className="text-2xl font-bold text-[#F26419]">Admin Panel</h2>
        <nav className="space-y-2">
          {adminNavRoutes.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-[#F26419] transition-colors duration-200"
            >
              {route.nav}
            </Link>
          ))}
          <Button
            onClick={logout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition-all duration-200"
          >
            Logout
          </Button>
        </nav>
      </aside>

      {/* Mobile Header and Sidebar */}
      <div className="flex-1 flex flex-col">
        <header className="md:hidden bg-[#0D1B2A] text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#F26419]">Admin Panel</h2>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-[#0D1B2A] text-white p-4">
              <h2 className="text-2xl font-bold text-[#F26419] mb-6">Admin Panel</h2>
              <nav className="space-y-2">
                {adminNavRoutes.map((route) => (
                  <Link
                    key={route.path}
                    to={route.path}
                    className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-[#F26419] transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    {route.nav}
                  </Link>
                ))}
                <Button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition-all duration-200"
                >
                  Logout
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;