import { D_Facultad } from "../Datos/D_Facultad/D_Facultad";
import type { Facultad } from "../Datos/D_Facultad/Facultad";

export class N_Facultad {
  static async registrar(facultad: Facultad) {
    if (!facultad.nombre.trim() || !facultad.sigla.trim()) {
      throw new Error("Todos los campos son obligatorios");
    }

    if (await N_Facultad.buscarPorSigla(facultad.sigla)) {
      throw new Error("La sigla ya está registrada");
    }

    await D_Facultad.registrar(facultad);
  }

  static async actualizar(facultad: Facultad) {
    await D_Facultad.actualizar(facultad);
  }

  static async asignarDecano(id: number, id_decano: number) {
    await D_Facultad.asignarDecano(id, id_decano);
  }

  static async listar() {
    return await D_Facultad.listar();
  }

  static async buscarPorSigla(sigla: string) {
    return await D_Facultad.buscarPorSigla(sigla);
  }

  static async obtenerFacultadDecano(id_decano: number) {
    return await D_Facultad.obtenerFacultadDecano(id_decano);
  }

  static async obtenerFacultadPorId(id: number) {
    return await D_Facultad.obtenerFacultadPorId(id);
  }
  static async eliminar(id: number) {
    await D_Facultad.eliminar(id);
  }
}
