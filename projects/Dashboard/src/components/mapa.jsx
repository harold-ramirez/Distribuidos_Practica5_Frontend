import React, { useRef, useState, useEffect } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import geodata from "../data/DistritosCercado.json";
import axios from "axios";
import { API_BASE_URL } from "../../constants.js";

export default function Mapa() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);

  const center = { lng: -66.16259202670707, lat: -17.400348064136548 };
  const zoom = 10.7;
  maptilersdk.config.apiKey = "kh9U32hnpTT8HLMSSp2r";

  const [medidores, setMedidores] = useState([]);
  const [mapaCalor, setMapaCalor] = useState(null);
  const [showPins, setShowPins] = useState(true);
  const [showLines, setShowLines] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);

  // 1. Fetch datos
  useEffect(() => {
    axios.get(`${API_BASE_URL}/fetchMedidoresHome`)
      .then(res => setMedidores(res.data))
      .catch(err => console.error("Error fetching medidores:", err));

    axios.get(`${API_BASE_URL}/fetchMapaCalor`)
      .then(res => setMapaCalor(res.data))
      .catch(err => console.error("Error fetching mapaCalor:", err));
  }, []);

  // 2. Crear mapa y capas
  useEffect(() => {
    if (!mapContainer.current || !mapaCalor) return;

    // Resetear mapa si ya existe
    if (map.current) {
      map.current.remove();
      map.current = null;
      markersRef.current = [];
    }

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.DATAVIZ.DARK,
      center: [center.lng, center.lat],
      zoom,
    });

    map.current.on("load", () => {
      const posicionesUnicas = new Set();

      // Marcadores
      medidores.forEach(({ latitud, longitud, contrato, cliente, distrito, tipomedidor, tipo }) => {
        const isValid =
          latitud && longitud &&
          !isNaN(latitud) && !isNaN(longitud) &&
          latitud >= -90 && latitud <= 90 &&
          longitud >= -180 && longitud <= 180;

        const key = `${latitud.toFixed(6)},${longitud.toFixed(6)}`;
        if (isValid && !posicionesUnicas.has(key)) {
          posicionesUnicas.add(key);

          const marker = new maptilersdk.Marker({ color: "#FF0000" })
            .setLngLat([longitud, latitud])
            .setPopup(new maptilersdk.Popup({ offset: 25 }).setHTML(`
              <strong>Contrato:</strong> ${contrato}<br/>
              <strong>Cliente:</strong> ${cliente}<br/>
              <strong>Distrito:</strong> ${distrito}<br/>
              <strong>Medidor:</strong> ${tipomedidor}<br/>
              <strong>Tipo:</strong> ${tipo}
            `))
            .addTo(map.current);

          markersRef.current.push(marker);
        }
      });

      // Líneas
      map.current.addSource("gps_tracks", {
        type: "geojson",
        data: geodata,
      });
      map.current.addLayer({
        id: "DistritosCercado",
        type: "line",
        source: "gps_tracks",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#3399FF",
          "line-width": 4,
          "line-opacity": 0.8,
        },
      });
console.log("MapaCalor data:", mapaCalor);

      // Heatmap
      map.current.addSource("heatmapSource", {
        type: "geojson",
        data: mapaCalor,
      });
      map.current.addLayer({
        id: "heatmapLayer",
        type: "heatmap",
        source: "heatmapSource",
        maxzoom: 15,
        paint: {
          "heatmap-radius": [
            "interpolate", ["linear"], ["zoom"],
            0, 2,
            15, 20,
          ],
          "heatmap-weight": [
            "interpolate", ["linear"], ["get", "consumo"],
            0, 0,
            100, 1
          ],
          "heatmap-color": [
            "interpolate", ["linear"], ["heatmap-density"],
            0, "rgba(33,102,172,0)",
            0.2, "rgb(103,169,207)",
            0.4, "rgb(209,229,240)",
            0.6, "rgb(253,219,199)",
            0.8, "rgb(239,138,98)",
            1, "rgb(178,24,43)"
          ],
          "heatmap-opacity": 0.7
        }
      });

      // Visibilidad inicial
      map.current.setLayoutProperty("DistritosCercado", "visibility", showLines ? "visible" : "none");
      map.current.setLayoutProperty("heatmapLayer", "visibility", showHeatmap ? "visible" : "none");
    });
  }, [medidores, mapaCalor]);

  // 3. Toggle visibilidad
  useEffect(() => {
    if (!map.current) return;

    // Pins
    markersRef.current.forEach(m => {
      if (showPins) m.addTo(map.current);
      else m.remove();
    });

    // Capas
    const setVisibility = (layerId, visible) => {
      if (map.current.getLayer(layerId)) {
        map.current.setLayoutProperty(layerId, "visibility", visible ? "visible" : "none");
      }
    };

    setVisibility("DistritosCercado", showLines);
    setVisibility("heatmapLayer", showHeatmap);
  }, [showPins, showLines, showHeatmap]);

  return (
    <div className="relative w-full h-screen">
      {/* Controles */}
      <div className="absolute top-4 left-4 z-10 bg-white p-2 rounded shadow space-x-2">
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded"
          onClick={() => setShowPins(p => !p)}
        >
          {showPins ? "Hide Pins" : "Show Pins"}
        </button>
        <button
          className="px-3 py-1 bg-green-500 text-white rounded"
          onClick={() => setShowLines(l => !l)}
        >
          {showLines ? "Hide Lines" : "Show Lines"}
        </button>
        <button
          className="px-3 py-1 bg-red-500 text-white rounded"
          onClick={() => setShowHeatmap(h => !h)}
        >
          {showHeatmap ? "Hide Heatmap" : "Show Heatmap"}
        </button>
      </div>

      {/* Mapa */}
      <div ref={mapContainer} className="absolute w-full h-full" />
    </div>
  );
}
