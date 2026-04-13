import type { CierreIncidencia } from "../Datos/D_Cierre_Incidencia/CierreIncidencia";
import { D_Cierre_Incidencia } from "../Datos/D_Cierre_Incidencia/D_Cierre_Incidencia";
import { getClient } from "../Conexion/conexion";
import { N_Detalle_Cierre_Incidencia } from "./N_Detalle_Cierre_Incidencia";
import { N_Incidencia } from "./N_Incidencia";

export class N_Cierre_Incidencia {
  static async registrarCierre(cierre: CierreIncidencia) {
    if (
      !cierre.observacion.trim() &&
      (!cierre.detalle_cierre_incidencias ||
        cierre.detalle_cierre_incidencias.length === 0)
    ) {
      throw new Error(
        "Debes ingresar al menos una observación general o evidencia fotográfica.",
      );
    }

    const client = await getClient();
    try {
      await client.query("BEGIN");

      const cierre_incidencia = await D_Cierre_Incidencia.registrarCierre(
        cierre,
        client,
      );

      for (const detalle of cierre.detalle_cierre_incidencias) {
        detalle.id_cierre_incidencia = cierre_incidencia.id;
        await N_Detalle_Cierre_Incidencia.registrarDetalleCierre(
          detalle,
          client,
        );
      }

      await N_Incidencia.actualizarEstado(cierre.id_incidencia, "Resuelto");

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      await N_Incidencia.actualizarEstado(cierre.id_incidencia, "En Proceso");
      throw new Error(
        "Error al registrar el cierre de incidencia: " +
          (error instanceof Error ? error.message : String(error)),
      );
    } finally {
      client.release();
    }
  }

  static async eliminarCierre(id_cierre: number, id_incidencia: number) {
    await D_Cierre_Incidencia.eliminarCierre(id_cierre);
    await N_Incidencia.actualizarEstado(id_incidencia, "En Proceso");
  }

  static async listarCierrePorIncidencia(id_incidencia: number) {
    const cierre =
      await D_Cierre_Incidencia.listarCierrePorIncidencia(id_incidencia);

    for (const c of cierre) {
      c.detalle_cierre_incidencias =
        await N_Detalle_Cierre_Incidencia.listarDetalleCierrePorCierre(c.id);
    }

    return cierre;
  }
}
