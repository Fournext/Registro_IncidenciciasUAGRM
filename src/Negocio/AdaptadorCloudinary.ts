import type { ObjetivoAlmacenamiento } from "./ObjetivoAlmacenamiento";
import { AdaptableCloudinary } from "./AdaptableCloudinary";

export class AdaptadorCloudinary implements ObjetivoAlmacenamiento {
  private adaptable: AdaptableCloudinary;

  constructor() {
    this.adaptable = new AdaptableCloudinary();
  }

  public async PeticionSubir(archivo: File): Promise<string | null> {
    return await this.adaptable.SubirACloudinary(archivo);
  }

  public async PeticionObtenerURL(idPublico: string): Promise<string | null> {
    return await this.adaptable.ObtenerURLCloudinary(idPublico);
  }

}
