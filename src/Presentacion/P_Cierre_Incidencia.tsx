import { useState, useEffect, useCallback } from "react";
import {
  X,
  CheckCircle,
  Camera,
  Plus,
  Trash2,
  Calendar,
  AlignLeft,
  Info,
} from "lucide-react";
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
    <div className="fixed inset-0 z-150 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-[28px] border border-white/10 bg-[#16161c] shadow-2xl p-8 my-8">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white transition outline-none"
        >
          <X className="h-5 w-5" />
        </button>

        {/* CABECERA DINÁMICA */}
        <div className="mb-6 text-center">
          <div
            className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[18px] border shadow-inner ${incidencia.estado === "Resuelto" ? "bg-blue-500/10 border-blue-500/20" : "bg-green-500/10 border-green-500/20"}`}
          >
            {incidencia.estado === "Resuelto" ? (
              <Info className="h-7 w-7 text-blue-400" />
            ) : (
              <CheckCircle className="h-7 w-7 text-green-400" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {incidencia.estado === "Resuelto"
              ? "Detalles del Cierre"
              : "Finalizar Incidencia"}
          </h2>
          <p className="mt-1 text-sm text-white/50">
            {incidencia.estado === "Resuelto"
              ? incidencia.titulo
              : "Registra las evidencias del trabajo realizado."}
          </p>
        </div>

        {incidencia.estado === "Resuelto" ? (
          /* MODO VISUALIZACIÓN */
          <div className="space-y-6 animate-fade-in">
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-2 mb-2 text-white/90 font-bold uppercase tracking-wider text-xs">
                <AlignLeft className="h-4 w-4 text-[#a08a68]" />
                Observación General
              </div>
              <p className="text-sm text-white/70 italic">
                {cierreSeleccionado?.observacion || "Sin anotación general."}
              </p>
              <div className="mt-4 flex items-center gap-2 text-[10px] text-white/40">
                <Calendar className="h-3 w-3" />
                Cerrado el: {formatearFecha(cierreSeleccionado?.fecha)}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-semibold text-white/90 uppercase tracking-wider block">
                Evidencias Fotográficas
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {cierreSeleccionado?.detalle_cierre_incidencias?.map(
                  (detalle: any, index: number) => (
                    <div
                      key={index}
                      className="rounded-xl border border-white/5 bg-white/5 p-4 flex flex-col gap-3"
                    >
                      {detalle.imagen_solucion && (
                        <div
                          className="aspect-video rounded-lg overflow-hidden border border-white/10 bg-black/20 cursor-pointer"
                          onClick={() =>
                            setImagenSeleccionada(detalle.imagen_solucion)
                          }
                        >
                          <img
                            src={detalle.imagen_solucion}
                            alt="Solución"
                            className="h-full w-full object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                      )}
                      <p className="text-xs text-white/60 line-clamp-2 italic">
                        {detalle.descripcion || "Sin descripción fotográfica."}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>

            {obtenerSesionEncargado() && (
              <button
                onClick={eliminarCierre}
                className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-red-600/20 border border-red-500/50 px-6 py-3.5 text-sm font-bold text-red-400 transition-all hover:bg-red-600 hover:text-white active:scale-95 shadow-lg shadow-red-900/20"
              >
                <Trash2 className="h-4 w-4" />
                Eliminar Cierre y Reabrir Incidencia
              </button>
            )}
          </div>
        ) : (
          /* MODO FORMULARIO */
          <div className="space-y-6 animate-fade-in">
            <div>
              <label className="mb-2 block text-xs font-semibold text-white/90 uppercase tracking-wider">
                Observación General
              </label>
              <textarea
                placeholder="Describe el trabajo realizado..."
                value={observacion}
                onChange={(e) => setObservacion(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#a08a68] focus:bg-white/10 transition-colors min-h-24 resize-y"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-white/90 uppercase tracking-wider">
                  Evidencias Fotográficas
                </label>
                <button
                  type="button"
                  onClick={agregarDetalle}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#a08a68] hover:text-[#cbb592] transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Agregar Foto
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {detallesCierre.map((detalle, index) => (
                  <div
                    key={index}
                    className="relative group rounded-2xl border border-white/5 bg-white/5 p-4 space-y-3 transition-all hover:bg-white/10"
                  >
                    <button
                      type="button"
                      onClick={() => eliminarDetalle(index)}
                      className="absolute -top-2 -right-2 h-7 w-7 flex items-center justify-center rounded-full bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <div className="relative aspect-video rounded-xl bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden">
                      {detalle.preview ? (
                        <img
                          src={detalle.preview}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-white/30">
                          <Camera className="h-8 w-8" />
                          <span className="text-[10px] font-medium">
                            SIN FOTO
                          </span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleDetalleChange(
                              index,
                              "file",
                              e.target.files[0],
                            );
                          }
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>

                    <input
                      type="text"
                      placeholder="Descripción de la foto..."
                      value={detalle.descripcion}
                      onChange={(e) =>
                        handleDetalleChange(
                          index,
                          "descripcion",
                          e.target.value,
                        )
                      }
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-[#a08a68]"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={registrarCierre}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#a08a68] px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#8e7a5c] active:scale-[0.98] shadow-lg shadow-[#a08a68]/20"
            >
              Confirmar Finalización ✓
            </button>
          </div>
        )}

        {/* MODAL INTERNO PARA VER IMAGEN EN GRANDE */}
        {imagenSeleccionada && (
          <div
            className="fixed inset-0 z-200 flex items-center justify-center bg-black/95 p-4 animate-fade-in backdrop-blur-sm"
            onClick={() => setImagenSeleccionada(null)}
          >
            <button
              className="absolute right-5 top-5 p-2 text-white/50 hover:text-white transition-colors"
              onClick={() => setImagenSeleccionada(null)}
            >
              <X className="h-8 w-8" />
            </button>
            <img
              src={imagenSeleccionada}
              alt="Zoom"
              className="max-w-full max-h-[90vh] rounded-xl object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>
    </div>
  );
}
