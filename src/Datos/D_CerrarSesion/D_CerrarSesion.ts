export class D_CerrarSesion {
  static cerrarSesion(rol: string) {
    localStorage.removeItem(rol);
  }
}
