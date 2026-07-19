import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/AdminLayout';
import { Card } from '@/components/ui/card';
import { ROUTES } from '@/routes';

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <section className="py-6 sm:px-6 lg:px-8 bg-[#F5F5F5] min-h-screen">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-semibold text-[#333333] mb-6">Admin Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to={ROUTES.ADMIN_MEMBERSHIP_PLANS} className="transition-all duration-200 hover:scale-105">
              <Card className="p-6 flex flex-col items-center justify-center text-center h-full">
                <h2 className="text-xl font-semibold text-[#333333] mb-2">Manage Membership Plans</h2>
                <p className="text-[#333333] leading-relaxed">View, create, edit, and delete membership plans.</p>
              </Card>
            </Link>

            <Link to={ROUTES.ADMIN_CLASSES} className="transition-all duration-200 hover:scale-105">
              <Card className="p-6 flex flex-col items-center justify-center text-center h-full">
                <h2 className="text-xl font-semibold text-[#333333] mb-2">Manage Fitness Classes</h2>
                <p className="text-[#333333] leading-relaxed">Oversee fitness class schedules and details.</p>
              </Card>
            </Link>

            <Link to={ROUTES.ADMIN_BLOG} className="transition-all duration-200 hover:scale-105">
              <Card className="p-6 flex flex-col items-center justify-center text-center h-full">
                <h2 className="text-xl font-semibold text-[#333333] mb-2">Manage Blog Posts</h2>
                <p className="text-[#333333] leading-relaxed">Create, edit, and publish engaging blog content.</p>
              </Card>
            </Link>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}