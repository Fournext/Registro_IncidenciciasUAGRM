import type { ObjetivoAlmacenamiento } from "./ObjetivoAlmacenamiento";
import { AdaptableAmazonS3 } from "./AdaptableAmazonS3";

export class AdaptadorAmazonS3 implements ObjetivoAlmacenamiento {
  private adaptable: AdaptableAmazonS3;

  constructor() {
    this.adaptable = new AdaptableAmazonS3();
  }

  public async PeticionSubir(archivo: File): Promise<string | null> {
    return await this.adaptable.SubirAS3(archivo);
  }

  public async PeticionObtenerURL(idPublico: string): Promise<string | null> {
    return await this.adaptable.ObtenerUrlS3(idPublico);
  }

}
