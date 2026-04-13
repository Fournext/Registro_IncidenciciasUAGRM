import { query } from "../../Conexion/conexion";

export interface ClasificacionIncidencia {
  id: number;
  nombre: string;
  descripcion: string;
}

export class D_Clasificacion_Incidencia {
  static async crear(clasificacion_incidencia: ClasificacionIncidencia) {
    await query(
      "INSERT INTO clasificacion_incidencia (nombre, descripcion) VALUES ($1, $2) RETURNING *",
      [clasificacion_incidencia.nombre, clasificacion_incidencia.descripcion],
    );
  }

  static async actualizar(clasificacion_incidencia: ClasificacionIncidencia) {
    await query(
      "UPDATE clasificacion_incidencia SET nombre = $1, descripcion = $2 WHERE id = $3 AND estado = true RETURNING *",
      [
        clasificacion_incidencia.nombre,
        clasificacion_incidencia.descripcion,
        clasificacion_incidencia.id,
      ],
    );
  }

  static async listar() {
    const result = await query(
      "SELECT * FROM clasificacion_incidencia WHERE estado = true ORDER BY id ASC",
    );
    return result.rows;
  }

  static async eliminar(id: number) {
    await query(
      "UPDATE clasificacion_incidencia SET estado = false WHERE id = $1",
      [id],
    );
  }

  static async obtenerClasificacion(nombre: string) {
    const result = await query(
      "SELECT * FROM clasificacion_incidencia WHERE nombre = $1 AND estado = true",
      [nombre],
    );
    return result.rows[0];
  }

  static async obtenerClasificacionPorId(id: number) {
    const result = await query(
      "SELECT * FROM clasificacion_incidencia WHERE id = $1 AND estado = true",
      [id],
    );
    return result.rows[0];
  }
}
