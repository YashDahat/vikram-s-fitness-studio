import { useProgress } from '@/hooks/useProgress';
import { Card } from '@/components/ui/card';
import { ProgressMetricDto } from '@/types/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

const ProgressChart = () => {
  const { progressMetrics, isLoading, error } = useProgress();

  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-6 w-3/4 mb-4" />
        <Skeleton className="h-64 w-full" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 text-red-500">
        <h3 className="text-xl font-semibold mb-4">Progress Summary</h3>
        <p>Error loading progress data: {error.message}</p>
      </Card>
    );
  }

  // Group metrics by name and then sort by date
  const groupedMetrics: { [key: string]: ProgressMetricDto[] } = progressMetrics.reduce((acc, metric) => {
    if (metric.metricName) {
      if (!acc[metric.metricName]) {
        acc[metric.metricName] = [];
      }
      acc[metric.metricName].push(metric);
    }
    return acc;
  }, {} as { [key: string]: ProgressMetricDto[] });

  return (
    <Card className="p-6">
      <h3 className="text-2xl md:text-3xl font-semibold mb-6 text-[#333333]">Progress Summary</h3>
      {Object.keys(groupedMetrics).length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No progress data available yet. Start logging your metrics!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedMetrics).map(([metricName, metrics]) => (
            <div key={metricName}>
              <h4 className="text-xl font-semibold mb-4">{metricName}</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={metrics.sort((a, b) => new Date(a.date ?? '').getTime() - new Date(b.date ?? '').getTime())}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(dateStr) => new Date(dateStr).toLocaleDateString()} />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="metricValue" stroke="#1B998B" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default ProgressChart;