import type { ObjetivoAlmacenamiento } from "./ObjetivoAlmacenamiento";
import { AdaptableFirebase } from "./AdaptableFirebase";

export class AdaptadorFirebase implements ObjetivoAlmacenamiento {
  private adaptable: AdaptableFirebase;

  constructor() {
    this.adaptable = new AdaptableFirebase();
  }

  public async PeticionSubir(archivo: File): Promise<string | null> {
    return await this.adaptable.SubirAFirebase(archivo);
  }

  public async PeticionObtenerURL(idPublico: string): Promise<string | null> {
    return await this.adaptable.ObtenerRutaFirebase(idPublico);
  }

}
