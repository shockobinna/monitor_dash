
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function LineChartExample({ data }) {
  return (
    <ResponsiveContainer width="100%" height={370}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="process_date" angle={-33} textAnchor="end" height={60} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="C47" stroke="#8884d8" />
        <Line type="monotone" dataKey="C51" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
}

