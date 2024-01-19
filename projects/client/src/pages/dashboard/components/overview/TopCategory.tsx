import React from "react";
import { useGetOverviewTopCategory } from "@/hooks/useOrder";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#e11d48", "#FFBB28", "#FF8042", "#9ca3af"];
const COLORS_TW = [
  "bg-[#e11d48]",
  "bg-[#FFBB28]",
  "bg-[#FF8042]",
  "bg-[#9ca3af]",
];

const CustomTooltip: React.FC<any> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/70 backdrop-blur-sm rounded-lg p-2 border shadow-sm">
        <p className="text-foreground">{payload[0].value}</p>
      </div>
    );
  }

  return null;
};
const TopCategory = () => {
  const { data: topCategory } = useGetOverviewTopCategory();

  return (
    <div className="border rounded-lg shadow-sm p-4 flex flex-col">
      <h3 className="font-bold">Top Category</h3>
      {topCategory && (
        <div className="flex flex-col items-center justify-between h-full">
          <PieChart width={200} height={200}>
            <Pie
              data={topCategory}
              cx={100}
              cy={100}
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="total"
            >
              {topCategory.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
          <div className="flex items-center gap-2 flex-wrap">
            {topCategory.map((category, index) => {
              const colorIndex = index % COLORS_TW.length;
              return (
                category.total > 0 && (
                  <div key={category.title} className="flex items-center">
                    <div
                      className={`${COLORS_TW[colorIndex]} w-2 h-2 rounded-full mr-2`}
                    ></div>
                    <p className="text-muted-foreground">{category.title}</p>
                  </div>
                )
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopCategory;
