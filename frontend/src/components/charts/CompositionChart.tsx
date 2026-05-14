import { useUrbanStore } from "@/store/useUrbanStore";
import { SEGMENTS } from "@/config/segments";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

export function CompositionChart() {
  const { selectedSegment } = useUrbanStore();
  const weights = SEGMENTS[selectedSegment];

  if (!weights) return null;

  const data = [
    { name: "Infraestrutura", value: (weights.infra.dens + weights.infra.mob) * weights.balance.infra * 100, color: "#334155" },
    { name: "Mercado", value: (weights.market.central + weights.market.pop + weights.market.idade) * weights.balance.market * 100, color: "#2563EB" },
    { name: "Risco", value: weights.alpha * 100, color: "#EF4444" }
  ];

  return (
    <div className="w-full h-full flex flex-col pt-4">
      <h3 className="font-semibold text-lg px-6 mb-4">Arquitetura de Pesos ({selectedSegment})</h3>
      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`${value.toFixed(1)}%`, "Peso Efetivo"]}
              contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
