"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface OverviewChartProps {
  data:
    | {
        totalProducts: number;
        totalUsers: number;
        totalUpvotes: number;
        totalCategories: number;
        totalComments: number;
      }
    | number[];
}

const OverviewChart = ({ data }: OverviewChartProps) => {
  const chartData = Array.isArray(data)
    ? data.map((value, index) => ({
        name: `Value ${index + 1}`, // Generic name for array entries
        value: value,
      }))
    : Object.keys(data).map((key) => ({
        name: key,
        value: data[key as keyof typeof data],
      }));

  return (
    <ResponsiveContainer width={"100%"} height={400}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default OverviewChart;
