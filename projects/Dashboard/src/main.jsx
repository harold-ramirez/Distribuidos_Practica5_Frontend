import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import SistemaFacturacionApp from "./sistema-facturacion/App"; // Ajusta si el nombre es diferente

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recibo" element={<SistemaFacturacionApp />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
