import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";
import { useSelector } from "react-redux";

const SalesIncomeChart = () => {
  const [type, setType] = useState("weekly");
  const theme = useSelector((state) => state.admin.theme); // or however you store theme

  // const [salesData, setSalesData] = useState([]);
  // const [incomeData, setIncomeData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const weekMap = {
    1: "Sun",
    2: "Mon",
    3: "Tue",
    4: "Wed",
    5: "Thu",
    6: "Fri",
    7: "Sat",
  };

  const monthMap = {
    1: "Jan",
    2: "Feb",
    3: "Mar",
    4: "Apr",
    5: "May",
    6: "Jun",
    7: "Jul",
    8: "Aug",
    9: "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dec",
  };

  const transformData = (data) => {
    return data.map((item) => ({
      label:
        type === "weekly"
          ? weekMap[item._id]
          : type === "monthly"
            ? monthMap[item._id]
            : item._id.toString(),
      sales: item.sales,
      income: item.income,
    }));
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/admin/getSalesIncomeStats?type=${type}`,
        {
          withCredentials: true,
        }
      );
      const transformed = transformData(res.data.data);
      setChartData(transformed);
    } catch (error) {
      console.error("Error fetching chart data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [type]);

  const getXAxisLabel = () => {
    if (type === "weekly") return "Day of Week";
    if (type === "monthly") return "Day of Month";
    return "Year";
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Sales & Income Stats</h2>
        <select
          className="p-2 border rounded dark:bg-black dark:text-white"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {/* Sales Chart */}
      <div className="my-8">
        <h3 className="text-lg font-semibold mb-2">Sales Chart</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 20, bottom: 5, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              className="my-2"
              dataKey="label"
              stroke={theme === "dark" ? "#fff" : "#000"}
            >
              <Label
                value={getXAxisLabel()}
                offset={-10}
                position="insideBottom"
                style={{
                  fill: theme === "dark" ? "#fff" : "#555", // text color
                  fontSize: 14,
                  fontWeight: 500,
                }}
              />
            </XAxis>
            <YAxis
              stroke={theme === "dark" ? "#fff" : "#000"}
              label={{
                value: "Sales",
                angle: -90,
                position: "insideLeft",
                fontSize: 14,
                fontWeight: 500,
                fill: theme === "dark" ? "#fff" : "#555",
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === "dark" ? "#1f2937" : "#fff",
                borderColor: theme === "dark" ? "#4b5563" : "#ccc",
              }}
              labelStyle={{
                color: theme === "dark" ? "#fff" : "#000",
              }}
              itemStyle={{
                color: theme === "dark" ? "#fff" : "#000",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Income Chart */}
      <div className="my-8">
        <h3 className="text-lg font-semibold mb-2">Income Chart</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 20, bottom: 5, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis stroke={theme === "dark" ? "#fff" : "#000"} dataKey="label">
              <Label
                value={getXAxisLabel()}
                offset={-10}
                position="insideBottom"
                style={{
                  fill: theme === "dark" ? "#fff" : "#555", // text color
                  fontSize: 14,
                  fontWeight: 500,
                }}
              />
            </XAxis>
            <YAxis
              stroke={theme === "dark" ? "#fff" : "#000"}
              label={{
                value: "Income (Rs)",
                angle: -90,
                position: "insideLeft",
                fontSize: 14,
                fontWeight: 500,
                fill: theme === "dark" ? "#fff" : "#555",
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === "dark" ? "#1f2937" : "#fff",
                borderColor: theme === "dark" ? "#4b5563" : "#ccc",
              }}
              labelStyle={{
                color: theme === "dark" ? "#fff" : "#000",
              }}
              itemStyle={{
                color: theme === "dark" ? "#fff" : "#000",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#82ca9d"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesIncomeChart;
