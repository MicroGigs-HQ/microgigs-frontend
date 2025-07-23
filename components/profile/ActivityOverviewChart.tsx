import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { TrendingUp } from "lucide-react";

export const ActivityOverviewChart: React.FC = () => {
  interface ActivityData {
    name: string;
    tasks: number;
    color: string;
  }

  const data: ActivityData[] = [
    { name: "Mon", tasks: 8, color: "#FF3C02" },
    { name: "Tue", tasks: 15, color: "#FF6B35" },
    { name: "Wed", tasks: 12, color: "#FF8C42" },
    { name: "Thu", tasks: 20, color: "#FFB84D" },
    { name: "Fri", tasks: 25, color: "#4ECDC4" },
    { name: "Sat", tasks: 6, color: "#45B7D1" },
    { name: "Sun", tasks: 10, color: "#96CEB4" },
  ];

  // Calculate total and average for stats
  const totalTasks = data.reduce((sum, item) => sum + item.tasks, 0);
  const avgTasks = Math.round(totalTasks / data.length);
  const maxDay = data.reduce((max, item) => item.tasks > max.tasks ? item : max);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800">{`${label}`}</p>
          <p className="text-sm text-gray-600">
            <span className="inline-block w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: payload[0].payload.color }}></span>
            {`Tasks: ${payload[0].value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            Activity Overview
          </h3>
          <p className="text-sm text-gray-500">Weekly task completion</p>
        </div>
        <div className="flex items-center text-green-600">
          <TrendingUp className="w-4 h-4 mr-1" />
          <span className="text-sm font-medium">+12% this week</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-800">{totalTasks}</p>
          <p className="text-xs text-gray-500">Total Tasks</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-800">{avgTasks}</p>
          <p className="text-xs text-gray-500">Daily Average</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-800">{maxDay.tasks}</p>
          <p className="text-xs text-gray-500">Best Day ({maxDay.name})</p>
        </div>
      </div>

      <div className="h-64 w-full">
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-gray-400" />
              </div>
              <p className="font-medium text-gray-700 mb-1">No activity data yet</p>
              <p className="text-sm text-gray-500">
                Complete tasks to see your activity chart
              </p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data} 
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barCategoryGap="25%"
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#f0f0f0" 
                horizontal={true}
                vertical={false}
              />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                domain={[0, 'dataMax + 2']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="tasks" 
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center mt-4 space-x-4 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#FF3C02] to-[#FFB84D] mr-2"></div>
          <span className="text-gray-600">Weekdays</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#4ECDC4] to-[#96CEB4] mr-2"></div>
          <span className="text-gray-600">Weekends</span>
        </div>
      </div>
    </div>
  );
};