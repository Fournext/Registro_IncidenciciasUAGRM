import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";
import Home from "./Home.tsx";
import "./index.css";
import P_Reportante from "./Presentacion/P_Reportante.tsx";
import P_Decano from "./Presentacion/P_Decano.tsx";
import P_Panel_Encargado from "./Presentacion/P_Panel_Encargado.tsx";
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/reportante" element={<P_Reportante />} />
      <Route path="/decano" element={<P_Decano />} />
      <Route path="/encargado" element={<P_Panel_Encargado />} />
    </Routes>
  </BrowserRouter>,
);
