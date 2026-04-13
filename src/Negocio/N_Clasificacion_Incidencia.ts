import {
  D_Clasificacion_Incidencia,
  type ClasificacionIncidencia,
} from "../Datos/D_Clasificacion_Incidencia/D_Clasificaion_Incidencia";

export class N_Clasificacion_Incidencia {
  static async crear(clasificacion_incidencia: ClasificacionIncidencia) {
    if (!clasificacion_incidencia.nombre.trim()) {
      throw new Error("El nombre es obligatorio");
    }

    const existente = await N_Clasificacion_Incidencia.obtenerClasificacion(
      clasificacion_incidencia.nombre,
    );

    if (existente) {
      throw new Error("La clasificación ya existe");
    }

    await D_Clasificacion_Incidencia.crear(clasificacion_incidencia);
  }

  static async actualizar(clasificacion: ClasificacionIncidencia) {
    await D_Clasificacion_Incidencia.actualizar(clasificacion);
  }

  static async listar() {
    return await D_Clasificacion_Incidencia.listar();
  }

  static async eliminar(id: number) {
    await D_Clasificacion_Incidencia.eliminar(id);
  }

  static async obtenerClasificacion(nombre: string) {
    return await D_Clasificacion_Incidencia.obtenerClasificacion(nombre);
  }
  static async obtenerClasificacionPorId(id: number) {
    return await D_Clasificacion_Incidencia.obtenerClasificacionPorId(id);
  }
}
