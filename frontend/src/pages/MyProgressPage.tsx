import Layout from '@/components/Layout';
import ProgressHistoryChart from '@/components/member/ProgressHistoryChart';
import ProgressTrackerForm from '@/components/member/ProgressTrackerForm';
import { useProgress } from '@/hooks/useProgress';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const MyProgressPage = () => {
  const { progressMetrics, workoutLogs, isLoading, error } = useProgress();

  if (error) {
    return (
      <Layout>
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <Card className="p-6 text-center text-red-500">
              Error loading progress data: {error.message}
            </Card>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-16 px-4 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-[#333333]">
            My Fitness Progress
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {isLoading ? (
              <Skeleton className="h-[400px] w-full" />
            ) : (
              <ProgressTrackerForm />
            )}

            {isLoading ? (
              <Skeleton className="h-[400px] w-full" />
            ) : (
              <ProgressHistoryChart progressMetrics={progressMetrics} />
            )}
          </div>

          <div className="mt-12">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Recent Workout Logs</h2>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : workoutLogs.length > 0 ? (
                <div className="space-y-4">
                  {workoutLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="border p-4 rounded-lg shadow-sm">
                      <p className="text-lg font-medium text-[#1B998B]">
                        {log.date ? new Date(log.date).toLocaleDateString() : 'N/A'}
                      </p>
                      <p className="text-gray-700 mt-1">
                        <span className="font-semibold">Description:</span> {log.description ?? 'N/A'}
                      </p>
                      <p className="text-gray-700 mt-1">
                        <span className="font-semibold">Exercises:</span> {log.exercises ?? 'N/A'}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No workout logs found. Start logging your workouts!</p>
              )}
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MyProgressPage;