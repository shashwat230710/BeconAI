import React from 'react';
import { motion } from 'framer-motion';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { Card } from '../components/common/Card';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Mock data: country ISO to density score (0 to 1)
const misinfoDensity = {
  "USA": 0.4,
  "IND": 0.8,
  "BRA": 0.6,
  "GBR": 0.3,
  "RUS": 0.9,
  "CHN": 0.7,
  "ZAF": 0.5,
  "FRA": 0.2,
};

const HeatmapPage = () => {
  const [tooltipContent, setTooltipContent] = React.useState("");

  const getColor = (density) => {
    if (!density) return '#1E293B'; // surface-dark
    if (density > 0.7) return '#DC2626'; // false-red
    if (density > 0.4) return '#D97706'; // misleading-amber
    return '#7C3AED'; // opinion-purple (low misinfo)
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Global Misinformation Heatmap</h1>
        <p className="text-text-secondary text-lg">
          Live tracking of misinformation spread and narrative density across regions.
        </p>
      </div>

      <Card className="p-1 border-white/10 bg-surface-dark overflow-hidden relative">
        <div className="absolute top-6 left-6 z-10 p-4 bg-surface-dark/90 backdrop-blur-md rounded-lg border border-white/10 shadow-xl">
          <h3 className="font-semibold text-sm mb-3">Misinformation Density</h3>
          <div className="space-y-2 text-xs text-text-secondary">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-false-red"></div> Severe (>70%)</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-misleading-amber"></div> Moderate (40-70%)</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-opinion-purple"></div> Low (&lt;40%)</div>
          </div>
        </div>

        <div className="w-full h-[600px] bg-[#0A1628]">
          <ComposableMap projection="geoMercator" projectionConfig={{ scale: 120 }}>
            <ZoomableGroup center={[0, 20]}>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const density = misinfoDensity[geo.id];
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onMouseEnter={() => {
                          setTooltipContent(`${geo.properties.name}: ${density ? (density * 100).toFixed(0) + '%' : 'No data'}`);
                        }}
                        onMouseLeave={() => {
                          setTooltipContent("");
                        }}
                        style={{
                          default: {
                            fill: getColor(density),
                            stroke: '#FFFFFF',
                            strokeWidth: 0.2,
                            outline: 'none',
                          },
                          hover: {
                            fill: '#FFFFFF',
                            stroke: '#000000',
                            strokeWidth: 0.5,
                            outline: 'none',
                          },
                          pressed: {
                            fill: '#FFFFFF',
                            outline: 'none',
                          },
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
        </div>
        
        {tooltipContent && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-2 rounded-full font-bold text-sm shadow-xl">
            {tooltipContent}
          </div>
        )}
      </Card>
    </div>
  );
};

export default HeatmapPage;
