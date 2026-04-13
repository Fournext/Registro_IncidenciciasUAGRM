import { query } from "../../Conexion/conexion";
import type { DetalleCierreIncidencia } from "./DetalleCierreIncidencia";

export class D_Detalle_Cierre_Incidencia {
  static async registrarDetalleCierre(
    detalle_cierre: DetalleCierreIncidencia,
    externalClient?: any,
  ) {
    const runQuery = externalClient
      ? externalClient.query.bind(externalClient)
      : query;
    await runQuery(
      "INSERT INTO detalle_cierre_incidencia (descripcion, imagen_solucion, id_cierre_incidencia) VALUES ($1, $2, $3) RETURNING *",
      [
        detalle_cierre.descripcion,
        detalle_cierre.imagen_solucion,
        detalle_cierre.id_cierre_incidencia,
      ],
    );
  }
  static async listarDetalleCierrePorCierre(id_cierre_incidencia: number) {
    const data = await query(
      "SELECT * FROM detalle_cierre_incidencia WHERE id_cierre_incidencia = $1",
      [id_cierre_incidencia],
    );
    return data.rows;
  }
}
