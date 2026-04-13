import { query, getClient } from "../../Conexion/conexion";
import type { Facultad } from "./Facultad";

export class D_Facultad {
  static async registrar(facultad: Facultad) {
    await query(
      "INSERT INTO facultad (nombre, sigla) VALUES ($1, $2) RETURNING *",
      [facultad.nombre, facultad.sigla],
    );
  }

  static async actualizar(facultad: Facultad) {
    await query(
      "UPDATE facultad SET nombre = $1, sigla = $2, id_decano = $3 WHERE id = $4 RETURNING *",
      [facultad.nombre, facultad.sigla, facultad.id_decano, facultad.id],
    );
  }

  static async asignarDecano(id: number, id_decano: number) {
    const client = await getClient();

    try {
      await client.query("BEGIN");

      await client.query(
        "UPDATE facultad SET id_decano = NULL WHERE id_decano = $1 AND id <> $2",
        [id_decano, id],
      );

      await client.query(
        "UPDATE facultad SET id_decano = $1 WHERE id = $2 RETURNING *",
        [id_decano, id],
      );

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  static async listar() {
    const result = await query("SELECT * FROM facultad WHERE estado = true");
    return result.rows;
  }

  static async obtenerFacultadDecano(id_decano: number) {
    const result = await query(
      `SELECT f.* FROM facultad f JOIN decano d ON f.id_decano = d.id WHERE d.id = $1 AND f.estado = true`,
      [id_decano],
    );
    return result.rows[0];
  }
  static async buscarPorSigla(sigla: string) {
    const result = await query(
      "SELECT * FROM facultad WHERE sigla = $1 AND estado = true",
      [sigla],
    );
    return result.rows[0];
  }

  static async obtenerFacultadPorId(id: number) {
    const result = await query(
      "SELECT * FROM facultad WHERE id = $1 AND estado = true",
      [id],
    );
    return result.rows[0];
  }

  static async eliminar(id: number) {
    await query("UPDATE facultad SET estado = false WHERE id = $1", [id]);
  }
}
