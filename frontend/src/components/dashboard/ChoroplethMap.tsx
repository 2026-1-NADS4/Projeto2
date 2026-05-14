import React, { useEffect, useState, useMemo } from "react";
import { useUrbanStore } from "@/store/useUrbanStore";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import L from "leaflet";

// Fix for default Leaflet icon issue in React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export function ChoroplethMap() {
  const { districts } = useUrbanStore();
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    fetch("/distritos-sp.geojson")
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error("Error loading GeoJSON", err));
  }, []);

  const districtMap = useMemo(() => {
    const map = new Map();
    districts.forEach(d => map.set(d.nm_dist.toUpperCase(), d));
    districts.forEach(d => map.set(d.nm_dist, d));
    return map;
  }, [districts]);

  const getColor = (score: number | undefined) => {
    if (score === undefined || score === null) return "#4A4F57"; // Steel Gray for no data
    
    const t = Math.max(0, Math.min(100, score)) / 100;
    const r = Math.round(254 + t * (196 - 254));
    const g = Math.round(226 + t * (18 - 226));
    const b = Math.round(226 + t * (48 - 226));
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  const mapStyle = (feature: any) => {
    const districtName = feature.properties.ds_nome || feature.properties.NOME_DIST || "";
    const dData = districtMap.get(districtName.toUpperCase()) || districtMap.get(districtName);
    const score = dData?.UrbanScore;

    return {
      fillColor: getColor(score),
      weight: 1,
      opacity: 1,
      color: "white",
      fillOpacity: 0.7,
    };
  };

  const onEachFeature = (feature: any, layer: any) => {
    const districtName = feature.properties.ds_nome || feature.properties.NOME_DIST || "";
    const dData = districtMap.get(districtName.toUpperCase()) || districtMap.get(districtName);
    const score = dData?.UrbanScore;

    if (dData) {
      layer.bindTooltip(
        `<div>
          <b style="font-size: 14px">${dData.nm_dist}</b><br/>
          UrbanScore: <b style="color: #C41230">${score?.toFixed(1)}</b><br/>
          Pop: ${dData.populacao?.toLocaleString()}
        </div>`,
        { sticky: true }
      );
    } else {
      layer.bindTooltip(`<b>${districtName}</b><br/>Sem dados`, { sticky: true });
    }

    layer.on({
      mouseover: (e: any) => {
        const l = e.target;
        l.setStyle({
          fillOpacity: 0.9,
          weight: 2,
          color: "#C41230",
        });
      },
      mouseout: (e: any) => {
        const l = e.target;
        l.setStyle({
          fillOpacity: 0.7,
          weight: 1,
          color: "white",
        });
      },
    });
  };

  if (!geoData) {
    return (
      <Card className="min-h-[600px] flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Carregando malha territorial...</p>
      </Card>
    );
  }

  return (
    <Card className="min-h-[600px] overflow-hidden relative border-none bg-transparent">
      <CardHeader className="bg-card/50 backdrop-blur-sm z-[1000] relative rounded-t-xl border">
        <CardTitle>Distribuição Territorial do UrbanScore</CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-[600px] relative border rounded-b-xl overflow-hidden">
        <MapContainer
          center={[-23.5505, -46.6333]}
          zoom={11}
          style={{ width: "100%", height: "100%", background: "#1A1C1E" }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          {geoData && (
            <GeoJSON
              data={geoData}
              style={mapStyle}
              onEachFeature={onEachFeature}
            />
          )}
        </MapContainer>
        
        {/* Map Legend */}
        <div className="absolute bottom-6 right-6 bg-card/90 backdrop-blur-md p-4 rounded-xl border shadow-xl z-[1000] text-xs min-w-[120px]">
          <p className="font-bold mb-3 text-sm">UrbanScore</p>
          <div className="flex items-center gap-1 h-4 mb-2">
            <div className="flex-1 h-full" style={{background: "linear-gradient(to right, #fee2e2, #C41230)"}}></div>
          </div>
          <div className="flex justify-between w-full text-muted-foreground font-medium">
            <span>0</span>
            <span>100</span>
          </div>
          <div className="mt-3 pt-3 border-t flex flex-col gap-2 text-[10px]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#4A4F57] rounded-sm"></div>
              <span>Fora de SP Capital</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
