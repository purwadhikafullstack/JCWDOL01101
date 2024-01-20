import { useGetOverviewRevenue } from "@/hooks/useOrder";
import React from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { format } from "date-fns";
import { convertToJt } from "@/lib/utils";
import TopCategory from "./TopCategory";

const CustomizedAxisTick = (props: any) => {
  const { x, y, payload } = props;
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="end"
        fill="#666"
        transform="rotate(-35)"
      >
        {format(new Date(2024, payload.value - 1), "MMM")}
      </text>
    </g>
  );
};

const CustomizedYAxisTick = (props: any) => {
  const { x, y, payload } = props;
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="end" fill="#666">
        {convertToJt(payload.value)}
      </text>
    </g>
  );
};

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/70 backdrop-blur-sm rounded-lg p-2 border shadow-sm">
        <p className="text-muted-foreground">
          {format(new Date(2024, label - 1), "MMM")}
        </p>
        <p className="text-primary">{convertToJt(payload[0].value)}</p>
      </div>
    );
  }

  return null;
};
const Revenue = () => {
  const { data: revenue } = useGetOverviewRevenue();
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-3 border rounded-lg shadow-sm p-4">
        <h3 className="font-bold">Revenue</h3>
        <div className="h-[300px]">
          {revenue && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                width={500}
                height={400}
                data={revenue}
                margin={{
                  top: 20,
                  right: 30,
                  left: 0,
                  bottom: 40,
                }}
              >
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff2042" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ff2042" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={<CustomizedAxisTick />} />
                <YAxis tick={<CustomizedYAxisTick />} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="totalPrice"
                  stackId="1"
                  stroke="#e11d48"
                  fill="url(#colorUv)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      <TopCategory />
    </div>
  );
};

export default Revenue;
