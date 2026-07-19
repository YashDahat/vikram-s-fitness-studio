import { Link } from 'react-router-dom';
import { useBookings } from '@/hooks/useBookings';
import { ROUTES } from '@/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Clock, User } from 'lucide-react';

const ClassHighlights = () => {
  const { fitnessClasses, isLoadingClasses, errorClasses } = useBookings();

  if (isLoadingClasses) {
    return (
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-12">Featured Classes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
                <div className="flex items-center mb-2">
                  <div className="h-4 w-4 bg-gray-200 rounded-full mr-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-4 bg-gray-200 rounded-full mr-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (errorClasses) {
    return (
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center text-red-500">
          Error loading fitness classes: {errorClasses.message}
        </div>
      </section>
    );
  }

  const featuredClasses = fitnessClasses.slice(0, 3);

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-12">Featured Classes</h2>
        {featuredClasses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredClasses.map((fitnessClass) => (
              <Card key={fitnessClass.id} className="p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-lg">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-[#F26419]">{fitnessClass.name}</h3>
                  <p className="text-[#333333] mb-4">{fitnessClass.description}</p>
                </div>
                <div>
                  <div className="flex items-center text-gray-600 mb-2">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>
                      {fitnessClass.startTime?.substring(0, 5)} - {fitnessClass.endTime?.substring(0, 5)}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <User className="w-4 h-4 mr-2" />
                    <span>{fitnessClass.instructor}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">No featured classes available at the moment.</div>
        )}
        <div className="text-center mt-12">
          <Link to={ROUTES.CLASSES}>
            <Button className="bg-[#1B998B] hover:bg-[#177F73] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200">
              View All Classes
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ClassHighlights;