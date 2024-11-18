import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function TaskMetricsChart({ data }) {
  // Transform the input data for the chart
  const transformedData = data.map(item => ({
    name: item.name,
    task: item.task,
    date: new Date(item.date).toLocaleDateString(),
    charges: parseFloat(item.charges) || 0
  }));

  // Custom tooltip to show all relevant information
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border rounded shadow-lg">
          <p className="font-bold text-sm">{`Employee: ${data.name}`}</p>
          <p className="text-sm">{`Task: ${data.task}`}</p>
          <p className="text-sm">{`Date: ${data.date}`}</p>
          <p className="text-sm text-blue">{`Charges: $${data.charges}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-96 p-4">
      <h2 className="text-xl font-bold text-gray-700 mb-4 text-center">Employee Task Metrics</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={transformedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45}
            textAnchor="end"
            interval={0}
            height={80}
          />
          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="charges"
            fill="#8884d8"
            name="Charges ($)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}