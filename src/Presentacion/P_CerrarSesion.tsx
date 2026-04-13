import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { N_CerrarSesion } from "../Negocio/N_CerrarSesion";

interface Props {
  rol: string;
  onClose: () => void;
}

export default function P_CerrarSesion({ rol, onClose }: Props) {
  const navigate = useNavigate();

  {
    /* =====================================================================
          CU13 Cerrar Sesión
      ======================================================================*/
  }

  const cerrarSesion = () => {
    N_CerrarSesion.cerrarSesion(rol);
    navigate("/");
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  return createPortal(
    <div className="fixed inset-0 z-200 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fade-in flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm rounded-[28px] border border-white/10 bg-[#111118] shadow-2xl px-6 py-8 transition-all text-center">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white transition outline-none"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 shadow-inner">
          <LogOut className="h-7 w-7 text-red-500" />
        </div>

        <h2 className="text-xl font-bold text-white tracking-tight mb-2">
          Cerrar Sesión
        </h2>
        <p className="text-sm text-white/50 mb-8 px-2">
          ¿Estás seguro que deseas desconectarte del sistema como{" "}
          <span className="capitalize font-bold text-white/80">{rol}</span>?
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl bg-white/5 px-4 py-3 text-sm font-bold text-white/80 transition-all hover:bg-white/10 active:scale-[0.98]"
          >
            Cancelar
          </button>
          <button
            onClick={cerrarSesion}
            className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-red-500 active:scale-[0.98] shadow-[0_0_15px_rgba(220,38,38,0.3)]"
          >
            Sí, salir
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
