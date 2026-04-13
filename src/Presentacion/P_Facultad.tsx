import React, { useCallback, useEffect, useState } from "react";
import {
  X,
  Plus,
  Pencil,
  Building,
  Landmark,
  Tag,
  Save,
  Trash2,
  Building2,
} from "lucide-react";
import { N_Facultad } from "../Negocio/N_Facultad";
import { createPortal } from "react-dom";

export default function P_Facultad() {
  // Control de Modales
  const [isRegistModalOpen, setIsRegistModalOpen] = useState(false);
  const [isFacultadModalOpen, setIsFacultadModalOpen] = useState(false);

  // Estados Locales
  const decano = JSON.parse(localStorage.getItem("decano") || "{}");
  const [facultades, setFacultades] = useState<any[]>([]);

  const [nombre, setNombre] = useState("");
  const [sigla, setSigla] = useState("");

  const [facultad, setFacultad] = useState<any | null>(null);
  const [facultadAsignada, setFacultadAsignada] = useState<any>({});

  {
    /* =====================================================================
          CU11 Gestionar Facultades
      ======================================================================*/
  }

  // Registrar nueva Facultad
  const registrar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await N_Facultad.registrar({
        id: 0,
        nombre: nombre,
        sigla: sigla,
      });
      alert("Facultad registrada con éxito");

      // Limpieza y cerrado
      setNombre("");
      setSigla("");
      setIsRegistModalOpen(false);
      listar();
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    }
  };

  // Listar Facultades
  const listar = useCallback(async () => {
    try {
      const data = await N_Facultad.listar();
      setFacultades(data);
    } catch (error) {
      console.error("Error al obtener la lista de facultades:", error);
    }
  }, []);

  // Guardar Edición de Facultad
  const actualizar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await N_Facultad.actualizar({
        id: facultad.id,
        nombre: nombre,
        sigla: sigla,
      });
      alert("Facultad actualizada con éxito");
      setFacultad(null);
      listar();
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    }
  };

  // Eliminar Facultad
  const eliminar = async (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta facultad?")) {
      try {
        await N_Facultad.eliminar(id);
        alert("Facultad eliminada con éxito");
        listar();
      } catch (error) {
        console.error(error);
        alert((error as Error).message);
      }
    }
  };

  // funcion para obtener la facultad asignada al decano
  const obtenerFacultadDecano = useCallback(async () => {
    if (!decano.id) return;
    try {
      const data = await N_Facultad.obtenerFacultadDecano(decano.id);
      setFacultadAsignada(data || {});
    } catch (error) {
      console.error("Error al obtener la facultad asignada:", error);
    }
  }, [decano.id]);

  // Asignar Decano a Facultad
  const asignarDecano = async (id_facultad: number) => {
    try {
      const id_decano = decano.id;
      await N_Facultad.asignarDecano(id_facultad, id_decano);
      alert("Facultad asignada con éxito");
      listar();
      obtenerFacultadDecano();
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    }
  };

  {
    /* =====================================================================
          Funciones para manejo de modales y datos de edición
      ======================================================================*/
  }

  useEffect(() => {
    obtenerFacultadDecano().catch(console.error);
  }, [obtenerFacultadDecano]);

  useEffect(() => {
    listar().catch(console.error);
  }, [listar]);

  // Preparar datos para Editar
  const handleOpenEdit = (facultad: any) => {
    setFacultad(facultad);
    setNombre(facultad.nombre || "");
    setSigla(facultad.sigla || "");
  };

  // Bloqueo de scroll para evitar scroll doble
  useEffect(() => {
    if (isFacultadModalOpen || isRegistModalOpen || facultad) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isFacultadModalOpen, isRegistModalOpen, facultad]);

  return (
    <>
      <div className="mt-2 text-left border-t border-white/5 pt-6">
        <label className="mb-2 block text-xs font-medium text-white/50">
          Facultad Asignada:
        </label>
        <div className="flex items-center justify-between rounded-xl border border-white/5 bg-black/20 px-4 py-3">
          <span
            className={`text-sm font-medium ${!facultadAsignada.nombre ? "text-[#a08a68]/70" : "text-white"}`}
          >
            {facultadAsignada.nombre || "Ninguna"}
          </span>
          <button
            type="button"
            onClick={() => setIsFacultadModalOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70 transition-all hover:bg-white/10 hover:text-white"
          >
            <Building2 className="h-3.5 w-3.5" />
            Asignar
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------------
          MODAL PRINCIPAL: GESTIÓN DE FACULTADES (TABLA)
      ---------------------------------------------------------------------*/}
      {isFacultadModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-110 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
            <div className="flex min-h-full items-center justify-center p-4 py-10">
              <div className="relative w-full max-w-160 rounded-[28px] border border-white/10 bg-[#111118] shadow-2xl px-8 py-10 transition-all">
                <button
                  type="button"
                  onClick={() => setIsFacultadModalOpen(false)}
                  className="absolute right-5 top-5 rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white transition outline-none"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="flex items-start justify-between mb-6 pr-12">
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                      Gestión de Facultades
                    </h2>
                    <p className="mt-1 text-sm text-white/50">
                      Selecciona una facultad, o administra el listado.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsRegistModalOpen(true)}
                    className="flex items-center gap-2 rounded-xl bg-[#a08a68] px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#8e7a5c] active:scale-[0.98]"
                  >
                    <Plus className="h-4 w-4" />
                    Registrar
                  </button>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/2 overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/5 text-white/50">
                        <th className="py-4 pl-6 font-semibold w-1/2">
                          Facultad
                        </th>
                        <th className="py-4 px-4 font-semibold">Sigla</th>
                        <th className="py-4 pr-6 font-semibold text-right">
                          Acciones
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-white/5 text-white/90">
                      {facultades.map((facultad: any) => (
                        <tr
                          key={facultad.id}
                          className="hover:bg-white/2 transition-colors group"
                        >
                          <td className="py-4 pl-6 pr-4 font-bold leading-snug">
                            {facultad.nombre}
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-block rounded-md bg-white/5 border border-white/5 px-2.5 py-1 text-xs font-bold tracking-wider text-white/50">
                              {facultad.sigla}
                            </span>
                          </td>
                          <td className="py-4 pr-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => asignarDecano(facultad.id)}
                                disabled={facultad.id_decano != null}
                                className="rounded-lg bg-[#a08a68] px-4 py-1.5 text-xs font-bold text-white transition-all hover:bg-[#8e7a5c] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#a08a68] disabled:active:scale-100"
                              >
                                {facultad.id_decano != null
                                  ? "Asignado"
                                  : "Asignar"}
                              </button>

                              <button
                                onClick={() => handleOpenEdit(facultad)}
                                className="rounded-lg bg-white/5 border border-white/5 p-1.5 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                                title="Editar"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>

                              {/* BOTÓN ELIMINAR */}
                              <button
                                onClick={() => eliminar(facultad.id)}
                                className="rounded-lg bg-white/5 border border-white/5 p-1.5 text-white/50 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition-colors"
                                title="Eliminar"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {facultades.length === 0 && (
                        <tr>
                          <td
                            colSpan={3}
                            className="py-12 text-center text-white/40"
                          >
                            No hay facultades registradas.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* -------------------------------------------------------------------
          MODAL INTERNO: REGISTRAR FACULTAD
      ---------------------------------------------------------------------*/}
      {isRegistModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-120 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
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
                    <Building className="h-7 w-7 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    Registrar Facultad
                  </h2>
                  <p className="mt-1 text-sm text-white/50">
                    Ingresa los datos correspondientes.
                  </p>
                </div>

                <form onSubmit={registrar} className="flex flex-col gap-5">
                  <div>
                    <label className="mb-2 block text-xs font-bold text-white/90">
                      Nombre de la Facultad
                    </label>
                    <div className="relative">
                      <Landmark className="absolute left-4 top-3.5 h-5 w-5 text-white/40" />
                      <input
                        type="text"
                        placeholder="Ej. Facultad de Arquitectura"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#a08a68] focus:bg-white/10 transition-colors font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold text-white/90">
                      Sigla
                    </label>
                    <div className="relative">
                      <Tag className="absolute left-4 top-3.5 h-5 w-5 text-white/40" />
                      <input
                        type="text"
                        placeholder="Ej. FAUD"
                        value={sigla}
                        onChange={(e) => setSigla(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#a08a68] focus:bg-white/10 transition-colors font-medium"
                        required
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
          </div>,
          document.body,
        )}

      {/* -------------------------------------------------------------------
          MODAL INTERNO: EDITAR FACULTAD
      ---------------------------------------------------------------------*/}
      {facultad &&
        createPortal(
          <div className="fixed inset-0 z-120 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
            <div className="flex min-h-full items-center justify-center p-4 py-10">
              <div className="relative w-full max-w-105 rounded-[28px] border border-white/10 bg-[#111118] shadow-2xl px-8 py-10 transition-all">
                <button
                  onClick={() => setFacultad(null)}
                  className="absolute right-5 top-5 rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white transition outline-none"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="mb-8 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#2a2a35] border border-white/5 shadow-inner">
                    <Building className="h-7 w-7 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    Editar Facultad
                  </h2>
                  <p className="mt-1 text-sm text-white/50">
                    Modifica los datos correspondientes.
                  </p>
                </div>

                <form onSubmit={actualizar} className="flex flex-col gap-5">
                  <div>
                    <label className="mb-2 block text-xs font-bold text-white/90">
                      Nombre de la Facultad
                    </label>
                    <div className="relative">
                      <Landmark className="absolute left-4 top-3.5 h-5 w-5 text-white/40" />
                      <input
                        type="text"
                        placeholder="Ej. Facultad de Arquitectura"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none focus:border-[#a08a68] focus:bg-white/10 transition-colors font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold text-white/90">
                      Sigla
                    </label>
                    <div className="relative">
                      <Tag className="absolute left-4 top-3.5 h-5 w-5 text-white/40" />
                      <input
                        type="text"
                        placeholder="Ej. FAUD"
                        value={sigla}
                        onChange={(e) => setSigla(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none focus:border-[#a08a68] focus:bg-white/10 transition-colors font-medium"
                        required
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
          </div>,
          document.body,
        )}
    </>
  );
}
