import React, { useCallback, useEffect, useState } from "react";
import {
  Plus,
  Phone,
  Pencil,
  Trash2,
  X,
  HardHat,
  User,
  Wrench,
  Lock,
  Save,
} from "lucide-react";
import { N_Encargado_Mantenimiento } from "../Negocio/N_Encargado_Mantenimiento";

export default function P_Encargado_Mantenimiento() {
  const [encargados, setEncargados] = useState<any[]>([]);

  // Control de Modales
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [encargado, setEncargado] = useState<any | null>(null);

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [telefono, setTelefono] = useState("");
  const [contrasena, setContrasena] = useState("");

  {
    /* -------------------------------------------------------------------
          CU3 Gestionar Encargados de Mantenimiento (Registrar, Listar, Editar, Eliminar)
      ---------------------------------------------------------------------*/
  }

  // Funcio para Registrar
  const registrar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await N_Encargado_Mantenimiento.registrar({
        id: 0,
        nombre: nombre,
        apellido: apellido,
        telefono: telefono,
        especialidad: especialidad,
        contrasena: contrasena,
      });

      alert("Encargado registrado con éxito");

      // Limpieza
      setNombre("");
      setApellido("");
      setEspecialidad("");
      setTelefono("");
      setContrasena("");
      setIsAddModalOpen(false);

      listar();
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    }
  };

  // Funciones para Listar
  const listar = useCallback(async () => {
    try {
      const data = await N_Encargado_Mantenimiento.listar();
      setEncargados(data);
    } catch (error) {
      console.error("Error al obtener la lista de encargados:", error);
    }
  }, []);

  // Funcion para actualizar
  const actualizar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await N_Encargado_Mantenimiento.actualizar({
        id: encargado.id,
        nombre: nombre,
        apellido: apellido,
        telefono: telefono,
        especialidad: especialidad,
        contrasena: contrasena,
      });

      alert("Encargado actualizado con éxito");
      setEncargado(null);
      listar();
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    }
  };

  // funcion para eliminar
  const eliminar = async (id: number) => {
    if (
      window.confirm("¿Estás seguro de que deseas eliminar este encargado?")
    ) {
      try {
        await N_Encargado_Mantenimiento.eliminar(id);
        alert("Encargado eliminado con éxito");
        listar();
      } catch (error) {
        console.error("Error al eliminar el encargado:", error);
        alert((error as Error).message);
      }
    }
  };

  {
    /* -------------------------------------------------------------------
          Funciones auxiliares para manejo de modales y scroll
      ---------------------------------------------------------------------*/
  }

  useEffect(() => {
    listar().catch(console.error);
  }, [listar]);

  // Preparar datos para Editar
  const handleOpenEdit = (encargado: any) => {
    setEncargado(encargado);
    setNombre(encargado.nombre || "");
    setApellido(encargado.apellido || "");
    setEspecialidad(encargado.especialidad || "");
    setTelefono(encargado.telefono?.toString() || "");
    setContrasena("");
  };

  // Bloqueo de scroll para evitar scroll doble con los modales
  useEffect(() => {
    if (isAddModalOpen || encargado) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isAddModalOpen, encargado]);

  return (
    <>
      <div className="w-full rounded-[28px] border border-white/5 bg-[#111118] shadow-lg flex flex-col animate-fade-in">
        {/* Cabecera */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Personal Registrado
          </h2>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-[#a08a68] px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#8e7a5c] active:scale-[0.98]"
          >
            Registrar Encargado
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto p-2">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="text-white/40 border-b border-white/5">
                <th className="pb-4 pt-2 pl-6 font-semibold">Nombre</th>
                <th className="pb-4 pt-2 pl-6 font-semibold">Apellido</th>
                <th className="pb-4 pt-2 px-4 font-semibold">Especialidad</th>
                <th className="pb-4 pt-2 px-4 font-semibold">Teléfono</th>
                <th className="pb-4 pt-2 pr-6 font-semibold text-right">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="text-white/80">
              {encargados.map((encargado) => (
                <tr
                  key={encargado.id}
                  className="border-b border-white/5 hover:bg-white/2 transition-colors group"
                >
                  <td className="py-4 pl-6 font-bold text-white">
                    {encargado.nombre}
                  </td>
                  <td className="py-4 pl-6 font-bold text-white">
                    {encargado.apellido}
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-block rounded-md bg-white/5 border border-white/10 px-3 py-1.5 text-xs font-medium text-white/70">
                      {encargado.especialidad}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-white/50">
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5" />
                      {encargado.telefono}
                    </div>
                  </td>
                  <td className="py-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="rounded-lg bg-white/5 border border-white/10 p-2 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                        title="Editar"
                        onClick={() => handleOpenEdit(encargado)}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        className="rounded-lg bg-white/5 border border-white/10 p-2 text-white/50 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition-colors"
                        title="Eliminar"
                        onClick={() => eliminar(encargado.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {encargados.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-white/40">
                    No hay encargados registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* -------------------------------------------------------------------
          MODAL INTERNO: REGISTRAR ENCARGADO
      ---------------------------------------------------------------------*/}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-100 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
          <div className="flex min-h-full items-center justify-center p-4 py-10">
            <div className="relative w-full max-w-105 rounded-[28px] border border-white/10 bg-[#111118] shadow-2xl px-8 py-10 transition-all">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute right-5 top-5 rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white transition outline-none"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#2a2a35] border border-white/5 shadow-inner">
                  <HardHat className="h-7 w-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Añadir Encargado
                </h2>
              </div>

              <form onSubmit={registrar} className="space-y-5">
                <div>
                  <label className="mb-2 block text-xs font-semibold text-white/90">
                    Nombre
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 h-5 w-5 text-white/40" />
                    <input
                      type="text"
                      placeholder="Ej. Carlos"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none focus:border-[#a08a68] focus:bg-white/10 transition-colors font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-white/90">
                    Apellido
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 h-5 w-5 text-white/40" />
                    <input
                      type="text"
                      placeholder="Ej. Martínez"
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none focus:border-[#a08a68] focus:bg-white/10 transition-colors font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-white/90">
                    Especialidad
                  </label>
                  <div className="relative">
                    <Wrench className="absolute left-4 top-3.5 h-5 w-5 text-white/40" />
                    <input
                      type="text"
                      placeholder="Ej. Electricista, Plomero"
                      value={especialidad}
                      onChange={(e) => setEspecialidad(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none focus:border-[#a08a68] focus:bg-white/10 transition-colors font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-white/90">
                    Teléfono
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3.5 h-5 w-5 text-white/40" />
                    <input
                      type="tel"
                      placeholder="12345678"
                      value={telefono}
                      onChange={(e) =>
                        setTelefono(e.target.value)
                      }
                      className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none focus:border-[#a08a68] focus:bg-white/10 transition-colors font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-white/90">
                    Contraseña de acceso
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 h-5 w-5 text-white/40" />
                    <input
                      type="password"
                      placeholder="Establecer contraseña"
                      value={contrasena}
                      onChange={(e) => setContrasena(e.target.value)}
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
                    Guardar Encargado
                    <Save className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------
          MODAL INTERNO: EDITAR ENCARGADO
      ---------------------------------------------------------------------*/}
      {encargado && (
        <div className="fixed inset-0 z-100 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
          <div className="flex min-h-full items-center justify-center p-4 py-10">
            <div className="relative w-full max-w-105 rounded-[28px] border border-white/10 bg-[#111118] shadow-2xl px-8 py-10 transition-all">
              <button
                onClick={() => setEncargado(null)}
                className="absolute right-5 top-5 rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white transition outline-none"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#2a2a35] border border-white/5 shadow-inner">
                  <HardHat className="h-7 w-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Editar Encargado
                </h2>
              </div>

              <form onSubmit={actualizar} className="space-y-5">
                <div>
                  <label className="mb-2 block text-xs font-semibold text-white/90">
                    Nombre
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 h-5 w-5 text-white/40" />
                    <input
                      type="text"
                      placeholder="Ej. Carlos"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none focus:border-[#a08a68] focus:bg-white/10 transition-colors font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-white/90">
                    Apellido
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 h-5 w-5 text-white/40" />
                    <input
                      type="text"
                      placeholder="Ej. Martínez"
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none focus:border-[#a08a68] focus:bg-white/10 transition-colors font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-white/90">
                    Especialidad
                  </label>
                  <div className="relative">
                    <Wrench className="absolute left-4 top-3.5 h-5 w-5 text-white/40" />
                    <input
                      type="text"
                      placeholder="Ej. Electricista, Plomero"
                      value={especialidad}
                      onChange={(e) => setEspecialidad(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none focus:border-[#a08a68] focus:bg-white/10 transition-colors font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-white/90">
                    Teléfono
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3.5 h-5 w-5 text-white/40" />
                    <input
                      type="tel"
                      placeholder="12345678"
                      value={telefono}
                      onChange={(e) =>
                        setTelefono(e.target.value)
                      }
                      className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none focus:border-[#a08a68] focus:bg-white/10 transition-colors font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-white/90">
                    Contraseña de acceso
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 h-5 w-5 text-white/40" />
                    <input
                      type="password"
                      placeholder="••••••"
                      value={contrasena}
                      onChange={(e) => setContrasena(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none focus:border-[#a08a68] focus:bg-white/10 transition-colors font-medium"
                    />
                    <p className="mt-1 text-[10px] text-white/40 ml-1">
                      Dejar en blanco para mantener la actual.
                    </p>
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
