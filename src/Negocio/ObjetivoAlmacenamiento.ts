// =========================================================================
// 1. OBJETIVO (Target)
// =========================================================================
export interface ObjetivoAlmacenamiento {
  PeticionSubir(archivo: File): Promise<string | null>;
  PeticionObtenerURL(idPublico: string): Promise<string | null>;
}
