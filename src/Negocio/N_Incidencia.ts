import { D_Incidencia } from "../Datos/D_Incidencia/D_Incidencia";
import type { Incidencia } from "../Datos/D_Incidencia/Incidencia";
import { N_Clasificacion_Incidencia } from "./N_Clasificacion_Incidencia";
import { N_Facultad } from "./N_Facultad";
import { N_Encargado_Mantenimiento } from "./N_Encargado_Mantenimiento";

export class N_Incidencia {
  static async registrar(incidencia: Incidencia) {
    if (
      !incidencia.titulo.trim() ||
      !incidencia.descripcion.trim() ||
      !incidencia.ubicacion.trim() ||
      !incidencia.fecha ||
      !incidencia.id_clasificacion!.toString().trim() ||
      !incidencia.id_reportante!.toString().trim() ||
      !incidencia.id_facultad!.toString().trim()
    ) {
      throw new Error("Todos los campos son obligatorios");
    }
    console.log("Validación de campos exitosa:", incidencia);
    await D_Incidencia.registrar(incidencia);
  }

  static async listarPorReportante(id_reportante: number) {
    const incidencias = await D_Incidencia.listarPorReportante(id_reportante);
    const incidenciasCompletas = await Promise.all(
      incidencias.map(async (item: any) => {
        const [clasificacionData, facultadData] = await Promise.all([
          N_Clasificacion_Incidencia.obtenerClasificacionPorId(
            item.id_clasificacion,
          ),
          N_Facultad.obtenerFacultadPorId(item.id_facultad),
        ]);

        return {
          ...item,
          clasificacion: clasificacionData
            ? clasificacionData.nombre
            : "Sin clasificación",
          facultad: facultadData ? facultadData.sigla : "Sin Facultad",
        };
      }),
    );
    return incidenciasCompletas;
  }

  static async listarPorFacultadDecano(id_decano: number) {
    const result = await N_Facultad.obtenerFacultadDecano(id_decano);
    if (!result) {
      throw new Error("Facultad no encontrada");
    }
    const incidencias = await D_Incidencia.listarPorFacultadDecano(result.id);
    const incidenciasCompletas = await Promise.all(
      incidencias.map(async (item: any) => {
        const [
          clasificacionData,
          facultadData,
          Encargado_MantenimientoncargadoData,
        ] = await Promise.all([
          N_Clasificacion_Incidencia.obtenerClasificacionPorId(
            item.id_clasificacion,
          ),
          N_Facultad.obtenerFacultadPorId(item.id_facultad),
          N_Encargado_Mantenimiento.obtenerEncargadoPorId(item.id_encargado),
        ]);

        return {
          ...item,
          clasificacion: clasificacionData
            ? clasificacionData.nombre
            : "Sin clasificación",
          facultad: facultadData ? facultadData.sigla : "Sin Facultad",
          encargado: Encargado_MantenimientoncargadoData
            ? `${Encargado_MantenimientoncargadoData.nombre} ${Encargado_MantenimientoncargadoData.apellido}`
            : "Sin Encargado",
        };
      }),
    );
    return incidenciasCompletas;
  }

  static async listarPorEncargado(id_encargado: number) {
    const incidencias = await D_Incidencia.listarPorEncargado(id_encargado);
    const incidenciasCompletas = await Promise.all(
      incidencias.map(async (item: any) => {
        const [clasificacionData, facultadData] = await Promise.all([
          N_Clasificacion_Incidencia.obtenerClasificacionPorId(
            item.id_clasificacion,
          ),
          N_Facultad.obtenerFacultadPorId(item.id_facultad),
        ]);

        return {
          ...item,
          clasificacion: clasificacionData
            ? clasificacionData.nombre
            : "Sin clasificación",
          facultad: facultadData ? facultadData.sigla : "Sin Facultad",
        };
      }),
    );
    return incidenciasCompletas;
  }

  static convertirIMG_URL = async (file: File): Promise<string | null> => {
    const CLOUD_NAME = "dmfl4ahiy";
    const UPLOAD_PRESET = "ml_default";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Error al subir la imagen a Cloudinary");
      }

      const data = await response.json();
      return data.secure_url; // secure_url es la URL con HTTPS
    } catch (error) {
      console.error("Error subiendo imagen:", error);
      return null;
    }
  };

  static async asignarEncargado(id_incidencia: number, id_encargado: number) {
    await N_Incidencia.actualizarEstado(id_incidencia, "En Proceso");
    await D_Incidencia.asignarEncargado(id_incidencia, id_encargado);
  }

  static async actualizarEstado(id_incidencia: number, estado: string) {
    await D_Incidencia.actualizarEstado(id_incidencia, estado);
  }
}
