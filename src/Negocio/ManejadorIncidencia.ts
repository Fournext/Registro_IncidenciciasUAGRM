import type { Incidencia } from "../Datos/D_Incidencia/Incidencia";


export abstract class ManejadorIncidencia {
  protected sucesor: ManejadorIncidencia | null = null;

  public abstract establecerSucesor(sucesor: ManejadorIncidencia): ManejadorIncidencia;
  public abstract ManejarPeticion(incidencia: Incidencia): Promise<void>;
}
