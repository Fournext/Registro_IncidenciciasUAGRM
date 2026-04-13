import React, { useCallback, useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Tags,
  Type,
  AlignLeft,
  Save,
} from "lucide-react";
import { N_Clasificacion_Incidencia } from "../Negocio/N_Clasificacion_Incidencia";

export default function P_Clasificacion_Incidencia() {
  const [clasificaciones, setClasificaciones] = useState<any[]>([]);

  // Control de Modales
  const [isRegistModalOpen, setIsRegistModalOpen] = useState(false);
  const [clasificacionEditando, setClasificacionEditando] = useState<
    any | null
  >(null);

  // Estados para Registrar
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  {
    /* -------------------------------------------------------------------
          CU8 Gestionar Clasificación de Incidencias (Decano)
      ---------------------------------------------------------------------*/
  }

  const listar = useCallback(async () => {
    try {
      const clasificacion_incidencia =
        await N_Clasificacion_Incidencia.listar();
      setClasificaciones(clasificacion_incidencia);
    } catch (error) {
      console.error("Error al obtener clasificaciones:", error);
    }
  }, []);

  // Crear nueva clasificación
  const crear = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await N_Clasificacion_Incidencia.crear({
        id: 0,
        nombre: nombre,
        descripcion: descripcion,
      });
      alert("Clasificación creada con éxito");
      setNombre("");
      setDescripcion("");
      setIsRegistModalOpen(false);
      listar();
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    }
  };

  // Preparar actualizar una clasificación
  const handleOpenEdit = (clasificacion: any) => {
    setClasificacionEditando(clasificacion);
    setNombre(clasificacion.nombre || "");
    setDescripcion(clasificacion.descripcion || "");
  };

  // Actualizar clasificación
  const actualizar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await N_Clasificacion_Incidencia.actualizar({
        id: clasificacionEditando.id,
        nombre: nombre,
        descripcion: descripcion,
      });
      alert("Clasificación actualizada con éxito");
      setClasificacionEditando(null);
      listar();
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    }
  };

  // ==========================================
  // Eliminar clasificación
  // ==========================================
  const eliminar = async (id: number) => {
    if (
      window.confirm("¿Estás seguro de que deseas eliminar esta clasificación?")
    ) {
      try {
        await N_Clasificacion_Incidencia.eliminar(id);

        alert("Clasificación eliminada con éxito");
        listar();
      } catch (error) {
        console.error(error);
        alert((error as Error).message);
      }
    }
  };

  {
    /* -------------------------------------------------------------------
          Funciones auxiliares y efectos
      ---------------------------------------------------------------------*/
  }

  useEffect(() => {
    listar().catch(console.error);
  }, [listar]);

  // Bloqueo de scroll
  useEffect(() => {
    if (isRegistModalOpen || clasificacionEditando) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isRegistModalOpen, clasificacionEditando]);

  return (
    <>
      {/* CONTENEDOR PRINCIPAL: TABLA */}
      <div className="w-full rounded-[28px] border border-white/5 bg-[#111118] shadow-lg flex flex-col animate-fade-in">
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Clasificaciones Registradas
          </h2>
          <button
            onClick={() => setIsRegistModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-[#a08a68] px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#8e7a5c] active:scale-[0.98]"
          >
            Añadir Clasificación
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-x-auto p-2">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="text-white/40 border-b border-white/5">
                <th className="pb-4 pt-2 pl-6 font-semibold w-1/3">Nombre</th>
                <th className="pb-4 pt-2 px-4 font-semibold">Descripción</th>
                <th className="pb-4 pt-2 pr-6 font-semibold text-right">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="text-white/80">
              {clasificaciones.map((item: any) => (
                <tr
                  key={item.id}
                  className="border-b border-white/5 hover:bg-white/2 transition-colors group"
                >
                  <td className="py-4 pl-6 pr-4 font-bold text-white">
                    <div className="flex items-center gap-3">
                      <Tags className="h-4 w-4 text-[#a08a68]" />
                      {item.nombre}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-white/50 italic whitespace-normal min-w-62.5">
                    {item.descripcion || "Sin descripción"}
                  </td>
                  <td className="py-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* BOTÓN EDITAR */}
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="rounded-lg bg-white/5 border border-white/10 p-2 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      {/* BOTÓN ELIMINAR */}
                      <button
                        onClick={() => eliminar(item.id)}
                        className="rounded-lg bg-white/5 border border-white/10 p-2 text-white/50 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {clasificaciones.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-white/40">
                    No hay clasificaciones registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: REGISTRAR */}
      {isRegistModalOpen && (
        <div className="fixed inset-0 z-100 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
          <div className="flex min-h-full items-center justify-center p-4 py-10">
            <div className="relative w-full max-w-105 rounded-[28px] border border-white/10 bg-[#111118] shadow-2xl px-8 py-10 transition-all">
              <button
                onClick={() => setIsRegistModalOpen(false)}
                className="absolute right-5 top-5 rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white transition outline-none"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#2a2a35] border border-white/5 shadow-inner">
                  <Tags className="h-7 w-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Registrar Clasificación
                </h2>
              </div>

              <form onSubmit={crear} className="flex flex-col gap-5">
                <div>
                  <label className="mb-2 block text-xs font-bold text-white/90">
                    Nombre
                  </label>
                  <div className="relative">
                    <Type className="absolute left-4 top-3.5 h-5 w-5 text-white/40" />
                    <input
                      type="text"
                      placeholder="Ej. Problema Eléctrico"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none focus:border-[#a08a68] focus:bg-white/10 transition-colors font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold text-white/90">
                    Descripción (Opcional)
                  </label>
                  <div className="relative">
                    <AlignLeft className="absolute left-4 top-4 h-5 w-5 text-white/40" />
                    <textarea
                      placeholder="Detalles sobre esta categoría..."
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none focus:border-[#a08a68] focus:bg-white/10 transition-colors font-medium min-h-25 resize-y"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#a08a68] px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#8e7a5c] active:scale-[0.98]"
                  >
                    Guardar
                    <Save className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR */}
      {clasificacionEditando && (
        <div className="fixed inset-0 z-100 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
          <div className="flex min-h-full items-center justify-center p-4 py-10">
            <div className="relative w-full max-w-105 rounded-[28px] border border-white/10 bg-[#111118] shadow-2xl px-8 py-10 transition-all">
              <button
                onClick={() => setClasificacionEditando(null)}
                className="absolute right-5 top-5 rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white transition outline-none"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#2a2a35] border border-white/5 shadow-inner">
                  <Pencil className="h-7 w-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Editar Clasificación
                </h2>
              </div>

              <form onSubmit={actualizar} className="flex flex-col gap-5">
                <div>
                  <label className="mb-2 block text-xs font-bold text-white/90">
                    Nombre
                  </label>
                  <div className="relative">
                    <Type className="absolute left-4 top-3.5 h-5 w-5 text-white/40" />
                    <input
                      type="text"
                      placeholder="Ej. Problema Eléctrico"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none focus:border-[#a08a68] focus:bg-white/10 transition-colors font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold text-white/90">
                    Descripción (Opcional)
                  </label>
                  <div className="relative">
                    <AlignLeft className="absolute left-4 top-4 h-5 w-5 text-white/40" />
                    <textarea
                      placeholder="Detalles sobre esta categoría..."
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none focus:border-[#a08a68] focus:bg-white/10 transition-colors font-medium min-h-25 resize-y"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#a08a68] px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#8e7a5c] active:scale-[0.98]"
                  >
                    Actualizar
                    <Save className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
