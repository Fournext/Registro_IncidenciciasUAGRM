import React, { useState, useEffect } from "react";
import {
  Building2,
  ClipboardList,
  User,
  LogOut,
  X,
  UserPen,
  Phone,
  Mail,
  RefreshCw,
  ShieldUserIcon,
} from "lucide-react";
import { N_Reportante } from "../Negocio/N_Reportante";
import P_RegistroIncidencia from "./P_RegistroIncidencia";
import P_Incidencia from "./P_Incidencia";
import P_CerrarSesion from "./P_CerrarSesion";

export default function P_Reportante() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const obtenerSesion = () => {
    return N_Reportante.obtenerSesion() || ({} as any);
  };

  // Estados del Perfil
  const [reportante, setReportante] = useState(obtenerSesion());
  const [nombre, setNombre] = useState(reportante.nombre || "");
  const [apellido, setApellido] = useState(reportante.apellido || "");
  const [telefono, setTelefono] = useState(reportante.telefono || "");
  const [email, setEmail] = useState(reportante.email || "");
  const [contrasena, setContrasena] = useState("");

  {
    /* -------------------------------------------------------------------
          CU2 Editar Perfil Reportante
      ---------------------------------------------------------------------*/
  }

  // Actualizar Perfil
  const editar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const reportanteActualizar = {
        ...reportante,
        nombre,
        apellido,
        telefono,
        email,
        ...(contrasena && { contrasena }),
      };
      const result = await N_Reportante.editar(reportanteActualizar);
      N_Reportante.guardarSesion(result);
      setReportante(result);
      alert("Reportante Actualizado con éxito");
      setIsProfileModalOpen(false);
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    }
  };

  useEffect(() => {
    if (isModalOpen || isProfileModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen, isProfileModalOpen]);

  return (
    <div className="min-h-screen bg-[#0a0a0d] text-white font-sans relative">
      {/* =====================================================================
          MODAL MIS INCIDENCIAS 
      ======================================================================*/}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
          <div className="flex min-h-full items-center justify-center p-4 py-10">
            {/* Contenedor que envuelve a P_Incidencia */}
            <div className="relative w-full max-w-[90vw]">
              {/* Botón de cerrar flotante */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-4 top-4 z-10 rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white transition outline-none bg-black/20"
              >
                <X className="h-5 w-5" />
              </button>
              <P_Incidencia />
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL MI PERFIL
      ======================================================================*/}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-100 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
          <div className="flex min-h-full items-center justify-center p-4 py-10">
            <div className="relative w-full max-w-105 rounded-[28px] border border-white/10 bg-[#111118] shadow-2xl px-8 py-10 transition-all">
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="absolute right-5 top-5 rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white transition outline-none"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2a2a35] border border-white/5 shadow-inner">
                  <UserPen className="h-7 w-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Mi Perfil
                </h2>
                <p className="mt-1 text-sm text-white/50">
                  Actualiza tu información personal.
                </p>
              </div>

              <form onSubmit={editar} className="space-y-5">
                <div>
                  <label className="mb-2 block text-xs font-semibold text-white/70">
                    Nombre
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 h-5 w-5 text-white/40" />
                    <input
                      type="text"
                      className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none focus:border-[#b19a77] focus:bg-white/10 transition-colors font-medium"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-white/70">
                    Apellido
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 h-5 w-5 text-white/40" />
                    <input
                      type="text"
                      className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none focus:border-[#b19a77] focus:bg-white/10 transition-colors font-medium"
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-white/70">
                    Teléfono
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3.5 h-5 w-5 text-white/40" />
                    <input
                      type="tel"
                      className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none focus:border-[#b19a77] focus:bg-white/10 transition-colors font-medium"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-white/70">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 h-5 w-5 text-white/40" />
                    <input
                      type="email"
                      className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none focus:border-[#b19a77] focus:bg-white/10 transition-colors font-medium"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-white/70">
                    Contraseña
                  </label>
                  <div className="relative">
                    <ShieldUserIcon className="absolute left-4 top-3.5 h-5 w-5 text-white/40" />
                    <input
                      type="password"
                      placeholder="••••••"
                      className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none focus:border-[#b19a77] focus:bg-white/10 transition-colors font-medium"
                      value={contrasena}
                      onChange={(e) => setContrasena(e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#b19a77] px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#a08a68] active:scale-[0.98]"
                  >
                    Actualizar
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          BARRA DE NAVEGACIÓN
      ======================================================================*/}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-white/10 bg-[#0a0a0d]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Building2 className="h-6 w-6 text-[#b39b78]" />
          <span className="text-xl font-bold tracking-tight">UniReport</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 transition text-sm font-medium outline-none"
          >
            <ClipboardList className="h-4 w-4" />
            Mis Incidencias
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-white/10">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition group outline-none"
            >
              <div className="bg-[#b19a77] p-1.5 rounded-full group-hover:scale-105 transition-transform">
                <User className="h-4 w-4 text-white" />
              </div>
              Reportante
            </button>
            <button
              type="button"
              onClick={() => setIsLogoutModalOpen(true)}
              className="text-white/50 hover:text-white transition p-2 outline-none"
              title="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </nav>
      <P_RegistroIncidencia />

      {isLogoutModalOpen && (
        <P_CerrarSesion
          rol="reportante"
          onClose={() => setIsLogoutModalOpen(false)}
        />
      )}
    </div>
  );
}
