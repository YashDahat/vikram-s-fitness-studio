import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ProgressMetricDto } from '@/types/progress';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useMemo } from 'react';

interface ProgressHistoryChartProps {
  progressMetrics: ProgressMetricDto[];
}

const ProgressHistoryChart: React.FC<ProgressHistoryChartProps> = ({ progressMetrics }) => {
  const [selectedMetric, setSelectedMetric] = useState<string>('');

  const uniqueMetricNames = useMemo(() => {
    const names = new Set<string>();
    progressMetrics.forEach(metric => {
      if (metric.metricName) {
        names.add(metric.metricName);
      }
    });
    return Array.from(names);
  }, [progressMetrics]);

  const filteredData = useMemo(() => {
    if (!selectedMetric) {
      return [];
    }
    return progressMetrics
      .filter(metric => metric.metricName === selectedMetric)
      .sort((a, b) => new Date(a.date ?? '').getTime() - new Date(b.date ?? '').getTime())
      .map(metric => ({
        date: metric.date ? new Date(metric.date).toLocaleDateString() : 'N/A',
        value: metric.metricValue ?? 0,
      }));
  }, [progressMetrics, selectedMetric]);

  if (progressMetrics.length === 0) {
    return (
      <Card className="p-6 text-center text-gray-500">
        No progress data available. Log some metrics to see your history!
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Progress History</h3>
      <div className="mb-4">
        <Select onValueChange={setSelectedMetric} value={selectedMetric}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Metric" />
          </SelectTrigger>
          <SelectContent>
            {uniqueMetricNames.map(name => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedMetric && filteredData.length > 0 ? (
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={filteredData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#1B998B" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-10">
          {selectedMetric ? 'No data for the selected metric.' : 'Please select a metric to view its history.'}
        </div>
      )}
    </Card>
  );
};

export default ProgressHistoryChart;