import { query } from "../../Conexion/conexion";
import type { Decano } from "./Decano";

export class D_Decano {
  static async registrar(decano: Decano) {
    await query(
      "INSERT INTO decano (nombre, apellido, telefono, email, contrasena, credencial_institucional) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        decano.nombre,
        decano.apellido,
        decano.telefono,
        decano.email,
        decano.contrasena,
        decano.credencial_institucional,
      ],
    );
  }

  static async editar(decano: Decano) {
    let queryText = `
    UPDATE decano 
    SET nombre = $1, apellido = $2, telefono = $3, email = $4, credencial_institucional = $5
  `;

    const params: unknown[] = [
      decano.nombre,
      decano.apellido,
      decano.telefono,
      decano.email,
      decano.credencial_institucional,
    ];

    let index = params.length + 1;

    if (decano.contrasena) {
      queryText += `, contrasena = $${index}`;
      params.push(decano.contrasena);
      index++;
    }

    queryText += ` WHERE id = $${index} RETURNING *`;
    params.push(decano.id);

    const result = await query(queryText, params);
    return result.rows[0];
  }

  static async buscarPorEmail(email: string) {
    const result = await query("SELECT * FROM decano WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  }

  static obtenerSesion(): string | null {
    return localStorage.getItem("decano");
  }

  static guardarSesion(data: string): void {
    localStorage.setItem("decano", data);
  }
}
