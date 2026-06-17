import { ManejadorIncidencia } from "./ManejadorIncidencia";
import type { Incidencia } from "../Datos/D_Incidencia/Incidencia";
import { D_Incidencia } from "../Datos/D_Incidencia/D_Incidencia";

export class ManejadorAntiSpam extends ManejadorIncidencia {
  public establecerSucesor(sucesor: ManejadorIncidencia): ManejadorIncidencia {
    this.sucesor = sucesor;
    return sucesor;
  }

  public async ManejarPeticion(incidencia: Incidencia): Promise<void> {
    const incidenciasExistentes = await D_Incidencia.listarPorReportante(incidencia.id_reportante!);
    
    // Regla anti-spam: Máximo 3 incidencias reportadas en el mismo día por el mismo estudiante
    const hoy = new Date().toDateString();
    const incidenciasDeHoy = incidenciasExistentes.filter((item: any) => 
      new Date(item.fecha).toDateString() === hoy
    );

    if (incidenciasDeHoy.length >= 3) {
      throw new Error("Límite anti-spam superado: No puedes registrar más de 3 incidencias el mismo día.");
    }

    console.log("ManejadorAntiSpam: Aprobado.");

    if (this.sucesor) {
      await this.sucesor.ManejarPeticion(incidencia);
    }
  }
}
