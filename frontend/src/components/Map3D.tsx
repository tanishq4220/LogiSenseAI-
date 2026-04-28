import { useMemo } from "react";
import DeckGL from "@deck.gl/react";
import { TileLayer } from "@deck.gl/geo-layers";
import { BitmapLayer, PathLayer, ScatterplotLayer } from "@deck.gl/layers";
import type { MapViewState } from "@deck.gl/core";

// ─── Initial camera ───────────────────────────────────────────────────────────
const INITIAL_VIEW_STATE: MapViewState = {
  longitude: 73.4,
  latitude: 18.8,
  zoom: 7,
  pitch: 45,
  bearing: 0,
};

const DEFAULT_ROUTE = [
  [73.8567, 18.5204],
  [73.6843, 18.7548],
  [73.1812, 19.033],
  [72.8777, 19.076],
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function Map3D({ route }: { route?: number[][] }) {
  const safeRoute = route && route.length > 1 ? route : DEFAULT_ROUTE;

  const layers = useMemo(
    () => [
      // ✅ TileLayer renders the dark basemap INSIDE DeckGL's own canvas.
      // Because tiles and data layers share one canvas, scroll/zoom applies
      // to everything at once — no react-map-gl sync needed.
      new TileLayer({
        id: "basemap-tiles",
        // CartoDB Dark Matter raster tiles (free, no API key)
        data: "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
        minZoom: 0,
        maxZoom: 19,
        tileSize: 256,
        renderSubLayers: (props: any) => {
          const { boundingBox } = props.tile;
          return new BitmapLayer(props, {
            data: undefined,
            image: props.data,
            bounds: [
              boundingBox[0][0],
              boundingBox[0][1],
              boundingBox[1][0],
              boundingBox[1][1],
            ],
          });
        },
      }),

      // Route path
      new PathLayer({
        id: "route-path",
        data: [{ path: safeRoute }],
        getPath: (d: any) => d.path,
        getColor: () => [0, 255, 200],
        widthMinPixels: 4,
      }),

      // Start / end markers
      new ScatterplotLayer({
        id: "route-points",
        data: [
          { pos: safeRoute[0], color: [0, 255, 100] },
          { pos: safeRoute[safeRoute.length - 1], color: [255, 80, 0] },
        ],
        getPosition: (d: any) => d.pos,
        getFillColor: (d: any) => d.color,
        getRadius: 5000,
      }),
    ],
    [safeRoute]
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        inset: 0,
        overflow: "hidden",
      }}
    >
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={layers}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          inset: 0,
        }}
      />
    </div>
  );
}
