import { D_Reportante } from "../Datos/D_Reportante/D_Reportante";
import type { Reportante } from "../Datos/D_Reportante/Reportante";
import bcrypt from "bcryptjs";

export class N_Reportante {
  static async registrar(reportante: Reportante) {
    if (
      !reportante.email.trim() ||
      !reportante.contrasena!.trim() ||
      !reportante.nombre.trim() ||
      !reportante.apellido.trim() ||
      !reportante.telefono
    ) {
      throw new Error("Todos los campos son obligatorios");
    }

    const existente = await D_Reportante.buscarPorEmail(reportante.email);

    if (existente) {
      throw new Error("El correo ya está registrado");
    }

    const hashedPassword = await bcrypt.hash(reportante.contrasena!, 10);
    reportante.contrasena = hashedPassword;
    await D_Reportante.registrar(reportante);
  }
  static async editar(reportante: Reportante) {
    if (reportante.contrasena && reportante.contrasena.trim()) {
      const hashedPassword = await bcrypt.hash(reportante.contrasena, 10);
      reportante.contrasena = hashedPassword;
    } else {
      delete reportante.contrasena;
    }

    reportante = await D_Reportante.editar(reportante);
    const { contrasena: _, ...reportanteSeguro } = reportante;
    return reportanteSeguro;
  }
  static async buscarPorEmail(email: string) {
    return await D_Reportante.buscarPorEmail(email);
  }
}
