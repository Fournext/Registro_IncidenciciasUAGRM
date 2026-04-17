import React, { useEffect, useState } from "react";
import {
  Building2,
  LogOut,
  User,
  X,
  UserPen,
  Phone,
  Mail,
  RefreshCw,
  Contact,
  ShieldUserIcon,
} from "lucide-react";
import { N_Decano } from "../Negocio/N_Decano";

// Importación de vistas secundarias
import P_Incidencia from "./P_Incidencia";
import P_Clasificacion_Incidencia from "./P_Clasificacion_Incidencia";
import P_Encargado_Mantenimiento from "./P_Encargado_Mantenimiento";
import P_CerrarSesion from "./P_CerrarSesion";
import P_Facultad from "./P_Facultad";

export default function P_Decano() {
  const [activeTab, setActiveTab] = useState<
    "incidencias" | "mantenimiento" | "clasificaciones"
  >("incidencias");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const obtenerSesion = () => {
    return N_Decano.obtenerSesion() || ({} as any);
  };

  // Estados del Perfil
  const [decano, setDecano] = useState(obtenerSesion());
  const [nombre, setNombre] = useState(decano.nombre || "");
  const [apellido, setApellido] = useState(decano.apellido || "");
  const [telefono, setTelefono] = useState(decano.telefono || "");
  const [email, setEmail] = useState(decano.email || "");
  const [credencial_institucional, setCredencialInstitucional] = useState(
    decano.credencial_institucional || "",
  );
  const [contrasena, setContrasena] = useState("");
  {
    /* -------------------------------------------------------------------
          CU5 Editar Decano (Perfil Institucional)
      ---------------------------------------------------------------------*/
  }

  // Función para editar la información del decano
  const editar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const datosActualizados = {
        ...decano,
        nombre,
        apellido,
        telefono,
        email,
        contrasena,
        credencial_institucional,
      };
      const result = await N_Decano.editar(datosActualizados);
      N_Decano.guardarSesion(result);
      setDecano(result);
      alert("Decano Actualizado con éxito");
      setIsProfileModalOpen(false);
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    }
  };

  {
    /* -------------------------------------------------------------------
          Funciones auxiliares para manejo de modales y scroll
      ---------------------------------------------------------------------*/
  }

  useEffect(() => {
    if (isProfileModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isProfileModalOpen]);

  return (
    <div className="min-h-screen bg-[#0a0a0d] text-white font-sans flex flex-col relative">
      {/* -------------------------------------------------------------------
          MODAL DE PERFIL
      ---------------------------------------------------------------------*/}
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
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#2a2a35] border border-white/5 shadow-inner">
                  <UserPen className="h-7 w-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Mi Perfil Institucional
                </h2>
                <p className="mt-1 text-sm text-white/50">
                  Actualiza tu información del decanato.
                </p>
              </div>

              <form onSubmit={editar} className="flex flex-col gap-5">
                <div>
                  <label className="mb-2 block text-xs font-bold text-white/90">
                    Nombre
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 h-5 w-5 text-white/40" />
                    <input
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none focus:border-[#a08a68] focus:bg-white/10 transition-colors font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold text-white/90">
                    Apellido
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 h-5 w-5 text-white/40" />
                    <input
                      type="text"
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none focus:border-[#a08a68] focus:bg-white/10 transition-colors font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold text-white/90">
                    Teléfono
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3.5 h-5 w-5 text-white/40" />
                    <input
                      type="tel"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none focus:border-[#a08a68] focus:bg-white/10 transition-colors font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold text-white/90">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 h-5 w-5 text-white/40" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none focus:border-[#a08a68] focus:bg-white/10 transition-colors font-medium"
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
                      className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none focus:border-[#a08a68] focus:bg-white/10 transition-colors font-medium"
                      value={contrasena}
                      onChange={(e) => setContrasena(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold text-white/90">
                    Credencial Institucional
                  </label>
                  <div className="relative">
                    <Contact className="absolute left-4 top-3.5 h-5 w-5 text-white/40" />
                    <input
                      type="text"
                      className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#a08a68] focus:bg-white/10 transition-colors"
                      value={credencial_institucional}
                      onChange={(e) =>
                        setCredencialInstitucional(e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <P_Facultad />

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#a08a68] px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#8e7a5c] active:scale-[0.98]"
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

      {/* -------------------------------------------------------------------
          BARRA DE NAVEGACIÓN Y CONTENIDO PRINCIPAL
      ---------------------------------------------------------------------*/}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-[#0a0a0d]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Building2 className="h-6 w-6 text-[#b39b78]" />
          <span className="text-xl font-bold tracking-tight">UniReport</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition group outline-none"
            >
              <div className="bg-[#b19a77] p-1.5 rounded-full group-hover:scale-105 transition-transform">
                <User className="h-4 w-4 text-white" />
              </div>
              Decano
            </button>
          </div>
          <button
            type="button"
            onClick={() => setIsLogoutModalOpen(true)}
            className="text-white/50 hover:text-white transition p-2"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </nav>

      <main className="flex-1 p-6 md:p-10 max-w-350 mx-auto w-full">
        <div className="w-full rounded-[28px] border border-white/5 bg-[#111118] shadow-2xl p-8 flex flex-col gap-8">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#a08a68]/20 border border-[#a08a68]/30 shadow-inner">
              <User className="h-10 w-10 text-[#a08a68]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Panel Administrativo
              </h1>
              <p className="mt-1 text-sm text-white/50">Gestión del Decanato</p>
            </div>
          </div>

          {/* MENÚ DE PESTAÑAS (TABS) */}
          <div className="flex items-center gap-2 border-b border-white/5 pb-6">
            <button
              onClick={() => setActiveTab("incidencias")}
              className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === "incidencias"
                  ? "border border-white/20 bg-white/5 text-white"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              Incidencias
            </button>
            <button
              onClick={() => setActiveTab("mantenimiento")}
              className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === "mantenimiento"
                  ? "border border-white/20 bg-white/5 text-white"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              Mantenimiento
            </button>

            {/* NUEVA PESTAÑA: CLASIFICACIONES */}
            <button
              onClick={() => setActiveTab("clasificaciones")}
              className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === "clasificaciones"
                  ? "border border-white/20 bg-white/5 text-white"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              Clasificaciones
            </button>
          </div>

          {/* RENDERIZADO CONDICIONAL DE FORMULARIOS */}
          {activeTab === "incidencias" && <P_Incidencia />}
          {activeTab === "mantenimiento" && <P_Encargado_Mantenimiento />}
          {activeTab === "clasificaciones" && <P_Clasificacion_Incidencia />}
        </div>
      </main>

      {isLogoutModalOpen && (
        <P_CerrarSesion
          rol="decano"
          onClose={() => setIsLogoutModalOpen(false)}
        />
      )}
    </div>
  );
}
