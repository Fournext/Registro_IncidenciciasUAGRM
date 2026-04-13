import { query } from "../../Conexion/conexion";
import type { CierreIncidencia } from "./CierreIncidencia";

export class D_Cierre_Incidencia {
  static async registrarCierre(cierre: CierreIncidencia, externalClient?: any) {
    const runQuery = externalClient
      ? externalClient.query.bind(externalClient)
      : query;
    const data = await runQuery(
      "INSERT INTO cierre_incidencia (observacion, fecha, id_incidencia, id_encargado) VALUES ($1, $2, $3, $4) RETURNING *",
      [
        cierre.observacion,
        cierre.fecha,
        cierre.id_incidencia,
        cierre.id_encargado,
      ],
    );
    return data.rows[0];
  }
  static async eliminarCierre(id_cierre: number) {
    await query("DELETE FROM cierre_incidencia WHERE id = $1", [id_cierre]);
  }
  static async listarCierrePorIncidencia(id_incidencia: number) {
    const data = await query(
      "SELECT * FROM cierre_incidencia WHERE id_incidencia = $1",
      [id_incidencia],
    );
    return data.rows;
  }
}
