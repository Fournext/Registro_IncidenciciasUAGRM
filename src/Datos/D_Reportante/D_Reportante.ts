import { query } from "../../Conexion/conexion";
import type { Reportante } from "./Reportante";

export class D_Reportante {
  static async registrar(reportante: Reportante) {
    await query(
      "INSERT INTO reportante (nombre, apellido, telefono, email, contrasena) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [
        reportante.nombre,
        reportante.apellido,
        reportante.telefono,
        reportante.email,
        reportante.contrasena,
      ],
    );
  }

  static async editar(reportante: Reportante) {
    let queryText = `
    UPDATE reportante 
    SET nombre = $1, apellido = $2, telefono = $3, email = $4
  `;

    const params: unknown[] = [
      reportante.nombre,
      reportante.apellido,
      reportante.telefono,
      reportante.email,
    ];

    let index = params.length + 1;

    if (reportante.contrasena) {
      queryText += `, contrasena = $${index}`;
      params.push(reportante.contrasena);
      index++;
    }

    queryText += ` WHERE id = $${index} RETURNING *`;
    params.push(reportante.id);

    const result = await query(queryText, params);
    return result.rows[0];
  }
  static async buscarPorEmail(email: string) {
    const result = await query("SELECT * FROM reportante WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  }
}
