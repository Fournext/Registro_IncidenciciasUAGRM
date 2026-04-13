export interface Incidencia {
  id: number;
  titulo: string;
  descripcion: string;
  ubicacion: string;
  fecha: Date;
  imagen_evidencia?: string;
  estado: string;
  imagen_solucion?: string;
  id_facultad?: number;
  id_encargado?: number;
  id_reportante?: number;
  id_clasificacion?: number;
}
