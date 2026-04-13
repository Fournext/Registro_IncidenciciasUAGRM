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
  UserCheck,
  HardHat,
  Landmark,
} from "lucide-react";
import { N_Incidencia } from "../Negocio/N_Incidencia";
import { N_Encargado_Mantenimiento } from "../Negocio/N_Encargado_Mantenimiento";
import { N_Cierre_Incidencia } from "../Negocio/N_Cierre_Incidencia";

export default function P_Incidencia() {
  const [incidencias, setIncidencias] = useState<any[]>([]);
  const [imagenSeleccionada, setImagenSeleccionada] = useState<string | null>(
    null,
  );
  const [rolActual, setRolActual] = useState("");
  const [incidencia, setIncidencia] = useState<any>(null);
  const [listarEncargados, setListarEncargadosMantenimiento] = useState<any[]>(
    [],
  );
  const [id_encargado, setIdEncargado] = useState(0);

  // ==========================================
  // ESTADOS PARA ASIGNACIÓN (DECANO)
  // ==========================================
  const [modalAsignarAbierto, setModalAsignarAbierto] = useState(false);

  // ==========================================
  // ESTADOS PARA FINALIZAR (ENCARGADO)
  // ==========================================
  const [modalFinalizarAbierto, setModalFinalizarAbierto] = useState(false);
  const [detallesCierre, setDetallesCierre] = useState<
    { file: File | null; preview: string; descripcion: string }[]
  >([{ file: null, preview: "", descripcion: "" }]);
  const [observacion, setObservacion] = useState("");

  // ==========================================
  // ESTADOS PARA VER CIERRE
  // ==========================================
  const [modalVerCierreAbierto, setModalVerCierreAbierto] = useState(false);
  const [cierreSeleccionado, setCierreSeleccionado] = useState<any>(null);

  {
    /* =====================================================================
          CU6 Registrar Incidencias 
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
          CU9 Asignar incidencia a personal de mantenimiento (DECANO)
      ======================================================================*/
  }

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
    if (!id_encargado) return alert("Por favor selecciona un encargado.");
    try {
      await N_Incidencia.asignarEncargado(incidencia.id, id_encargado);

      alert("Personal asignado con éxito.");
      setModalAsignarAbierto(false);
      setIncidencia(null);
      setIdEncargado(0);

      const decano = JSON.parse(localStorage.getItem("decano") || "null");
      if (decano?.id) listarPorFacultadDecano(decano.id);
    } catch (error) {
      console.error(error);
      alert("Error al asignar el encargado.");
    }
  };

  {
    /* =====================================================================
          CU10 Finalizar incidencia con evidencia fotográfica (ENCARGADO DE MANTENIMIENTO)
      ======================================================================*/
  }

  const registrarCierre = async () => {
    try {
      const detalles = await Promise.all(
        detallesCierre
          .filter((e) => e.file || e.descripcion.trim())
          .map(async (ev) => {
            let imgURL = "";
            if (ev.file) {
              imgURL =
                (await N_Incidencia.convertirIMG_URL(ev.file as File)) || "";
            }
            return {
              id: 0,
              descripcion: ev.descripcion,
              imagen_solucion: imgURL,
              id_cierre_incidencia: 0,
            };
          }),
      );

      const encargado = JSON.parse(localStorage.getItem("encargado") || "null");

      const cierre = {
        id: 0,
        observacion: observacion,
        fecha: new Date(),
        id_incidencia: incidencia.id,
        id_encargado: encargado?.id || 0,
        detalle_cierre_incidencias: detalles,
      };

      await N_Cierre_Incidencia.registrarCierre(cierre);

      alert(
        "Incidencia finalizada en la base de datos correctamente con " +
          detalles.length +
          " evidencia(s).",
      );
      setModalFinalizarAbierto(false);
      setIncidencia(null);
      setDetallesCierre([{ file: null, preview: "", descripcion: "" }]);
      setObservacion("");

      if (encargado?.id) {
        listarPorEncargado(encargado.id);
      }
    } catch (error) {
      alert("Error intentando cerrar incidencia:" + error);
    }
  };

  const listarCierrePorIncidencia = async (incidenciaItem: any) => {
    try {
      const datosCierre = await N_Cierre_Incidencia.listarCierrePorIncidencia(
        incidenciaItem.id,
      );
      if (datosCierre && datosCierre.length > 0) {
        setIncidencia(incidenciaItem);
        setCierreSeleccionado(datosCierre[0]);
        setModalVerCierreAbierto(true);
      } else {
        alert("No se encontró información del cierre para esta incidencia.");
      }
    } catch (error) {
      console.error("Error obteniendo cierre:", error);
      alert("Error al intentar obtener el cierre de la incidencia.");
    }
  };

  const eliminarCierre = async () => {
    if (!cierreSeleccionado || !incidencia) return;

    if (
      window.confirm(
        "¿Estás seguro de eliminar este cierre y reabrir la incidencia?",
      )
    ) {
      try {
        await N_Cierre_Incidencia.eliminarCierre(
          cierreSeleccionado.id,
          incidencia.id,
        );

        alert("Cierre eliminado con éxito.");
        setModalVerCierreAbierto(false);
        setCierreSeleccionado(null);
        setIncidencia(null);

        const reportante = JSON.parse(
          localStorage.getItem("reportante") || "null",
        );
        const decano = JSON.parse(localStorage.getItem("decano") || "null");
        const encargado = JSON.parse(
          localStorage.getItem("encargado") || "null",
        );

        if (rolActual === "reportante" && reportante?.id)
          listarPorReportante(reportante.id);
        else if (rolActual === "encargado" && encargado?.id)
          listarPorEncargado(encargado.id);
        else if (rolActual === "decano" && decano?.id)
          listarPorFacultadDecano(decano.id);
      } catch (error) {
        console.error("Error eliminando cierre:", error);
        alert("Error al intentar eliminar el cierre.");
      }
    }
  };

  {
    /* =====================================================================
          Funciones auxiliares 
      ======================================================================*/
  }

  useEffect(() => {
    listarEncargadosMantenimiento().catch(console.error);
  }, [listarEncargadosMantenimiento]);

  useEffect(() => {
    const reportante = JSON.parse(localStorage.getItem("reportante") || "null");
    const decano = JSON.parse(localStorage.getItem("decano") || "null");
    const encargado = JSON.parse(localStorage.getItem("encargado") || "null");

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
    if (
      imagenSeleccionada ||
      modalAsignarAbierto ||
      modalFinalizarAbierto ||
      modalVerCierreAbierto
    ) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [
    imagenSeleccionada,
    modalAsignarAbierto,
    modalFinalizarAbierto,
    modalVerCierreAbierto,
  ]);

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
                          onClick={() => listarCierrePorIncidencia(item)}
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
                              setIncidencia(item);
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
                              setIncidencia(item);
                              setDetallesCierre([
                                { file: null, preview: "", descripcion: "" },
                              ]);
                              setObservacion("");
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
        <div className="fixed inset-0 z-150 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative w-full max-w-105 rounded-[28px] border border-white/10 bg-[#16161c] shadow-2xl p-8">
            <button
              onClick={() => {
                setModalAsignarAbierto(false);
                setIncidencia(null);
                setIdEncargado(0);
              }}
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
                      <option
                        key={enc.id}
                        value={enc.id}
                        className="bg-[#111118]"
                      >
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
      )}

      {/* =====================================================================
          MODAL DE FINALIZAR INCIDENCIA (SOLO ENCARGADO)
      ======================================================================*/}
      {modalFinalizarAbierto && (
        <div className="fixed inset-0 z-150 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#16161c] shadow-2xl [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 hover:[&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
            <div className="p-6">
              <button
                onClick={() => {
                  setModalFinalizarAbierto(false);
                  setIncidencia(null);
                  setDetallesCierre([
                    { file: null, preview: "", descripcion: "" },
                  ]);
                  setObservacion("");
                }}
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
                        onClick={() => {
                          const nuevas = [...detallesCierre];
                          nuevas.splice(index, 1);
                          setDetallesCierre(nuevas);
                        }}
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
                              const nuevas = [...detallesCierre];
                              nuevas[index].file = file;
                              nuevas[index].preview = URL.createObjectURL(file);
                              setDetallesCierre(nuevas);
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
                          onChange={(e) => {
                            const nuevas = [...detallesCierre];
                            nuevas[index].descripcion = e.target.value;
                            setDetallesCierre(nuevas);
                          }}
                          className="w-full rounded-xl border border-white/10 bg-[#16161c] px-3 py-2 text-xs text-white outline-none focus:border-green-500/50 focus:bg-[#1a1a22] transition-colors resize-none h-22 custom-scrollbar"
                          placeholder="Ej: Se reemplazó la pieza por una nueva..."
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() =>
                    setDetallesCierre([
                      ...detallesCierre,
                      { file: null, preview: "", descripcion: "" },
                    ])
                  }
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
        </div>
      )}

      {/* =====================================================================
          MODAL DE VER CIERRE INCIDENCIA
      ======================================================================*/}
      {modalVerCierreAbierto && cierreSeleccionado && (
        <div className="fixed inset-0 z-150 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#16161c] shadow-2xl [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 hover:[&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
            <div className="p-6">
              <button
                onClick={() => {
                  setModalVerCierreAbierto(false);
                  setCierreSeleccionado(null);
                  setIncidencia(null);
                }}
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
                <p className="mt-1 text-xs text-white/50">
                  {incidencia?.titulo}
                </p>
              </div>

              <div className="space-y-4 text-white">
                <div className="rounded-xl border border-white/10 bg-[#1e1e24] p-4">
                  <h3 className="text-[13px] font-bold text-white/90 mb-2">
                    Anotación General
                  </h3>
                  <p className="text-xs text-white/70">
                    {cierreSeleccionado.observacion || "Sin anotación general."}
                  </p>
                  <p className="text-[10px] text-white/40 mt-2">
                    Cerrado el: {formatearFechaSegura(cierreSeleccionado.fecha)}
                  </p>
                </div>

                {cierreSeleccionado.detalle_cierre_incidencias?.map(
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

                {(rolActual === "decano" || rolActual === "encargado") && (
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
        </div>
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
