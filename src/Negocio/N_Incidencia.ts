import { D_Incidencia } from "../Datos/D_Incidencia/D_Incidencia";
import { N_Clasificacion_Incidencia } from "./N_Clasificacion_Incidencia";
import { N_Facultad } from "./N_Facultad";
import { N_Encargado_Mantenimiento } from "./N_Encargado_Mantenimiento";
import { ManejadorValidacion } from "./ManejadorValidacion";
import { ManejadorAntiSpam } from "./ManejadorAntiSpam";
import { ManejadorSubidaImagen } from "./ManejadorSubidaImagen";
import { ManejadorPersistencia } from "./ManejadorPersistencia";
import type { Incidencia } from "../Datos/D_Incidencia/Incidencia";

export class N_Incidencia {
  static async registrar(incidencia: Incidencia) {
    const validador = new ManejadorValidacion();
    const antispam = new ManejadorAntiSpam();
    const subidor = new ManejadorSubidaImagen();
    const persistidor = new ManejadorPersistencia();

    validador
      .establecerSucesor(antispam)
      .establecerSucesor(subidor)
      .establecerSucesor(persistidor);

    await validador.ManejarPeticion(incidencia);
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

  // El método convertirIMG_URL ha sido removido y desacoplado de la clase de negocio.
  // Su lógica ahora reside de forma limpia en la clase AdaptableCloudinary del patrón Adapter.

  static async asignarEncargado(id_incidencia: number, id_encargado: number) {
    if (!id_incidencia) {
      throw new Error("No se ha seleccionado una incidencia válida.");
    }
    if (!id_encargado) {
      throw new Error("Por favor selecciona un encargado de la lista.");
    }

    await N_Incidencia.actualizarEstado(id_incidencia, "En Proceso");
    return await D_Incidencia.asignarEncargado(id_incidencia, id_encargado);
  }

  static seleccionarIncidencia(incidencia: any) {
    D_Incidencia.guardarIncidenciaSeleccionada(incidencia);
  }

  static obtenerIncidenciaSeleccionada() {
    return D_Incidencia.obtenerIncidenciaSeleccionada();
  }

  static async actualizarEstado(id_incidencia: number, estado: string) {
    await D_Incidencia.actualizarEstado(id_incidencia, estado);
  }
}
