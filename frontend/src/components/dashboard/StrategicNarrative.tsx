import type { DistrictData } from "@/types";

interface StrategicNarrativeProps {
  topDistrict: DistrictData;
  segment: string;
}

export function StrategicNarrative({ topDistrict, segment }: StrategicNarrativeProps) {
  const score = topDistrict.UrbanScore || 0;
  
  let boxColor, boxBg, statusLabel;
  if (score >= 75) {
    boxColor = "#22C55E";
    boxBg = "rgba(34, 197, 94, 0.05)";
    statusLabel = "ALTA ADERÊNCIA";
  } else if (score >= 50) {
    boxColor = "#EAB308";
    boxBg = "rgba(234, 179, 8, 0.05)";
    statusLabel = "ADERÊNCIA MODERADA";
  } else {
    boxColor = "#EF4444";
    boxBg = "rgba(239, 68, 68, 0.05)";
    statusLabel = "BAIXA ADERÊNCIA";
  }

  const cDesc = topDistrict.central_norm > 0.7 ? "Alta Centralidade Econômica" : topDistrict.central_norm > 0.3 ? "Centralidade em Consolidação" : "Baixa Influência Econômica";
  const mDesc = topDistrict.mob_norm > 0.6 ? "Elevado Fluxo Urbano" : "Fluxo Urbano Localizado";
  const rDesc = (topDistrict.RiskScore || 0) < 0.4 ? "Risco Operacional Controlado" : "⚠️ Alerta de Risco Estrutural";
  const dDesc = topDistrict.dens_norm > 0.6 ? "Alta Densidade de Público" : "Baixa Densidade Populacional";

  return (
    <div 
      className="p-6 rounded-2xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
      style={{ backgroundColor: boxBg, borderLeft: `8px solid ${boxColor}` }}
    >
      <div className="flex-2">
        <h2 className="mt-0 mb-2 font-bold flex items-center gap-2" style={{ color: boxColor }}>
          🎯 {statusLabel}
        </h2>
        <p className="text-lg mb-4 text-foreground/80">
          Segmento: <span className="font-bold">{segment}</span>
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold m-0 text-foreground">
          {topDistrict.nm_dist}
        </h1>
        <p className="mt-4 text-muted-foreground font-medium text-lg">Justificativa de Performance:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-foreground/90 text-lg">
          <li><b>Eixo Econômico:</b> {cDesc}.</li>
          <li><b>Mobilidade:</b> {mDesc}.</li>
          <li><b>Segurança/Vulnerabilidade:</b> {rDesc}.</li>
          <li><b>Demografia:</b> {dDesc}.</li>
        </ul>
      </div>

      <div className="flex-1 min-w-[200px] text-right bg-card p-6 rounded-xl shadow-sm border">
        <p className="m-0 text-muted-foreground uppercase text-xs tracking-widest font-semibold mb-1">
          UrbanScore
        </p>
        <h1 className="m-0 text-6xl font-black" style={{ color: boxColor }}>
          {score.toFixed(1)}
        </h1>
        <p className="m-0 mt-2 font-bold uppercase text-sm" style={{ color: boxColor }}>
          {statusLabel}
        </p>
      </div>
    </div>
  );
}
