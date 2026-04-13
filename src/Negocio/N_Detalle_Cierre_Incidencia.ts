import { D_Detalle_Cierre_Incidencia } from "../Datos/D_Detalle_Cierre_Incidencia/D_Detalle_Cierre_Incidencia";
import type { DetalleCierreIncidencia } from "../Datos/D_Detalle_Cierre_Incidencia/DetalleCierreIncidencia";

export class N_Detalle_Cierre_Incidencia {
  static async registrarDetalleCierre(
    detalle_cierre: DetalleCierreIncidencia,
    client?: any,
  ) {
    await D_Detalle_Cierre_Incidencia.registrarDetalleCierre(
      detalle_cierre,
      client,
    );
  }
  static async listarDetalleCierrePorCierre(id_cierre_incidencia: number) {
    return await D_Detalle_Cierre_Incidencia.listarDetalleCierrePorCierre(
      id_cierre_incidencia,
    );
  }
}
