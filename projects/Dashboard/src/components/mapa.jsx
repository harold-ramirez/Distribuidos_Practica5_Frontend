import React, { useRef, useEffect } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import dataList from "../data/medidores.json";
import geodata from "../data/DistritosCercado.json";
import heatMapJSON from "../data/mapaCalor.json";

export default function Mapa() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const cercado = { lng: -66.16259202670707, lat: -17.400348064136548 }; //primero longitud y luego latitud
  const zoom = 10.7;
  maptilersdk.config.apiKey = "kh9U32hnpTT8HLMSSp2r";

  const medidores = dataList;
  const mapaCalor = heatMapJSON;

  useEffect(() => {
    if (map.current) return; // stops map from intializing more than once

    //INICIALIZAR MAPA
    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.DATAVIZ.DARK,
      center: [cercado.lng, cercado.lat],
      zoom: zoom,
    });

    map.current.on("load", async function () {
      //MARCADORES MEDIDORES
      medidores.forEach((medidor) => {
        new maptilersdk.Marker({ color: "#FF0000" })
          .setLngLat([medidor.longitud, medidor.latitud]) //primero longitud y luego latitud
          .setPopup(
            new maptilersdk.Popup({ offset: 25 }).setHTML(
              "<span>" +
                "<strong>Contrato: </strong>" +
                medidor.contrato +
                "<br>" +
                "<strong>Cliente: </strong>" +
                medidor.cliente +
                "<br>" +
                "<strong>Distrito: </strong>" +
                medidor.distrito +
                "<br>" +
                "<strong>Medidor: </strong>" +
                medidor.medidor +
                "<br>" +
                "<strong>Tipo: </strong>" +
                medidor.tipo +
                "</span>"
            )
          )
          .addTo(map.current);
      });

      //LINEAS DISTRITOS CERCADO
      map.current.addSource("gps_tracks", {
        type: "geojson",
        data: geodata,
      });
      map.current.addLayer({
        id: "DistritosCercado",
        type: "line",
        source: "gps_tracks",
        layout: {},
        paint: {
          "line-color": "#57f",
          "line-width": 3,
        },
      });

      //MAPA CALOR
      maptilersdk.helpers.addHeatmap(map.current, {
        data: mapaCalor,
        property: "consumo",
        radius: [
          { propertyValue: 0, value: 10 }, // Consumo bajo, radio pequeño
          { propertyValue: 1500, value: 30 }, // Consumo medio, radio medio
          { propertyValue: 3000, value: 60 }, // Consumo alto, radio grande
        ],
        weight: [
          { propertyValue: 0, value: 0.5 }, // Consumo bajo, poco peso
          { propertyValue: 1500, value: 1.5 }, // Consumo medio, peso medio
          { propertyValue: 3000, value: 2.5 }, // Consumo alto, máximo peso
        ],
        colorRamp: maptilersdk.ColorRampCollection.MAGMA,
        zoomCompensation: false,
        opacity: 0.7,
        intensity: 1.2,
      });
    });
  }, [cercado.lng, cercado.lat, zoom, mapaCalor, medidores]);

  return (
    <div className="relative w-full h-full map-wrap">
      <div ref={mapContainer} className="absolute w-full h-full map" />
    </div>
  );
}
