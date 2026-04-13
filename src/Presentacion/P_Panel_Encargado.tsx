import { useState } from "react";
import { Building2, LogOut, User, Wrench } from "lucide-react";

import P_Incidencia from "./P_Incidencia";
import P_CerrarSesion from "./P_CerrarSesion";

export default function P_Panel_Encargado() {
  // 1. Obtenemos los datos del encargado desde el localStorage
  const encargado = JSON.parse(localStorage.getItem("encargado") || "{}");

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  return (
    <div className="min-h-screen bg-[#0a0a0d] text-white font-sans flex flex-col relative">
      {/* -------------------------------------------------------------------
          BARRA DE NAVEGACIÓN
      ---------------------------------------------------------------------*/}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-[#0a0a0d]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Building2 className="h-6 w-6 text-[#b39b78]" />
          <span className="text-xl font-bold tracking-tight">UniReport</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5">
            <div className="flex items-center gap-2 text-sm font-medium text-white/80">
              <div className="bg-[#b19a77] p-1.5 rounded-full">
                <User className="h-4 w-4 text-white" />
              </div>
              {/* AQUÍ MOSTRAMOS EL NOMBRE DEL LOCAL STORAGE */}
              {encargado.nombre + " " + encargado.apellido}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsLogoutModalOpen(true)}
            className="text-white/50 hover:text-white transition p-2"
            title="Cerrar sesión"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* -------------------------------------------------------------------
          CONTENIDO PRINCIPAL
      ---------------------------------------------------------------------*/}
      <main className="flex-1 p-6 md:p-10 max-w-400 mx-auto w-full animate-fade-in flex flex-col gap-8">
        {/* Cabecera visual "Mis Asignaciones" */}
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#a08a68,#756754)] shadow-lg shadow-[#b8a07a]/10">
            <Wrench className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#e6d5b8] tracking-tight">
              Mis Asignaciones
            </h1>
            <p className="mt-1 text-sm text-white/50">
              Gestiona las incidencias que tienes a cargo
            </p>
          </div>
        </div>

        {/* INYECTAMOS EL COMPONENTE UNIVERSAL */}
        <P_Incidencia />
      </main>

      {isLogoutModalOpen && (
        <P_CerrarSesion
          rol="encargado"
          onClose={() => setIsLogoutModalOpen(false)}
        />
      )}
    </div>
  );
}
