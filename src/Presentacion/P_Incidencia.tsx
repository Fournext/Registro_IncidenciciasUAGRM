import { useCallback, useEffect, useState } from "react";
import {
  MapPin,
  Image as ImageIcon,
  CheckCircle,
  Clock,
  Wrench,
  Type,
  AlignLeft,
  Calendar,
  X,
  Tags,
  Landmark,
} from "lucide-react";
import { N_Incidencia } from "../Negocio/N_Incidencia";
import { N_Encargado_Mantenimiento } from "../Negocio/N_Encargado_Mantenimiento";
import { N_Reportante } from "../Negocio/N_Reportante";
import { N_Decano } from "../Negocio/N_Decano";
import P_Asignar_Encargado from "./P_Asignar_Encargado";
import P_Finalizar_Incidencia from "./P_Cierre_Incidencia";

const obtenerSesionDecano = () => N_Decano.obtenerSesion();
const obtenerSesionReportante = () => N_Reportante.obtenerSesion();
const obtenerSesionEncargado = () => N_Encargado_Mantenimiento.obtenerSesion();

export default function P_Incidencia() {
  const [incidencias, setIncidencias] = useState<any[]>([]);
  const [imagenSeleccionada, setImagenSeleccionada] = useState<string | null>(
    null,
  );
  const [rolActual, setRolActual] = useState("");
  const [modalAsignarAbierto, setModalAsignarAbierto] = useState(false);
  const [modalFinalizarAbierto, setModalFinalizarAbierto] = useState(false);

  {
    /* =====================================================================
          CU9 Listar Incidencias 
      ======================================================================*/
  }

  // Listar incidencias al Reportante
  const listarPorReportante = useCallback(async (id_reportante: number) => {
    try {
      const data = await N_Incidencia.listarPorReportante(id_reportante);
      setIncidencias(data);
    } catch (error) {
      console.error("Error al obtener incidencias para reportante:", error);
      setIncidencias([]);
    }
  }, []);

  // Listar Incidencias al encargado de mantenimiento
  const listarPorEncargado = useCallback(async (id_encargado: number) => {
    try {
      const data = await N_Incidencia.listarPorEncargado(id_encargado);
      setIncidencias(data);
    } catch (error) {
      console.error("Error al obtener incidencias para encargado:", error);
      setIncidencias([]);
    }
  }, []);

  // Listar Incidencias al Decano
  const listarPorFacultadDecano = useCallback(async (id_decano: number) => {
    try {
      const data = await N_Incidencia.listarPorFacultadDecano(id_decano);
      setIncidencias(data);
    } catch (error) {
      console.error("Error al obtener incidencias para decano:", error);
      setIncidencias([]);
    }
  }, []);

  // Formatear fecha de forma segura
  const formatearFechaSegura = (fechaValor: any) => {
    if (!fechaValor) return "-";
    try {
      const fecha = new Date(fechaValor);

      if (isNaN(fecha.getTime())) {
        return String(fechaValor).substring(0, 16);
      }

      const dia = fecha.getDate().toString().padStart(2, "0");
      const mesRaw = fecha.toLocaleString("es-ES", { month: "short" });
      const mesCap =
        mesRaw.charAt(0).toUpperCase() + mesRaw.slice(1).replace(".", "");
      const anio = fecha.getFullYear();

      const horas = fecha.getHours().toString().padStart(2, "0");
      const minutos = fecha.getMinutes().toString().padStart(2, "0");

      return `${dia} ${mesCap} ${anio}, ${horas}:${minutos}`;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return "-";
    }
  };

  {
    /* =====================================================================
          Funciones auxiliares 
      ======================================================================*/
  }

  useEffect(() => {
    const reportante = obtenerSesionReportante();
    const decano = obtenerSesionDecano();
    const encargado = obtenerSesionEncargado();

    if (reportante?.id) {
      setRolActual("reportante");
      listarPorReportante(reportante.id);
    } else if (encargado?.id) {
      setRolActual("encargado");
      listarPorEncargado(encargado.id);
    } else if (decano?.id) {
      setRolActual("decano");
      listarPorFacultadDecano(decano.id);
    }
  }, [listarPorReportante, listarPorEncargado, listarPorFacultadDecano]);

  useEffect(() => {
    if (imagenSeleccionada || modalAsignarAbierto || modalFinalizarAbierto) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [imagenSeleccionada, modalAsignarAbierto, modalFinalizarAbierto]);

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Reportado":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-white/5 border border-white/10 px-2.5 py-1 text-xs font-medium text-white/60">
            <Clock className="h-3 w-3" />
            Reportado
          </span>
        );
      case "En Proceso":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-[#4a3f2b]/30 border border-[#b19a77]/30 px-2.5 py-1 text-xs font-medium text-[#b19a77]">
            <Wrench className="h-3 w-3" />
            En Proceso
          </span>
        );
      case "Resuelto":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-green-900/20 border border-green-500/20 px-2.5 py-1 text-xs font-medium text-green-400">
            <CheckCircle className="h-3 w-3" />
            Resuelto
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-white/5 border border-white/10 px-2.5 py-1 text-xs font-medium text-white/60">
            {estado}
          </span>
        );
    }
  };

  return (
    <>
      <div className="w-full rounded-[28px] border border-white/5 bg-[#111118] shadow-lg flex flex-col animate-fade-in">
        {/* Cabecera */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/5">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Registro de Incidencias
            </h2>
            <p className="mt-1 text-sm text-white/50">
              Visualiza y gestiona los reportes del campus.
            </p>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto p-2 custom-scrollbar">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-white/40 border-b border-white/5 whitespace-nowrap">
                <th className="pb-4 pt-2 pl-6 font-semibold">Problema</th>
                <th className="pb-4 pt-2 px-4 font-semibold">Descripción</th>
                {/* NUEVA COLUMNA DE FACULTAD */}
                <th className="pb-4 pt-2 px-4 font-semibold">Facultad</th>
                <th className="pb-4 pt-2 px-4 font-semibold">Ubicación</th>
                <th className="pb-4 pt-2 px-4 font-semibold">Categoría</th>
                <th className="pb-4 pt-2 px-4 font-semibold">Fecha y Hora</th>
                <th className="pb-4 pt-2 px-4 font-semibold text-center">
                  Evidencia
                </th>
                <th className="pb-4 pt-2 px-4 font-semibold">Estado</th>
                <th className="pb-4 pt-2 pr-6 font-semibold text-right">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="text-white/80">
              {incidencias.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-white/5 hover:bg-white/2 transition-colors group"
                >
                  <td className="py-4 pl-6 pr-4 min-w-37.5 max-w-62.5 wrap-break-word whitespace-normal">
                    <div className="flex items-start gap-2 text-white font-bold">
                      <Type className="h-4 w-4 text-white/30 mt-0.5 shrink-0" />
                      <span>{item.titulo}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-white/50 italic whitespace-normal wrap-break-word min-w-50 max-w-87.5">
                    <div className="flex items-start gap-2">
                      <AlignLeft className="h-4 w-4 text-white/30 mt-0.5 shrink-0" />
                      <span>{item.descripcion}</span>
                    </div>
                  </td>

                  {/* NUEVA CELDA DE FACULTAD */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-white/70 font-medium">
                      <Landmark className="h-4 w-4 text-white/30" />
                      {item.facultad || "Sin Facultad"}
                    </div>
                  </td>

                  <td className="py-4 px-4 min-w-37.5 max-w-50 wrap-break-word whitespace-normal">
                    <div className="flex items-start gap-2 text-white/70">
                      <MapPin className="h-4 w-4 text-white/30 mt-0.5 shrink-0" />
                      <span>{item.ubicacion}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-red-900/10 border border-red-500/10 px-2.5 py-1 text-xs font-medium text-red-300">
                      <Tags className="h-3 w-3 opacity-80 shrink-0" />
                      {item.clasificacion || item.id_clasificacion}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-white/50 whitespace-nowrap">
                    <div className="flex items-center gap-2 font-medium">
                      <Calendar className="h-3.5 w-3.5 shrink-0" />
                      {formatearFechaSegura(item.fecha)}
                    </div>
                  </td>

                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    {item.imagen_evidencia ? (
                      <div
                        className="inline-flex items-center justify-center rounded-lg bg-blue-900/20 p-1.5 border border-blue-500/20 text-blue-400 cursor-pointer hover:bg-blue-900/40 transition-colors"
                        title="Ver Evidencia"
                        onClick={() =>
                          setImagenSeleccionada(item.imagen_evidencia)
                        }
                      >
                        <ImageIcon className="h-4 w-4" />
                      </div>
                    ) : (
                      <span className="text-white/20">-</span>
                    )}
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap">
                    {getEstadoBadge(item.estado)}
                  </td>

                  {/* CELDA DE ACCIONES */}
                  <td className="py-4 pr-6">
                    <div className="flex justify-end items-center gap-2">
                      {item.estado === "Resuelto" && (
                        <button
                          onClick={() => {
                            N_Incidencia.seleccionarIncidencia(item);
                            setModalFinalizarAbierto(true);
                          }}
                          className="ml-auto flex items-center justify-center gap-2 rounded-lg border border-blue-500/40 bg-blue-500/10 px-4 py-1.5 text-xs font-bold text-blue-400 transition-all hover:bg-blue-600 hover:text-white hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] active:scale-95"
                        >
                          Ver Cierre
                        </button>
                      )}

                      {rolActual === "decano" &&
                        item.estado !== "Resuelto" &&
                        (!item.id_encargado ? (
                          <button
                            onClick={() => {
                              N_Incidencia.seleccionarIncidencia(item);
                              setModalAsignarAbierto(true);
                            }}
                            className="ml-auto flex items-center justify-center gap-2 rounded-lg border border-[#a08a68]/40 bg-[#a08a68]/10 px-4 py-1.5 text-xs font-bold text-[#cbb592] transition-all hover:bg-[#a08a68] hover:text-white hover:shadow-[0_0_15px_rgba(160,138,104,0.4)] active:scale-95"
                          >
                            Asignar
                          </button>
                        ) : (
                          <div className="ml-auto flex flex-col items-end gap-1 text-xs font-medium text-white/30">
                            <div className="flex items-center gap-1.5 opacity-50">
                              <CheckCircle className="h-3.5 w-3.5" />
                              <span>Asignado a:</span>
                            </div>
                            <span className="text-[11px] text-[#a08a68] font-bold">
                              {item.encargado}
                            </span>
                          </div>
                        ))}

                      {rolActual === "encargado" &&
                        item.estado !== "Resuelto" && (
                          <button
                            onClick={() => {
                              N_Incidencia.seleccionarIncidencia(item);
                              setModalFinalizarAbierto(true);
                            }}
                            className="ml-auto flex items-center justify-center gap-2 rounded-lg border border-green-500/40 bg-green-500/10 px-4 py-1.5 text-xs font-bold text-green-400 transition-all hover:bg-green-600 hover:text-white hover:shadow-[0_0_15px_rgba(34,197,94,0.4)] active:scale-95"
                          >
                            Finalizar
                          </button>
                        )}
                    </div>
                  </td>
                </tr>
              ))}

              {incidencias.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-white/40">
                    No hay incidencias registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =====================================================================
          MODAL DE ASIGNACIÓN DE ENCARGADO (SOLO DECANO)
      ======================================================================*/}
      {modalAsignarAbierto && (
        <P_Asignar_Encargado
          onClose={() => {
            setModalAsignarAbierto(false);
          }}
          onSuccess={() => {
            const decano = obtenerSesionDecano();
            if (decano?.id) listarPorFacultadDecano(decano.id);
          }}
        />
      )}

      {modalFinalizarAbierto && (
        <P_Finalizar_Incidencia
          onClose={() => setModalFinalizarAbierto(false)}
          onSuccess={() => {
            const reportante = obtenerSesionReportante();
            const decano = obtenerSesionDecano();
            const encargado = obtenerSesionEncargado();

            if (rolActual === "reportante" && reportante?.id)
              listarPorReportante(reportante.id);
            else if (rolActual === "encargado" && encargado?.id)
              listarPorEncargado(encargado.id);
            else if (rolActual === "decano" && decano?.id)
              listarPorFacultadDecano(decano.id);
          }}
        />
      )}

      {/* =====================================================================
          MODAL DE VISUALIZACIÓN DE IMAGEN
      ======================================================================*/}
      {imagenSeleccionada && (
        <div
          className="fixed inset-0 z-150 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in"
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
            alt="Evidencia de Incidencia"
            className="max-w-full max-h-[90vh] rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
