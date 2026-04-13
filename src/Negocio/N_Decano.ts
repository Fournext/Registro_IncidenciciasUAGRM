import bcrypt from "bcryptjs";
import { D_Decano } from "../Datos/D_Decano/D_Decano";
import type { Decano } from "../Datos/D_Decano/Decano";

export class N_Decano {
  static async registrar(decano: Decano) {
    if (!decano.email.trim()) {
      throw new Error("El email es obligatorio");
    }

    if (!decano.contrasena!.trim()) {
      throw new Error("La contraseña es obligatoria");
    }

    const existente = await D_Decano.buscarPorEmail(decano.email);

    if (existente) {
      throw new Error("El correo ya está registrado");
    }

    const hashedPassword = await bcrypt.hash(decano.contrasena!, 10);
    decano.contrasena = hashedPassword;
    await D_Decano.registrar(decano);
  }
  static async editar(decano: Decano) {
    if (decano.contrasena && decano.contrasena.trim()) {
      const hashedPassword = await bcrypt.hash(decano.contrasena, 10);
      decano.contrasena = hashedPassword;
    } else {
      delete decano.contrasena;
    }

    decano = await D_Decano.editar(decano);
    const { contrasena: _, ...decanoSeguro } = decano;
    return decanoSeguro;
  }

  static async buscarPorEmail(email: string) {
    return await D_Decano.buscarPorEmail(email);
  }
}
