import { useUrbanStore } from "@/store/useUrbanStore";
import { StrategicNarrative } from "@/components/dashboard/StrategicNarrative";
import { RankingChart } from "@/components/charts/RankingChart";
import { CompositionChart } from "@/components/charts/CompositionChart";
import { ChoroplethMap } from "@/components/dashboard/ChoroplethMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { MapPin, Users, Activity, Target } from "lucide-react";

export function Dashboard() {
  const { districts, selectedSegment } = useUrbanStore();

  if (!districts || districts.length === 0) return <div>Carregando motor de decisão...</div>;

  const topDistrict = districts[0];
  const totalPop = districts.reduce((acc, d) => acc + (d.populacao || 0), 0);
  const avgDens = districts.reduce((acc, d) => acc + (d.dens_demog || 0), 0) / districts.length;
  
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Visão Geral do Mercado</h1>
        <p className="text-muted-foreground mt-2">
          Análise de viabilidade e inteligência territorial para <b>{selectedSegment}</b>.
        </p>
      </div>

      <StrategicNarrative topDistrict={topDistrict} segment={selectedSegment} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Distritos Analisados</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{districts.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">População Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPop.toLocaleString('pt-BR')}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Densidade Média</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(avgDens).toLocaleString('pt-BR')} <span className="text-sm font-normal text-muted-foreground">hab/km²</span></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Score Atual</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{topDistrict.UrbanScore?.toFixed(1)}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="min-h-[400px]">
          <RankingChart />
        </Card>
        <Card className="min-h-[400px]">
          <CompositionChart />
        </Card>
      </div>

      {/* Mapa */}
      <div className="mb-8">
        <ChoroplethMap />
      </div>
    </div>
  );
}
