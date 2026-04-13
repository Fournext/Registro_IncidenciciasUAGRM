import { useState, useEffect } from "react";
import { ArrowRight, Building2, UserPlus, X } from "lucide-react";
import P_FormReportante from "./Presentacion/P_FormReportante";
import P_FormDecano from "./Presentacion/P_FormDecano";
import P_InicioSesion from "./Presentacion/P_InicioSesión";

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [registerRole, setRegisterRole] = useState<"normal" | "decano">(
    "normal",
  );
  useEffect(() => {
    if (showLogin || showRegister) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showLogin, showRegister]);

  return (
    <div className="min-h-screen bg-[#0a0a0d] text-white relative overflow-hidden font-sans">
      {/* FONDO */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(40,40,55,0.35),transparent_65%)]" />
        {/* CORRECCIÓN: bg-[size:64px_64px] */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[64px_64px]" />
      </div>

      {/* BARRA DE NAVEGACIÓN */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-white/5 bg-[#0a0a0d]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Building2 className="h-6 w-6 text-[#b39b78]" />
          <span className="text-xl font-bold tracking-tight">UniReport</span>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => setShowLogin(true)}
            className="text-white/80 text-sm font-medium hover:text-white transition"
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => setShowRegister(true)}
            className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-white/90 text-sm font-medium hover:bg-white/10 transition shadow-sm"
          >
            Registrarse
          </button>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL (HOME) */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-73px)] px-6">
        <div className="w-full max-w-lg rounded-4xl border border-white/5 bg-[#111118]/80 shadow-2xl backdrop-blur-md px-8 py-14 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#a08a68] shadow-inner">
            <Building2 className="h-8 w-8 text-white" />
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white">
            Bienvenido a
            <br />
            UniReport
          </h1>

          <p className="mt-6 text-sm leading-relaxed text-white/50 max-w-sm mx-auto">
            La plataforma de gestión para optimizar y asegurar el bienestar de
            nuestra infraestructura universitaria.
          </p>

          <div className="mt-10">
            <button
              onClick={() => setShowLogin(true)}
              className="inline-flex items-center justify-center gap-3 rounded-xl bg-[#a08a68] px-10 py-4 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#8e7a5c] active:scale-[0.98] w-full max-w-70"
            >
              Ingresar al Portal
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </main>

      {/* MODAL DE LOGIN */}
      {showLogin && <P_InicioSesion onClose={() => setShowLogin(false)} />}

      {/* MODAL DE REGISTRO */}
      {showRegister && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
          <div className="flex min-h-full items-center justify-center p-4 py-10">
            <div className="relative w-full max-w-105 rounded-[28px] border border-white/10 bg-[#111118] shadow-2xl px-8 py-10 transition-all">
              <button
                onClick={() => setShowRegister(false)}
                className="absolute right-5 top-5 rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white transition outline-none"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Encabezado del Modal */}
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#1a1a24] border border-white/5 shadow-inner">
                  <UserPlus className="h-7 w-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Crear Cuenta
                </h2>
                <p className="mt-1 text-sm text-white/50">
                  Únete para poder hacer seguimiento a tus reportes.
                </p>
              </div>

              {/* SELECTOR DE ROLES (TABS) */}
              <div className="flex p-1 mb-6 rounded-xl border border-white/10 bg-white/5">
                <button
                  type="button"
                  onClick={() => setRegisterRole("normal")}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                    registerRole === "normal"
                      ? "bg-[#a08a68] text-white shadow-md"
                      : "text-white/50 hover:text-white/80"
                  }`}
                >
                  Reportante
                </button>
                <button
                  type="button"
                  onClick={() => setRegisterRole("decano")}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                    registerRole === "decano"
                      ? "bg-[#a08a68] text-white shadow-md"
                      : "text-white/50 hover:text-white/80"
                  }`}
                >
                  Decano
                </button>
              </div>

              {/* RENDERIZADO CONDICIONAL DE FORMULARIOS */}
              {registerRole === "normal" ? (
                <P_FormReportante onClose={() => setShowRegister(false)} />
              ) : (
                <P_FormDecano onClose={() => setShowRegister(false)} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
