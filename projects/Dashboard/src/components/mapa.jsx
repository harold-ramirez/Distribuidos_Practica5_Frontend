import React, { useRef, useEffect } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import dataList from "../data/medidores.json";

export default function Mapa() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const cercado = { lng: -66.16259202670707, lat: -17.400348064136548 }; //primero longitud y luego latitud
  const zoom = 10.7;
  maptilersdk.config.apiKey = "kh9U32hnpTT8HLMSSp2r";

  const medidores = dataList;

  useEffect(() => {
    if (map.current) return; // stops map from intializing more than once

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [cercado.lng, cercado.lat],
      zoom: zoom,
    });

    medidores.forEach((medidor) => {
      new maptilersdk.Marker({ color: "#FF0000" })
        .setLngLat([medidor.longitud, medidor.latitud]) //primero longitud y luego latitud
        .addTo(map.current);
    });

  }, [cercado.lng, cercado.lat, zoom, medidores]);

  return (
    <div className="map-wrap relative w-full h-full">
      <div ref={mapContainer} className="map absolute w-full h-full" />
    </div>
  );
}
