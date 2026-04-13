import { D_CerrarSesion } from "../Datos/D_CerrarSesion/D_CerrarSesion";

export class N_CerrarSesion {
  static cerrarSesion(rol: string) {
    D_CerrarSesion.cerrarSesion(rol);
  }
}
