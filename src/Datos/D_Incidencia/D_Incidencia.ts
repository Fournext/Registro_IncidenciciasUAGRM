import { query } from "../../Conexion/conexion";
import type { Incidencia } from "./Incidencia";

export class D_Incidencia {
  static async registrar(incidencia: Incidencia) {
    await query(
      `INSERT INTO incidencia (titulo, descripcion, ubicacion, fecha, estado, id_facultad, id_reportante, id_clasificacion, imagen_evidencia) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        incidencia.titulo,
        incidencia.descripcion,
        incidencia.ubicacion,
        incidencia.fecha,
        incidencia.estado,
        incidencia.id_facultad,
        incidencia.id_reportante,
        incidencia.id_clasificacion,
        incidencia.imagen_evidencia,
      ],
    );
  }
  static async listarPorReportante(id_reportante: number) {
    const result = await query(
      "SELECT * FROM incidencia WHERE id_reportante = $1",
      [id_reportante],
    );
    return result.rows;
  }
  static async listarPorEncargado(id_encargado: number) {
    const result = await query(
      "SELECT * FROM incidencia WHERE id_encargado = $1",
      [id_encargado],
    );
    return result.rows;
  }
  static async listarPorFacultadDecano(id_facultad: number) {
    const result = await query(
      "SELECT * FROM incidencia WHERE id_facultad = $1",
      [id_facultad],
    );
    return result.rows;
  }

  static async asignarEncargado(id_incidencia: number, id_encargado: number) {
    query("UPDATE incidencia SET id_encargado = $1 WHERE id = $2 RETURNING *", [
      id_encargado,
      id_incidencia,
    ]);
  }

  static async actualizarEstado(id_incidencia: number, estado: string) {
    await query("UPDATE incidencia SET estado = $1 WHERE id = $2 RETURNING *", [
      estado,
      id_incidencia,
    ]);
  }
}
