import React, { useMemo } from 'react';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer, ArcLayer, PathLayer, TextLayer } from '@deck.gl/layers';
import { HeatmapLayer } from '@deck.gl/geo-layers';
import { useLogisenseStore } from '../store/useLogisenseStore';

const INITIAL_VIEW_STATE = {
  longitude: 73.8567,
  latitude: 18.5204,
  zoom: 12,
  pitch: 45,
  bearing: 0
};

export default function Map3D() {
  const { vehicles, disruptions, optimizationResult, setSelectedVehicleId } = useLogisenseStore();

  const vehicleLayer = useMemo(() => {
    const data = Object.values(vehicles).map(v => ({
      position: [v.current_lng, v.current_lat],
      color: v.status === 'delayed' ? [234, 179, 8] : v.status === 'deviated' ? [239, 68, 68] : [34, 197, 94],
      id: v.vehicle_id
    }));

    return new ScatterplotLayer({
      id: 'vehicle-layer',
      data,
      pickable: true,
      opacity: 0.8,
      stroked: true,
      filled: true,
      radiusScale: 6,
      radiusMinPixels: 6,
      radiusMaxPixels: 20,
      lineWidthMinPixels: 1,
      getPosition: d => d.position,
      getFillColor: d => d.color,
      getLineColor: [255, 255, 255],
      onClick: ({object}) => object && setSelectedVehicleId(object.id),
      updateTriggers: {
        getPosition: [data],
        getFillColor: [data]
      }
    });
  }, [vehicles, setSelectedVehicleId]);

  const pathLayer = useMemo(() => {
    const data = Object.values(vehicles).map(v => ({
      path: v.assigned_route.map(r => [r.lng, r.lat]),
      color: [59, 130, 246, 100]
    }));

    return new PathLayer({
      id: 'path-layer',
      data,
      pickable: false,
      widthScale: 20,
      widthMinPixels: 2,
      getPath: d => d.path,
      getColor: d => d.color,
      getWidth: d => 5
    });
  }, [vehicles]);

  const heatmapLayer = useMemo(() => {
    const data = disruptions.map(d => {
      const zoneMap: any = {
        'zone_A': [73.85, 18.52],
        'zone_B': [73.86, 18.51],
        'zone_C': [73.84, 18.53],
        'zone_D': [73.87, 18.50],
        'zone_E': [73.86, 18.54]
      };
      return {
        position: zoneMap[d.location] || [73.8567, 18.5204],
        weight: d.severity_score || 0.5
      };
    });

    return new HeatmapLayer({
      id: 'heatmap-layer',
      data,
      getPosition: d => d.position,
      getWeight: d => d.weight,
      radiusPixels: 60,
      intensity: 1,
      threshold: 0.1
    });
  }, [disruptions]);

  const arcLayer = useMemo(() => {
    if (!optimizationResult) return null;
    const data = Object.values(vehicles).map(v => ({
      source: [v.current_lng, v.current_lat],
      target: [v.assigned_route[v.assigned_route.length-1].lng, v.assigned_route[v.assigned_route.length-1].lat],
      color: [250, 204, 21, 200]
    }));

    return new ArcLayer({
      id: 'arc-layer',
      data,
      getSourcePosition: d => d.source as [number, number],
      getTargetPosition: d => d.target as [number, number],
      getSourceColor: d => d.color as [number, number, number, number],
      getTargetColor: d => d.color as [number, number, number, number],
      getWidth: 4
    });
  }, [optimizationResult, vehicles]);

  const textLayer = useMemo(() => {
    const data = Object.values(vehicles).map(v => ({
      position: [v.current_lng, v.current_lat],
      text: v.vehicle_id
    }));

    return new TextLayer({
      id: 'text-layer',
      data,
      getPosition: d => d.position,
      getText: d => d.text,
      getSize: 14,
      getColor: [255, 255, 255],
      getPixelOffset: [0, -20]
    });
  }, [vehicles]);

  const layers = [heatmapLayer, pathLayer, arcLayer, vehicleLayer, textLayer].filter(Boolean);

  return (
    <div className="absolute inset-0 bg-[#020617] overflow-hidden">
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={layers}
      />
    </div>
  );
}
