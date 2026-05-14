import { useState } from "react";
import { useUrbanStore } from "@/store/useUrbanStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
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

export function Compare() {
  const { districts, selectedSegment } = useUrbanStore();
  
  const [distA, setDistA] = useState<string>(districts[0]?.nm_dist || "");
  const [distB, setDistB] = useState<string>(districts[1]?.nm_dist || "");

  if (!districts.length) return <div>Carregando...</div>;

  const dataA = districts.find(d => d.nm_dist === distA) || districts[0];
  const dataB = districts.find(d => d.nm_dist === distB) || districts[1];

  const keyA = `${dataA.nm_dist} (A)`;
  const keyB = `${dataB.nm_dist} (B)`;

  const comparisonData = [
    {
      metric: "Oportunidade (Score)",
      [keyA]: Number(((dataA.OpportunityScore || 0) * 100).toFixed(1)),
      [keyB]: Number(((dataB.OpportunityScore || 0) * 100).toFixed(1)),
    },
    {
      metric: "Infraestrutura",
      [keyA]: Number(((dataA.InfraScore || 0) * 100).toFixed(1)),
      [keyB]: Number(((dataB.InfraScore || 0) * 100).toFixed(1)),
    },
    {
      metric: "Mercado",
      [keyA]: Number(((dataA.MarketScore || 0) * 100).toFixed(1)),
      [keyB]: Number(((dataB.MarketScore || 0) * 100).toFixed(1)),
    },
    {
      metric: "Risco Social/Criminal",
      [keyA]: Number(((dataA.RiskScore || 0) * 100).toFixed(1)),
      [keyB]: Number(((dataB.RiskScore || 0) * 100).toFixed(1)),
    },
    {
      metric: "UrbanScore (Final)",
      [keyA]: Number((dataA.UrbanScore || 0).toFixed(1)),
      [keyB]: Number((dataB.UrbanScore || 0).toFixed(1)),
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Comparação Territorial</h1>
        <p className="text-muted-foreground mt-2">
          Análise direta para o segmento <b>{selectedSegment}</b>.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex-1">
          <label className="text-sm font-semibold mb-2 block text-primary">Distrito A</label>
          <select 
            value={distA} 
            onChange={e => setDistA(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            {districts.map(d => <option key={`A-${d.nm_dist}`} value={d.nm_dist}>{d.nm_dist}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="text-sm font-semibold mb-2 block text-slate-500">Distrito B</label>
          <select 
            value={distB} 
            onChange={e => setDistB(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            {districts.map(d => <option key={`B-${d.nm_dist}`} value={d.nm_dist}>{d.nm_dist}</option>)}
          </select>
        </div>
      </div>

      <Card className="min-h-[500px]">
        <CardHeader>
          <CardTitle>Desempenho: {dataA.nm_dist} vs {dataB.nm_dist}</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={comparisonData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} vertical={false} />
              <XAxis dataKey="metric" />
              <YAxis />
              <Tooltip cursor={{ fill: "rgba(0,0,0,0.05)" }} />
              <Legend />
              <Bar dataKey={keyA} fill="#C41230" radius={[4, 4, 0, 0]} />
              <Bar dataKey={keyB} fill="#4A4F57" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
