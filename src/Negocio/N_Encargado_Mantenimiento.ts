import { D_Encargado_Mantenimiento } from "../Datos/D_Encargado_Mantenimiento/D_Encardo_Mantenimiento";
import type { Encargado_Mantenimiento } from "../Datos/D_Encargado_Mantenimiento/Encargado_Mantenimiento";
import bcrypt from "bcryptjs";

export class N_Encargado_Mantenimiento {
  static async registrar(encargado: Encargado_Mantenimiento) {
    if (!encargado.telefono) {
      throw new Error("El teléfono es obligatorio");
    }

    const existente = await N_Encargado_Mantenimiento.buscarPorTelefono(
      encargado.telefono,
    );

    if (existente) {
      throw new Error("El teléfono ya está registrado");
    }

    const hashedPassword = await bcrypt.hash(encargado.contrasena!, 10);
    encargado.contrasena = hashedPassword;
    await D_Encargado_Mantenimiento.registrar(encargado);
  }

  static async actualizar(encargado: Encargado_Mantenimiento) {
    if (encargado.contrasena && encargado.contrasena.trim()) {
      const hashedPassword = await bcrypt.hash(encargado.contrasena, 10);
      encargado.contrasena = hashedPassword;
    } else {
      delete encargado.contrasena;
    }
    encargado = await D_Encargado_Mantenimiento.actualizar(encargado);
    const { contrasena: _, ...encargadoSeguro } = encargado;
    return encargadoSeguro;
  }

  static async eliminar(id: number) {
    await D_Encargado_Mantenimiento.eliminar(id);
  }

  static async listar() {
    return await D_Encargado_Mantenimiento.listar();
  }
  static async buscarPorTelefono(telefono: string) {
    return await D_Encargado_Mantenimiento.buscarPorTelefono(telefono);
  }

  static async obtenerEncargadoPorId(id_encargado: number) {
    return await D_Encargado_Mantenimiento.obtenerEncargadoPorId(id_encargado);
  }

  static obtenerSesion(): Encargado_Mantenimiento | null {
    const data = D_Encargado_Mantenimiento.obtenerSesion();
    return data ? JSON.parse(data) : null;
  }

  static guardarSesion(encargado: Encargado_Mantenimiento): void {
    D_Encargado_Mantenimiento.guardarSesion(JSON.stringify(encargado));
  }
}
