import React, { useState } from "react";
import { User, Phone, Mail, Lock, Contact, Save } from "lucide-react";
import { N_Decano } from "../Negocio/N_Decano";

type Props = {
  onClose: () => void;
};

export default function P_FormDecano({ onClose }: Props) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [credencial_institucional, setCredencial] = useState("");

  {
    /* -------------------------------------------------------------------
          CU4 registrar Decano
      ---------------------------------------------------------------------*/
  }

  // Función para registrar un nuevo decano
  const registrar = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Registrando Decano...");
    try {
      await N_Decano.registrar({
        id: 0,
        nombre,
        apellido,
        telefono: telefono,
        email,
        contrasena,
        credencial_institucional,
      });

      onClose();
      alert("Decano registrado con éxito");
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    }
  };

  return (
    <form
      onSubmit={registrar}
      // Cambiamos a flex-col para que sea una sola columna
      className="flex flex-col gap-5 animate-fade-in"
    >
      {/* Nombre */}
      <div>
        <label className="mb-2 block text-xs font-bold text-white/90">
          Nombre
        </label>
        <div className="relative">
          <User className="absolute left-4 top-3.5 h-5 w-5 text-white/40" />
          <input
            type="text"
            placeholder="Ej. Roberto"
            className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#a08a68] focus:bg-white/10 transition-colors"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Apellido */}
      <div>
        <label className="mb-2 block text-xs font-bold text-white/90">
          Apellido
        </label>
        <div className="relative">
          <User className="absolute left-4 top-3.5 h-5 w-5 text-white/40" />
          <input
            type="text"
            placeholder="Ej. Gómez"
            className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#a08a68] focus:bg-white/10 transition-colors"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Teléfono */}
      <div>
        <label className="mb-2 block text-xs font-bold text-white/90">
          Teléfono
        </label>
        <div className="relative">
          <Phone className="absolute left-4 top-3.5 h-5 w-5 text-white/40" />
          <input
            type="tel"
            placeholder="Ej. 7777777"
            className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#a08a68] focus:bg-white/10 transition-colors"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="mb-2 block text-xs font-bold text-white/90">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-3.5 h-5 w-5 text-white/40" />
          <input
            type="email"
            placeholder="decano@universidad.edu"
            className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#a08a68] focus:bg-white/10 transition-colors"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Contraseña */}
      <div>
        <label className="mb-2 block text-xs font-bold text-white/90">
          Contraseña
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-3.5 h-5 w-5 text-white/40" />
          <input
            type="password"
            placeholder="Tu contraseña segura"
            className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#a08a68] focus:bg-white/10 transition-colors"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Credencial Institucional (AÑADIDO PARA COINCIDIR CON LA IMAGEN) */}
      <div>
        <label className="mb-2 block text-xs font-bold text-white/90">
          Credencial Institucional
        </label>
        <div className="relative">
          <Contact className="absolute left-4 top-3.5 h-5 w-5 text-white/40" />
          <input
            type="text"
            placeholder="123-DEC-456"
            className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#a08a68] focus:bg-white/10 transition-colors"
            value={credencial_institucional}
            onChange={(e) => setCredencial(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Botón Guardar */}
      <div className="pt-2">
        <button
          type="submit"
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#a08a68] px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#8e7a5c] active:scale-[0.98]"
        >
          Registrarse
          <Save className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
