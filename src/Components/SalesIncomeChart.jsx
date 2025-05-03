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
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useSelector } from "react-redux";

const SalesIncomeChart = () => {
  const [type, setType] = useState("weekly");
  const theme = useSelector((state) => state.admin.theme); // or however you store theme
  const weeks = [];
  const [selectedWeek, setSelectedWeek] = useState(""); // format: "YYYY-MM-DD"

  const getWeeksInCurrentMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed

    let date = new Date(year, month, 1);
    while (date.getMonth() === month) {
      const startOfWeek = new Date(date);
      const endOfWeek = new Date(date);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      if (endOfWeek.getMonth() !== month) {
        endOfWeek.setMonth(month);
        endOfWeek.setDate(new Date(year, month + 1, 0).getDate()); // last day of month
      }

      weeks.push({
        label: `${startOfWeek.toDateString()} - ${endOfWeek.toDateString()}`,
        startDate: startOfWeek.toISOString().slice(0, 10), // "YYYY-MM-DD"
      });

      date.setDate(date.getDate() + 7);
    }
    return weeks;
  };

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

  // Colors for the donut chart
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
  ];

  // const transformData = (data) => {
  //   return data.map((item) => ({
  //     label:
  //       type === "weekly"
  //         ? weekMap[item._id]
  //         : type === "monthly"
  //           ? monthMap[item._id]
  //           : item._id.toString(),
  //     sales: item.sales,
  //     income: item.income,
  //     ordersPaid: item.ordersPaid || 0,
  //     visitorCount: item.visitorCount || 0,
  //   }));
  // };
  const transformData = (data) => {
    // Sort based on type for correct order
    const sorted = [...data].sort((a, b) => {
      if (type === "yearly") return a._id - b._id;
      if (type === "monthly")
        return a._id.month - b._id.month || a._id.year - b._id.year;
      if (type === "weekly") return a._id - b._id;
      return 0;
    });

    return sorted.map((item) => {
      let label = "";

      if (type === "weekly") {
        label = weekMap[item._id]; // 1-7 to Sun-Sat
      } else if (type === "monthly") {
        label = `${monthMap[item._id.month]} ${item._id.year}`;
      } else if (type === "yearly") {
        label = item._id.year.toString(); // Year
      }

      return {
        label,
        sales: item.sales,
        income: item.income,
        ordersPaid: item.ordersPaid || 0,
        visitorCount: item.visitorCount || 0,
      };
    });
  };

  const fetchData = async () => {
    try {
      const queryParams = new URLSearchParams({
        type,
      });

      if (type === "weekly" && selectedWeek) {
        queryParams.append("startDate", selectedWeek); // YYYY-MM-DD
        console.log("QueryParams", queryParams.toString());
      }
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/admin/getSalesIncomeStats?${queryParams}`,
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
  }, [type, selectedWeek]);

  const getXAxisLabel = () => {
    if (type === "weekly") return "Day of Week";
    if (type === "monthly") return "Month";
    return "Year";
  };

  // Prepare data for the visitor count donut chart
  const prepareVisitorData = () => {
    const visitorData = chartData
      .filter((item) => item.visitorCount !== undefined)
      .map((item) => ({
        name: item.label,
        value: item.visitorCount,
      }));

    return visitorData.length > 0
      ? visitorData
      : [{ name: "No Data", value: 1 }];
  };

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
      >
        {chartData[index]
          ? `${chartData[index].label} (${(percent * 100).toFixed(0)}%)`
          : ""}
      </text>
    );
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
        {type === "weekly" && (
          <select
            className="p-2 border rounded dark:bg-black dark:text-white ml-4"
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
          >
            <option value="">Select Week</option>
            {getWeeksInCurrentMonth().map((week, index) => (
              <option key={index} value={week.startDate}>
                {week.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Two charts in a row for smaller items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        {/* Orders Paid Bar Chart */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Orders Paid</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 20, bottom: 30, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                stroke={theme === "dark" ? "#fff" : "#000"}
              >
                <Label
                  value={getXAxisLabel()}
                  offset={-10}
                  position="insideBottom"
                  style={{
                    fill: theme === "dark" ? "#fff" : "#555",
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                />
              </XAxis>
              <YAxis
                stroke={theme === "dark" ? "#fff" : "#000"}
                label={{
                  value: "Orders Paid",
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
              <Bar dataKey="ordersPaid" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Visitor Count Donut Chart */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Visitor Count</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={prepareVisitorData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
              >
                {prepareVisitorData().map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
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
                formatter={(value, name, props) => [
                  `Visitors: ${value}`,
                  props.payload.name,
                ]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow my-8">
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
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow my-8">
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
