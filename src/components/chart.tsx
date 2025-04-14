import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid
} from 'recharts';
import { LineChartProps } from './types';

const LineChartComponent: React.FC<LineChartProps> = ({ data, selectedMetric }) => {
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);


  const formattedData = data
    .filter(entry => {
      const entryTime = new Date(entry.timestamp);
      return entry.timestamp && entryTime >= twentyFourHoursAgo && entryTime <= now;
    })
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map(entry => ({
      time: new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      steps: entry.steps,
      heartRate: entry.heartRate,
      water: entry.water,
    }));

 
  const colors = {
    steps: '#8884d8',
    heartRate: '#82ca9d',
    water: '#ff7300',
  };

  
  const metricsToShow =
    selectedMetric === 'all' ? ['steps', 'heartRate', 'water'] : [selectedMetric];

  return (
    <div className="w-full px-4 mt-6" style={{ height: '200px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <XAxis dataKey="time" />
          <YAxis allowDecimals={false} />
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <Tooltip />
          <Legend />
          {metricsToShow.map(metric => (
            <Line
              key={metric}
              type="monotone"
              dataKey={metric}
              stroke={colors[metric]}
              strokeWidth={2}
              dot
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComponent;
