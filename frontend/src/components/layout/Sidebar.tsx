import { useUrbanStore } from "@/store/useUrbanStore";
import { SEGMENTS } from "@/config/segments";
import { Map, BarChart3, Settings, ShieldAlert } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function Sidebar() {
  const { selectedSegment, setSegment } = useUrbanStore();
  const location = useLocation();

  return (
    <aside className="w-64 border-r bg-card h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight text-primary">URBANIS</h1>
        <p className="text-sm text-muted-foreground mt-1">SaaS Territorial Engine</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        <Link 
          to="/dashboard"
          className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium cursor-pointer transition-colors ${location.pathname === '/dashboard' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent/50'}`}
        >
          <BarChart3 className="w-4 h-4" />
          Dashboard (Ranking)
        </Link>
        <Link 
          to="/compare"
          className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium cursor-pointer transition-colors ${location.pathname === '/compare' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent/50'}`}
        >
          <Map className="w-4 h-4" />
          Compare Districts
        </Link>
      </nav>

      <div className="p-4 border-t">
        <div className="mb-2">
          <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider flex items-center gap-2">
            <Settings className="w-3 h-3" />
            Configuração B2B
          </span>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Segmento de Mercado</label>
          <select
            value={selectedSegment}
            onChange={(e) => setSegment(e.target.value)}
            className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {Object.keys(SEGMENTS).map((segment) => (
              <option key={segment} value={segment}>
                {segment}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mt-4 p-3 bg-secondary rounded-md">
          <div className="flex items-center gap-2 text-sm font-semibold text-secondary-foreground mb-1">
            <ShieldAlert className="w-4 h-4 text-primary" />
            Sensibilidade ao Risco
          </div>
          <p className="text-xs text-muted-foreground">
            O segmento atual tem um multiplicador de risco de <span className="font-bold text-foreground">{(SEGMENTS[selectedSegment]?.alpha || 0) * 100}%</span>.
          </p>
        </div>
      </div>
    </aside>
  );
}
