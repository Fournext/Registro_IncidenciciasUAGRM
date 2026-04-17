import React, { useState } from "react";
import { LogIn, X, Mail, Lock, Phone, Contact } from "lucide-react";
import { N_InicioSesión } from "../Negocio/N_IniciarSesión";
import { useNavigate } from "react-router-dom";

interface Props {
  onClose: () => void;
}

type Role = "reportante" | "decano" | "encargado";

export default function P_InicioSesion({ onClose }: Props) {
  const [loginRole, setLoginRole] = useState<Role>("reportante");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [telefono, setTelefono] = useState("");
  const [credencial_instirucional, setCredencial] = useState("");
  const navigate = useNavigate();

  const InicioSesion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (loginRole === "reportante") {
        await N_InicioSesión.loginReportante(email, contrasena);
        onClose();
        alert("Reportante Autenticado con éxito");
        navigate("/reportante");
      } else if (loginRole === "decano") {
        await N_InicioSesión.loginDecano(
          email,
          contrasena,
          credencial_instirucional,
        );
        onClose();
        alert("Decano Autenticado con éxito");
        navigate("/decano");
      } else if (loginRole === "encargado") {
        await N_InicioSesión.loginMantenimiento(telefono, contrasena);
        onClose();
        alert("Encargado de Mantenimiento Autenticado con éxito");
        navigate("/encargado");
      }
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    }

    //console.log(`Iniciando sesión como: ${loginRole}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4 animate-fade-in">
      {/* Ajustamos el ancho máximo a max-w-[420px] para que se vea como en la foto */}
      <div className="relative w-full max-w-105 rounded-[28px] border border-white/10 bg-[#111118] shadow-2xl px-8 py-10">
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white transition outline-none"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Encabezado */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#1a1a24] border border-white/5 shadow-inner">
            <LogIn className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Bienvenido
          </h2>
          <p className="mt-1 text-sm text-white/50">
            Ingresa tus datos para continuar.
          </p>
        </div>

        <form onSubmit={InicioSesion} className="space-y-5">
          {/* Selector de Roles (Tabs) */}
          <div className="flex p-1 rounded-xl border border-white/10 bg-white/5">
            <button
              type="button"
              onClick={() => setLoginRole("reportante")}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                loginRole === "reportante"
                  ? "bg-[#a08a68] text-white shadow-md"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              Reportante
            </button>
            <button
              type="button"
              onClick={() => setLoginRole("decano")}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                loginRole === "decano"
                  ? "bg-[#a08a68] text-white shadow-md"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              Decano
            </button>
            <button
              type="button"
              onClick={() => setLoginRole("encargado")}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                loginRole === "encargado"
                  ? "bg-[#a08a68] text-white shadow-md"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              Encargado de Mantenimiento
            </button>
          </div>

          {/* RENDERIZADO CONDICIONAL DE CAMPOS */}

          {/* Campo: Email (Solo para Reportante y Decano) */}
          {(loginRole === "reportante" || loginRole === "decano") && (
            <div className="animate-fade-in">
              <label className="mb-2 block text-xs font-semibold text-white/80">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-white/40" />
                <input
                  type="email"
                  placeholder="correo@universidad.edu"
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#a08a68] focus:bg-white/10 transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Campo: Teléfono (Solo para Mantenimiento) */}
          {loginRole === "encargado" && (
            <div className="animate-fade-in">
              <label className="mb-2 block text-xs font-semibold text-white/80">
                Teléfono de Mantenimiento
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-3.5 h-5 w-5 text-white/40" />
                <input
                  type="tel"
                  placeholder="555-0101"
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#a08a68] focus:bg-white/10 transition-colors"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Campo: Contraseña (Para todos los roles) */}
          <div className="animate-fade-in">
            <label className="mb-2 block text-xs font-semibold text-white/80">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 h-5 w-5 text-white/40" />
              <input
                type="password"
                placeholder="Tu contraseña segura"
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#a08a68] focus:bg-white/10 transition-colors"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
              />
            </div>
          </div>

          {/* Campo: Credencial (Solo para Decano) */}
          {loginRole === "decano" && (
            <div className="animate-fade-in">
              <label className="mb-2 block text-xs font-semibold text-white/80">
                Credencial Institucional
              </label>
              <div className="relative">
                <Contact className="absolute left-4 top-3.5 h-5 w-5 text-white/40" />
                <input
                  type="text"
                  placeholder="123-DEC-456"
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#a08a68] focus:bg-white/10 transition-colors"
                  value={credencial_instirucional}
                  onChange={(e) => setCredencial(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Botón de Enviar */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#a08a68] px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#8e7a5c] active:scale-[0.98]"
            >
              Iniciar Sesión
              <LogIn className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
