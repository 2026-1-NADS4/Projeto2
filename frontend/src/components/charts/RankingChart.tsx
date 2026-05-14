import { useUrbanStore } from "@/store/useUrbanStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function RankingChart() {
  const { districts } = useUrbanStore();
  const top10 = districts.slice(0, 10);

  return (
    <div className="w-full h-full flex flex-col pt-4">
      <h3 className="font-semibold text-lg px-6 mb-4">Top 10 Distritos (UrbanScore)</h3>
      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={top10}
            layout="vertical"
            margin={{ top: 0, right: 30, left: 40, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.3} />
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis
              dataKey="nm_dist"
              type="category"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "currentColor", fontSize: 12, fontWeight: 500 }}
            />
            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.05)" }}
              contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              formatter={(value: number) => [value.toFixed(1), "UrbanScore"]}
            />
            <Bar
              dataKey="UrbanScore"
              fill="#2563EB"
              radius={[0, 4, 4, 0]}
              barSize={20}
              label={{ position: 'right', fill: "currentColor", fontSize: 12, formatter: (v: number) => v.toFixed(1) }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
