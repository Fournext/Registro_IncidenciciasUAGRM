import { query } from "../../Conexion/conexion";
import type { Encargado_Mantenimiento } from "./Encargado_Mantenimiento";

export class D_Encargado_Mantenimiento {
  static async registrar(encargado: Encargado_Mantenimiento) {
    const result = await query(
      "INSERT INTO encargado_mantenimiento (nombre, apellido, telefono, especialidad, contrasena) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [
        encargado.nombre,
        encargado.apellido,
        encargado.telefono,
        encargado.especialidad,
        encargado.contrasena,
      ],
    );
    return result.rows[0];
  }

  static async actualizar(encargado: Encargado_Mantenimiento) {
    let queryText = `
    UPDATE encargado_mantenimiento 
    SET nombre = $1, apellido = $2, telefono = $3, especialidad = $4
  `;

    const params: unknown[] = [
      encargado.nombre,
      encargado.apellido,
      encargado.telefono,
      encargado.especialidad,
    ];

    let index = params.length + 1;

    if (encargado.contrasena) {
      queryText += `, contrasena = $${index}`;
      params.push(encargado.contrasena);
      index++;
    }

    queryText += ` WHERE id = $${index} RETURNING *`;
    params.push(encargado.id);

    const result = await query(queryText, params);
    return result.rows[0];
  }

  static async eliminar(id: number) {
    await query("DELETE FROM encargado_mantenimiento WHERE id = $1", [id]);
  }

  static async buscarPorTelefono(telefono: string) {
    const result = await query(
      "SELECT * FROM encargado_mantenimiento WHERE telefono = $1",
      [telefono],
    );
    return result.rows[0];
  }

  static async listar() {
    const result = await query(
      "SELECT id, nombre, apellido, telefono, especialidad FROM encargado_mantenimiento",
    );
    return result.rows;
  }

  static async obtenerEncargadoPorId(id_encargado: number) {
    const result = await query(
      "SELECT * FROM encargado_mantenimiento WHERE id = $1",
      [id_encargado],
    );
    return result.rows[0];
  }

  static obtenerSesion(): string | null {
    return localStorage.getItem("encargado");
  }

  static guardarSesion(data: string): void {
    localStorage.setItem("encargado", data);
  }
}
