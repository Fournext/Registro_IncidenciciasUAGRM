import type { Incidencia } from "../Datos/D_Incidencia/Incidencia";
import { ManejadorIncidencia } from "./ManejadorIncidencia";

export class ManejadorValidacion extends ManejadorIncidencia {
  public establecerSucesor(sucesor: ManejadorIncidencia): ManejadorIncidencia {
    this.sucesor = sucesor;
    return sucesor;
  }

  public async ManejarPeticion(incidencia: Incidencia): Promise<void> {
    if (
      !incidencia.titulo.trim() ||
      !incidencia.descripcion.trim() ||
      !incidencia.ubicacion.trim() ||
      isNaN(incidencia.id_facultad!) ||
      isNaN(incidencia.id_clasificacion!)
    ) {
      throw new Error("Validación Fallida: Todos los campos de texto son obligatorios.");
    }

    if (this.sucesor) {
      await this.sucesor.ManejarPeticion(incidencia);
    }
  }
}
