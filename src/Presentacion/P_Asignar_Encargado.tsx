import { useState, useEffect, useCallback } from "react";
import { X, UserCheck, HardHat } from "lucide-react";
import { N_Encargado_Mantenimiento } from "../Negocio/N_Encargado_Mantenimiento";
import { N_Incidencia } from "../Negocio/N_Incidencia";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function P_Asignar_Encargado({ onClose, onSuccess }: Props) {
  const [listarEncargados, setListarEncargadosMantenimiento] = useState<any[]>(
    [],
  );
  const [id_encargado, setIdEncargado] = useState(0);
  const [incidencia, setIncidencia] = useState<any>(null);

  {
    /* =====================================================================
          CU9 Asignar Incidencia a Encargado
      ======================================================================*/
  }

  const obtenerIncidenciaSeleccionada = useCallback(() => {
    return N_Incidencia.obtenerIncidenciaSeleccionada();
  }, []);

  // Listar encargados de mantenimiento para el dropdown
  const listarEncargadosMantenimiento = useCallback(async () => {
    try {
      const data = await N_Encargado_Mantenimiento.listar();
      setListarEncargadosMantenimiento(data);
    } catch (error) {
      console.error("Error al listar encargados de mantenimiento:", error);
      setListarEncargadosMantenimiento([]);
    }
  }, []);

  // Lógica para enviar la asignación
  const asignarEncargado = async () => {
    try {
      await N_Incidencia.asignarEncargado(incidencia?.id, id_encargado);
      alert("Personal asignado con éxito.");
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    }
  };

  {
    /* =====================================================================
          Fuciones Auxiliares 
      ======================================================================*/
  }

  useEffect(() => {
    const data = obtenerIncidenciaSeleccionada();
    setIncidencia(data);
  }, [obtenerIncidenciaSeleccionada]);

  useEffect(() => {
    listarEncargadosMantenimiento().catch(console.error);
  }, [listarEncargadosMantenimiento]);

  return (
    <div className="fixed inset-0 z-150 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="relative w-full max-w-105 rounded-[28px] border border-white/10 bg-[#16161c] shadow-2xl p-8">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white transition outline-none"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#2a2a35] border border-white/5 shadow-inner">
            <UserCheck className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Asignar Encargado
          </h2>
          <p className="mt-1 text-sm text-white/50">
            Selecciona el personal para atender esta incidencia.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-xs font-semibold text-white/90">
              Personal de Mantenimiento
            </label>
            <div className="relative">
              <HardHat className="absolute left-4 top-3.5 h-5 w-5 text-white/40" />
              <select
                value={id_encargado || ""}
                onChange={(e) => setIdEncargado(Number(e.target.value))}
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none focus:border-[#a08a68] focus:bg-white/10 transition-colors appearance-none cursor-pointer"
              >
                <option
                  value=""
                  disabled
                  className="bg-[#111118] text-white/50"
                >
                  Selecciona al encargado...
                </option>
                {listarEncargados.map((enc) => (
                  <option key={enc.id} value={enc.id} className="bg-[#111118]">
                    {enc.nombre} {enc.apellido}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={asignarEncargado}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#a08a68] px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#8e7a5c] active:scale-[0.98]"
          >
            Confirmar Asignación ✓
          </button>
        </div>
      </div>
    </div>
  );
}
