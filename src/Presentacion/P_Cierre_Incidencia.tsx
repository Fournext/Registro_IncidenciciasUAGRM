import { useState, useEffect, useCallback } from "react";
import { X, CheckCircle } from "lucide-react";
import { N_Incidencia } from "../Negocio/N_Incidencia";
import { N_Cierre_Incidencia } from "../Negocio/N_Cierre_Incidencia";
import { N_Encargado_Mantenimiento } from "../Negocio/N_Encargado_Mantenimiento";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function P_Finalizar_Incidencia({ onClose, onSuccess }: Props) {
  const [incidencia, setIncidencia] = useState<any>(null);
  const [cierreSeleccionado, setCierreSeleccionado] = useState<any>(null);
  const [imagenSeleccionada, setImagenSeleccionada] = useState<string | null>(
    null,
  );

  // Estados para el FORMULARIO (En Proceso)
  const [detallesCierre, setDetallesCierre] = useState<
    { file: File | null; preview: string; descripcion: string }[]
  >([{ file: null, preview: "", descripcion: "" }]);
  const [observacion, setObservacion] = useState("");

  {
    /* =====================================================================
          CU10 Administrar Cierre Incidencia 
      ======================================================================*/
  }

  const obtenerSesionEncargado = () =>
    N_Encargado_Mantenimiento.obtenerSesion();
  const obtenerIncidenciaSeleccionada = useCallback(
    () => N_Incidencia.obtenerIncidenciaSeleccionada(),
    [],
  );

  const listarCierrePorIncidencia = useCallback(async () => {
    const dataIncidencia = obtenerIncidenciaSeleccionada();
    setIncidencia(dataIncidencia);

    if (dataIncidencia?.estado === "Resuelto") {
      try {
        const datosCierre = await N_Cierre_Incidencia.listarCierrePorIncidencia(
          dataIncidencia.id,
        );
        if (datosCierre && datosCierre.length > 0) {
          setCierreSeleccionado(datosCierre[0]);
        }
      } catch (error) {
        console.error("Error cargando cierre:", error);
      }
    }
  }, [obtenerIncidenciaSeleccionada]);

  const registrarCierre = async () => {
    if (!incidencia) return;
    try {
      const encargado = obtenerSesionEncargado();
      const detallesConURLs = await Promise.all(
        detallesCierre
          .filter((d) => d.file)
          .map(async (d) => {
            const url = await N_Incidencia.convertirIMG_URL(d.file!);
            return {
              id: 0,
              id_cierre_incidencia: 0,
              imagen_solucion: url || "",
              descripcion: d.descripcion,
            };
          }),
      );

      const cierre = {
        id: 0,
        id_incidencia: incidencia.id,
        id_encargado: encargado?.id || 0,
        fecha: new Date(),
        observacion,
        detalle_cierre_incidencias: detallesConURLs,
      };

      await N_Cierre_Incidencia.registrarCierre(cierre);
      alert("Cierre registrado con éxito.");
      onSuccess();
      onClose();
    } catch (error) {
      alert((error as Error).message);
    }
  };

  const eliminarCierre = async () => {
    if (!cierreSeleccionado || !incidencia) return;
    if (
      window.confirm(
        "¿Confirmas que deseas eliminar este cierre y reabrir la incidencia?",
      )
    ) {
      try {
        await N_Cierre_Incidencia.eliminarCierre(
          cierreSeleccionado.id,
          incidencia.id,
        );
        alert("Cierre eliminado con éxito. La incidencia ha sido reabierta.");
        onSuccess();
        onClose();
      } catch (error) {
        alert("Error al eliminar el cierre: " + (error as Error).message);
      }
    }
  };

  {
    /* =====================================================================
          Funciones Auxiliares y Carga Inicial
      ======================================================================*/
  }

  const formatearFecha = (fecha: any) => {
    try {
      const d = new Date(fecha);
      return d.toLocaleString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "-";
    }
  };

  useEffect(() => {
    listarCierrePorIncidencia();
  }, [listarCierrePorIncidencia]);

  const agregarDetalle = () =>
    setDetallesCierre([
      ...detallesCierre,
      { file: null, preview: "", descripcion: "" },
    ]);

  const eliminarDetalle = (index: number) =>
    setDetallesCierre(detallesCierre.filter((_, i) => i !== index));

  const handleDetalleChange = (
    index: number,
    field: string,
    value: string | File,
  ) => {
    const nuevosDetalles = [...detallesCierre];
    if (field === "file" && value instanceof File) {
      nuevosDetalles[index].file = value;
      nuevosDetalles[index].preview = URL.createObjectURL(value);
    } else if (typeof value === "string") {
      (nuevosDetalles[index] as any)[field] = value;
    }
    setDetallesCierre(nuevosDetalles);
  };

  if (!incidencia) return null;

  return (
    <div className="fixed inset-0 z-150 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      {incidencia.estado !== "Resuelto" ? (
        /* =====================================================================
            MODAL DE REGISTRO DE FINALIZACIÓN (DISEÑO ORIGINAL)
        ======================================================================*/
        <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#16161c] shadow-2xl [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 hover:[&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
          <div className="p-6">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white transition outline-none"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-4 text-center mt-2">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 border border-green-500/20 shadow-inner">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Finalizar Incidencia
              </h2>
              <p className="mt-1 text-xs text-white/50">
                Añade fotos y descripciones para dar por solucionado el
                problema.
              </p>
            </div>

            <div className="space-y-4">
              {detallesCierre.map((evidencia, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-white/10 bg-[#1e1e24] p-4 relative overflow-hidden"
                >
                  {detallesCierre.length > 1 && (
                    <button
                      onClick={() => eliminarDetalle(index)}
                      className="absolute right-2 top-2 p-1.5 text-red-400 hover:bg-red-500/20 rounded-md transition"
                      title="Eliminar evidencia"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="sm:w-2/5">
                      <label className="mb-1.5 block text-[11px] font-semibold text-white/90">
                        Imagen
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleDetalleChange(index, "file", file);
                          }
                        }}
                        className="w-full text-[11px] text-white/50 file:mr-2 file:rounded-lg file:border file:border-white/10 file:bg-[#2a2a35] file:px-2.5 file:py-1.5 file:text-[11px] file:font-semibold file:text-white hover:file:bg-[#343440] transition cursor-pointer"
                      />
                      {evidencia.preview && (
                        <div className="mt-2 rounded-lg overflow-hidden border border-white/10 bg-black/20">
                          <img
                            src={evidencia.preview}
                            alt="Previsualización"
                            className="h-20 w-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                          />
                        </div>
                      )}
                    </div>
                    <div className="sm:w-3/5">
                      <label className="mb-1.5 block text-[11px] font-semibold text-white/90">
                        Descripción de la evidencia
                      </label>
                      <textarea
                        value={evidencia.descripcion}
                        onChange={(e) =>
                          handleDetalleChange(
                            index,
                            "descripcion",
                            e.target.value,
                          )
                        }
                        className="w-full rounded-xl border border-white/10 bg-[#16161c] px-3 py-2 text-xs text-white outline-none focus:border-green-500/50 focus:bg-[#1a1a22] transition-colors resize-none h-22 custom-scrollbar"
                        placeholder="Ej: Se reemplazó la pieza por una nueva..."
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={agregarDetalle}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white/50 hover:bg-white/10 hover:text-white transition-all"
              >
                + Añadir otra evidencia
              </button>

              <div className="pt-3 border-t border-white/5 mt-3 mb-1">
                <label className="mb-1.5 block text-[13px] font-bold text-white/90">
                  Anotación General del Cierre
                </label>
                <textarea
                  value={observacion}
                  onChange={(e) => setObservacion(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#1e1e24] px-4 py-3 text-xs text-white outline-none focus:border-green-500/50 focus:bg-[#23232a] transition-colors resize-none h-20 custom-scrollbar"
                  placeholder="Conclusiones finales..."
                />
              </div>

              <button
                onClick={registrarCierre}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-green-500 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] active:scale-[0.98]"
              >
                Confirmar y Finalizar ✓
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* =====================================================================
            MODAL DE VER DETALLES DEL CIERRE (DISEÑO ORIGINAL)
        ======================================================================*/
        <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#16161c] shadow-2xl [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 hover:[&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
          <div className="p-6">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white transition outline-none"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-4 text-center mt-2">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 shadow-inner">
                <CheckCircle className="h-5 w-5 text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Detalles del Cierre
              </h2>
              <p className="mt-1 text-xs text-white/50">{incidencia?.titulo}</p>
            </div>

            <div className="space-y-4 text-white">
              <div className="rounded-xl border border-white/10 bg-[#1e1e24] p-4">
                <h3 className="text-[13px] font-bold text-white/90 mb-2">
                  Anotación General
                </h3>
                <p className="text-xs text-white/70">
                  {cierreSeleccionado?.observacion || "Sin anotación general."}
                </p>
                <p className="text-[10px] text-white/40 mt-2">
                  Cerrado el: {formatearFecha(cierreSeleccionado?.fecha)}
                </p>
              </div>

              {cierreSeleccionado?.detalle_cierre_incidencias?.map(
                (detalle: any, index: number) => (
                  <div
                    key={index}
                    className="rounded-xl border border-white/10 bg-[#1e1e24] p-4 flex flex-col sm:flex-row gap-4"
                  >
                    {detalle.imagen_solucion && (
                      <div
                        className="sm:w-2/5 rounded-lg overflow-hidden border border-white/10 bg-black/20 cursor-pointer"
                        onClick={() =>
                          setImagenSeleccionada(detalle.imagen_solucion)
                        }
                      >
                        <img
                          src={detalle.imagen_solucion}
                          alt="Evidencia Solución"
                          className="h-20 w-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                        />
                      </div>
                    )}
                    <div
                      className={
                        detalle.imagen_solucion ? "sm:w-3/5" : "w-full"
                      }
                    >
                      <h3 className="text-[11px] font-semibold text-white/90 mb-1">
                        Descripción de evidencia
                      </h3>
                      <p className="text-xs text-white/70">
                        {detalle.descripcion || "Sin descripción."}
                      </p>
                    </div>
                  </div>
                ),
              )}

              {obtenerSesionEncargado() && (
                <button
                  onClick={eliminarCierre}
                  className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-red-600/20 border border-red-500/50 px-6 py-3 text-sm font-bold text-red-500 transition-all hover:bg-red-600 hover:text-white hover:shadow-[0_0_20px_rgba(220,38,38,0.3)] active:scale-[0.98]"
                >
                  <X className="h-4 w-4" />
                  Eliminar Cierre y Reabrir Incidencia
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE VISUALIZACIÓN DE IMAGEN */}
      {imagenSeleccionada && (
        <div
          className="fixed inset-0 z-200 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in"
          onClick={() => setImagenSeleccionada(null)}
        >
          <button
            onClick={() => setImagenSeleccionada(null)}
            className="absolute right-5 top-5 rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white transition outline-none"
          >
            <X className="h-8 w-8" />
          </button>

          <img
            src={imagenSeleccionada}
            alt="Evidencia"
            className="max-w-full max-h-[90vh] rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
