import { ManejadorIncidencia } from "./ManejadorIncidencia";
import { D_Incidencia } from "../Datos/D_Incidencia/D_Incidencia";
import type { Incidencia } from "../Datos/D_Incidencia/Incidencia";

export class ManejadorPersistencia extends ManejadorIncidencia {
  public establecerSucesor(sucesor: ManejadorIncidencia): ManejadorIncidencia {
    this.sucesor = sucesor;
    return sucesor;
  }

  public async ManejarPeticion(incidencia: Incidencia): Promise<void> {
    const nuevaIncidencia = {
      id: 0,
      titulo: incidencia.titulo,
      descripcion: incidencia.descripcion,
      ubicacion: incidencia.ubicacion,
      fecha: incidencia.fecha,
      estado: incidencia.estado,
      id_facultad: incidencia.id_facultad,
      id_clasificacion: incidencia.id_clasificacion,
      id_reportante: incidencia.id_reportante,
      imagen_evidencia: incidencia.imagen_evidencia,
    };

    await D_Incidencia.registrar(nuevaIncidencia);
  }
}
