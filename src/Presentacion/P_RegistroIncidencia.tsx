import React, { useState, useEffect, useCallback } from "react";
import {
  AlertTriangle,
  Type,
  Building2,
  MapPin,
  AlignLeft,
  CloudUpload,
  Send,
} from "lucide-react";
import { N_Facultad } from "../Negocio/N_Facultad";
import { N_Clasificacion_Incidencia } from "../Negocio/N_Clasificacion_Incidencia";
import { N_Incidencia } from "../Negocio/N_Incidencia";

export default function P_RegistroIncidencia() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [idFacultad, setIdFacultad] = useState("");
  const [idClasificacion, setIdClasificacion] = useState("");
  const [imagenEvidencia, setEvidencia] = useState<File | null>(null);

  const [facultades, setFacultades] = useState<any[]>([]);
  const [clasificaciones, setClasificaciones] = useState<any[]>([]);

  const reportante = JSON.parse(localStorage.getItem("reportante") || "{}");

  {
    /* =====================================================================
          CU6 Registrar Incidencias 
      ======================================================================*/
  }

  //Listar facultades para el select
  const listarFacultades = useCallback(async () => {
    try {
      const dataFacultades = await N_Facultad.listar();
      setFacultades(dataFacultades);
    } catch (error) {
      console.error("Error al cargar facultades:", error);
    }
  }, []);

  // Listar clasificaciones para el select
  const listarClasificaciones = useCallback(async () => {
    try {
      const dataClasificaciones = await N_Clasificacion_Incidencia.listar();
      setClasificaciones(dataClasificaciones);
    } catch (error) {
      console.error("Error al cargar clasificaciones:", error);
    }
  }, []);

  const registrar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reportante.id) {
      alert("Error: No se encontró la sesión del reportante.");
      return;
    }

    try {
      const imagenURL = await N_Incidencia.convertirIMG_URL(imagenEvidencia!);
      const fechaActual = new Date();

      const nuevaIncidencia = {
        id: 0,
        titulo,
        descripcion,
        ubicacion,
        id_facultad: parseInt(idFacultad),
        id_clasificacion: parseInt(idClasificacion),
        id_reportante: reportante.id,
        fecha: fechaActual,
        estado: "Reportado",
        imagen_evidencia: imagenURL || undefined,
      };

      await N_Incidencia.registrar(nuevaIncidencia);

      alert("Incidencia reportada con éxito.");

      // Limpiar formulario
      setTitulo("");
      setIdFacultad("");
      setUbicacion("");
      setIdClasificacion("");
      setDescripcion("");
      setEvidencia(null);
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al registrar la incidencia.");
    }
  };

  {
    /* =====================================================================
          Funciones auxiliares para listar facultades y clasificaciones en los selects 
      ======================================================================*/
  }

  useEffect(() => {
    listarClasificaciones().catch(console.error);
  }, [listarClasificaciones]);

  useEffect(() => {
    listarFacultades().catch(console.error);
  }, [listarFacultades]);

  // Manejo del input de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setEvidencia(e.target.files[0]);
    }
  };

  return (
    <main className="flex items-center justify-center px-6 py-12 animate-fade-in w-full">
      <div className="w-full max-w-2xl rounded-[28px] border border-white/10 bg-[#111118] shadow-[0_20px_80px_rgba(0,0,0,0.55)] px-8 py-10 sm:px-12">
        {/* ENCABEZADO DEL FORMULARIO */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#b8a07a,#756754)] shadow-lg shadow-[#b8a07a]/20">
            <AlertTriangle className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Reportar Incidencia
          </h1>
          <p className="mt-2 text-sm text-white/55">
            Ayúdanos a mantener nuestro campus en óptimas condiciones.
          </p>
        </div>

        {/* FORMULARIO */}
        <form onSubmit={registrar} className="space-y-6">
          {/* Título del problema */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-white/70 uppercase tracking-wider">
              Título del problema
            </label>
            <div className="relative">
              <Type className="absolute left-4 top-3.5 h-5 w-5 text-white/40" />
              <input
                type="text"
                placeholder="Ej. Lámpara fundida, Fuga de agua..."
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#b19a77] focus:bg-white/10 transition-colors"
                required
              />
            </div>
          </div>

          {/* Facultad Académica */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-white/70 uppercase tracking-wider">
              Facultad Académica
            </label>
            <div className="relative">
              <Building2 className="absolute left-4 top-3.5 h-5 w-5 text-white/40" />
              <select
                value={idFacultad}
                onChange={(e) => setIdFacultad(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none focus:border-[#b19a77] focus:bg-white/10 transition-colors appearance-none cursor-pointer"
                required
              >
                <option
                  value=""
                  disabled
                  className="bg-[#111118] text-white/50"
                >
                  Selecciona una facultad...
                </option>
                {/* RENDERIZADO DINÁMICO DESDE BD */}
                {facultades.map((fac) => (
                  <option key={fac.id} value={fac.id} className="bg-[#111118]">
                    {fac.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Ubicación*/}
          <div>
            <label className="mb-2 block text-xs font-semibold text-white/70 uppercase tracking-wider">
              Ubicación exacta
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-white/40" />
              <input
                type="text"
                placeholder="Ej. Edificio A, Aula 302"
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#b19a77] focus:bg-white/10 transition-colors"
                required
              />
            </div>
          </div>

          {/* Clasificación */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-white/70 uppercase tracking-wider">
              Clasificación
            </label>
            <div className="relative">
              <AlertTriangle className="absolute left-4 top-3.5 h-5 w-5 text-white/40" />
              <select
                value={idClasificacion}
                onChange={(e) => setIdClasificacion(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none focus:border-[#b19a77] focus:bg-white/10 transition-colors appearance-none cursor-pointer"
                required
              >
                <option
                  value=""
                  disabled
                  className="bg-[#111118] text-white/50"
                >
                  Selecciona la clasificación...
                </option>
                {/* RENDERIZADO DINÁMICO DESDE BD */}
                {clasificaciones.map((clasificacion) => (
                  <option
                    key={clasificacion.id}
                    value={clasificacion.id}
                    className="bg-[#111118]"
                  >
                    {clasificacion.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Descripción*/}
          <div>
            <label className="mb-2 block text-xs font-semibold text-white/70 uppercase tracking-wider">
              Descripción detallada
            </label>
            <div className="relative">
              <AlignLeft className="absolute left-4 top-4 h-5 w-5 text-white/40" />
              <textarea
                placeholder="Describe el problema con el mayor detalle posible..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#b19a77] focus:bg-white/10 transition-colors min-h-30 resize-y"
                required
              />
            </div>
          </div>

          {/* Evidencia (Upload) */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-white/70 uppercase tracking-wider">
              Evidencia (Opcional)
            </label>

            {/* Hacemos el div clickeable y apuntamos a un input oculto */}
            <label className="mt-1 flex justify-center px-6 pt-8 pb-8 border-2 border-white/10 border-dashed rounded-xl bg-white/5 hover:bg-white/10 hover:border-white/20 transition-colors cursor-pointer group relative">
              <input
                type="file"
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              <div className="space-y-2 text-center">
                <CloudUpload className="mx-auto h-10 w-10 text-white/40 group-hover:text-[#b19a77] transition-colors" />
                <div className="flex flex-col text-sm text-white/60 justify-center">
                  {imagenEvidencia ? (
                    <span className="font-medium text-[#b19a77]">
                      Archivo seleccionado: {imagenEvidencia.name}
                    </span>
                  ) : (
                    <>
                      <span className="font-medium text-[#b19a77] group-hover:text-[#c4ad8d] transition-colors">
                        Arrastra y suelta o selecciona un archivo
                      </span>
                      <p className="text-xs text-white/40 mt-1">
                        Formatos soportados: JPG, PNG, PDF, Word. Max. 5MB.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </label>
          </div>

          {/* Botón de Enviar */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#b19a77] px-8 py-4 text-sm font-bold text-white transition-all hover:bg-[#a08a68] hover:shadow-lg hover:shadow-[#b19a77]/20 active:scale-[0.98]"
            >
              Enviar Incidencia
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
