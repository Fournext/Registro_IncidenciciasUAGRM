import bcrypt from "bcryptjs";
import { N_Reportante } from "./N_Reportante";
import { N_Decano } from "./N_Decano";
import { N_Encargado_Mantenimiento } from "./N_Encargado_Mantenimiento";
import { N_CerrarSesion } from "./N_CerrarSesion";
export class N_InicioSesión {
  static async loginReportante(email: string, contrasena: string) {
    const reportante = await N_Reportante.buscarPorEmail(email);

    if (!reportante) {
      throw new Error("Error: Usuario no encontrado");
    }

    const contraseña_valida = await bcrypt.compare(
      contrasena,
      reportante.contrasena,
    );

    if (!contraseña_valida) {
      throw new Error("Error: Contraseña incorrecta o correo no registrado");
    }

    const { contrasena: _, ...usuarioSeguro } = reportante;
    N_Reportante.guardarSesion(usuarioSeguro);
    return usuarioSeguro;
  }
  static async loginDecano(
    email: string,
    contrasena: string,
    credencial_institucional: string,
  ) {
    const decano = await N_Decano.buscarPorEmail(email);

    if (!decano) {
      throw new Error("Error: Decano no encontrado");
    }

    const contraseña_valida = await bcrypt.compare(
      contrasena,
      decano.contrasena,
    );

    if (!contraseña_valida) {
      throw new Error("Error: Contraseña incorrecta o correo no registrado");
    }

    if (decano.credencial_institucional !== credencial_institucional) {
      throw new Error("Error: Credencial institucional incorrecta");
    }

    const { contrasena: _, ...decanoSeguro } = decano;
    N_Decano.guardarSesion(decanoSeguro);
    return decanoSeguro;
  }
  static async loginMantenimiento(telefono: string, contrasena: string) {
    const mantenimiento =
      await N_Encargado_Mantenimiento.buscarPorTelefono(telefono);

    if (!mantenimiento) {
      throw new Error("Error: Encargado no encontrado");
    }

    const contraseña_valida = await bcrypt.compare(
      contrasena,
      mantenimiento.contrasena,
    );

    if (!contraseña_valida) {
      throw new Error("Error: Contraseña incorrecta o correo no registrado");
    }

    const { contrasena: _, ...mantenimientoSeguro } = mantenimiento;
    N_Encargado_Mantenimiento.guardarSesion(mantenimientoSeguro);
    return mantenimientoSeguro;
  }
}
