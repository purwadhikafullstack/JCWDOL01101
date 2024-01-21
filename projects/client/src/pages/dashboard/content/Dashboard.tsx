import { cn, formatToIDR } from "@/lib/utils";
import React from "react";
import { Helmet } from "react-helmet";
import {
  ShoppingBasket,
  FileSearch,
  Rocket,
  Layers,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import Revenue from "../components/overview/Revenue";
import { useGetOverviewKpi } from "@/hooks/useOrder";
import HighestSellingProduct from "../components/overview/HighestSellingProduct";

const KPI = [
  {
    icon: <ShoppingBasket className="w-4 h-4" />,
    format: (value: number | string) => formatToIDR(value),
  },
  {
    icon: <FileSearch className="w-4 h-4" />,
    format: (value: number | string) => formatToIDR(value),
  },
  {
    icon: <Layers className="w-4 h-4" />,
    format: (value: number | string) => `${value} orders`,
  },
  {
    icon: <Rocket className="w-4 h-4" />,
    format: (value: number | string) => `${value}%`,
  },
];

const Dashboard = () => {
  const { data } = useGetOverviewKpi();
  return (
    <>
      <Helmet>
        <title>Dashboard | Overview</title>
      </Helmet>
      <main className="space-y-4">
        <div className="grid grid-cols-4 gap-4">
          {data &&
            data.kpi.map((kpi, i) => (
              <div key={kpi.title} className="border rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="p-2 rounded-md bg-secondary text-primary">
                      {KPI[i].icon}
                    </span>
                    <p className="text-muted-foreground">{kpi.title}</p>
                  </span>
                </div>
                <h3 className="text-xl font-bold mt-4">
                  {KPI[i].format(kpi.metric.toFixed(0))}
                </h3>
                {kpi.delta !== 0 && (
                  <span className={cn(" flex items-center gap-2")}>
                    {kpi.delta < 0 ? (
                      <TrendingDown className="w-4 h-4 text-primary" />
                    ) : (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    )}
                    <p
                      className={cn(
                        "text-green-500 text-sm font-bold",
                        kpi.delta < 0 && "text-primary"
                      )}
                    >
                      {kpi.delta.toFixed(2)}%{" "}
                    </p>
                    <p className="font-normal text-sm text-muted-foreground">
                      vs last month
                    </p>
                  </span>
                )}
              </div>
            ))}
        </div>
        <Revenue />
        <div className="col-span-3 border rounded-lg shadow-sm p-4">
          <h3 className="mb-4 font-bold">Best Selling Product</h3>
          <HighestSellingProduct />
        </div>
      </main>
    </>
  );
};

export default Dashboard;
