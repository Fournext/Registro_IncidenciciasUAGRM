import type { Incidencia } from "../Datos/D_Incidencia/Incidencia";
import { AdaptadorFirebase } from "./AdaptadorFirebase";
import { ManejadorIncidencia } from "./ManejadorIncidencia";
import type { ObjetivoAlmacenamiento } from "./ObjetivoAlmacenamiento";

export class ManejadorSubidaImagen extends ManejadorIncidencia {
  private uploader: ObjetivoAlmacenamiento;

  constructor() {
    super();
    this.uploader = new AdaptadorFirebase(); // Inyectar la implementacion de adaptabilidad
  }

  public establecerSucesor(sucesor: ManejadorIncidencia): ManejadorIncidencia {
    this.sucesor = sucesor;
    return sucesor;
  }

  public async ManejarPeticion(incidencia: Incidencia): Promise<void> {
    if (incidencia.archivoImagen) {
      const url = await this.uploader.PeticionSubir(incidencia.archivoImagen);
      if (url) {
        incidencia.imagen_evidencia = url;
      }
    }

    if (this.sucesor) {
      await this.sucesor.ManejarPeticion(incidencia);
    }
  }
}
