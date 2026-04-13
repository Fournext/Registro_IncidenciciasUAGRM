import React, { useState } from "react";
import { User, Phone, Mail, Lock, Save } from "lucide-react";
import { N_Reportante } from "../Negocio/N_Reportante";

type Props = {
  onClose: () => void;
};

export default function P_FormReportante({ onClose }: Props) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");

  {
    /* -------------------------------------------------------------------
          CU1 Registrar Reportante
      ---------------------------------------------------------------------*/
  }

  const registrar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await N_Reportante.registrar({
        id: 0,
        nombre,
        apellido,
        telefono,
        email,
        contrasena,
      });

      onClose();
      alert("Reportante registrado con éxito");
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    }
  };

  return (
    <form onSubmit={registrar} className="flex flex-col gap-5 animate-fade-in">
      <div>
        <label className="mb-2 block text-xs font-bold text-white/90">
          Nombre
        </label>
        <div className="relative">
          <User className="absolute left-4 top-3.5 h-5 w-5 text-white/40" />
          <input
            type="text"
            placeholder="Ej. Ana"
            className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#a08a68] focus:bg-white/10 transition-colors"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-bold text-white/90">
          Apellido
        </label>
        <div className="relative">
          <User className="absolute left-4 top-3.5 h-5 w-5 text-white/40" />
          <input
            type="text"
            placeholder="Ej. Martínez"
            className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#a08a68] focus:bg-white/10 transition-colors"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            required
          />
        </div>
      </div>

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

      <div>
        <label className="mb-2 block text-xs font-bold text-white/90">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-3.5 h-5 w-5 text-white/40" />
          <input
            type="email"
            placeholder="correo@universidad.edu"
            className="w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#a08a68] focus:bg-white/10 transition-colors"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>

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
