import type { DetalleCierreIncidencia } from "../D_Detalle_Cierre_Incidencia/DetalleCierreIncidencia";

export interface CierreIncidencia {
  id: number;
  observacion: string;
  fecha: Date;
  id_incidencia: number;
  id_encargado: number;
  detalle_cierre_incidencias: DetalleCierreIncidencia[];
}
