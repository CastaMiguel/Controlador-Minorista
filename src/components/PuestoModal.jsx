import { useState } from "react";
import { X } from "lucide-react";

export default function PuestoModal({ puesto, onClose, onSave }) {
  const [form, setForm] = useState({
    id: puesto.id || Date.now(),
    numero: puesto.numero || "",
    sector: puesto.sector || "Frutas y verduras",
    arrendatario:
      puesto.arrendatario === "Disponible" ? "" : puesto.arrendatario || "",
    contacto: puesto.contacto || "",
  });
  const update = (event) =>
    setForm({ ...form, [event.target.name]: event.target.value });
  const submit = (event) => {
    event.preventDefault();
    const hasTenant = form.arrendatario.trim().length > 0;
    onSave({
      ...form,
      estado: hasTenant ? "Ocupado" : "Libre",
      arrendatario: hasTenant ? form.arrendatario.trim() : "Disponible",
      contacto: hasTenant ? form.contacto : "",
    });
  };

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-[#102b26]/50 p-4">
      <div className="modal-enter w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.15em] text-[#8b6f4b]">
              Gestión de inventario
            </p>
            <h2 className="mt-1 font-display text-2xl font-semibold">
              {puesto.id ? "Editar puesto" : "Registrar puesto"}
            </h2>
          </div>
          <button
            className="rounded-lg p-2 text-[#789086] hover:bg-[#eef3ee]"
            onClick={onClose}
            aria-label="Cerrar formulario"
          >
            <X size={19} />
          </button>
        </div>
        <form className="mt-7 space-y-4" onSubmit={submit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="field-label">
              Número de puesto
              <input
                className="field-input"
                name="numero"
                value={form.numero}
                onChange={update}
                placeholder="Ej. F-023"
                required
              />
            </label>
            <label className="field-label">
              Sector
              <select
                className="field-input"
                name="sector"
                value={form.sector}
                onChange={update}
              >
                <option>Zapatos</option>
                <option>Electronicos</option>
                <option>Frutas y verduras</option>
                <option>Restaurante</option>
                <option>Tienda</option>
                <option>Ropa</option>
                <option>Varios</option>
              </select>
            </label>
          </div>
          <label className="field-label">
            Nombre del arrendatario
            <input
              className="field-input"
              name="arrendatario"
              value={form.arrendatario}
              onChange={update}
              placeholder="Escribe el nombre para asignar el puesto"
            />
          </label>
          <label className="field-label">
            Teléfono de contacto
            <input
              className="field-input"
              name="contacto"
              value={form.contacto}
              onChange={update}
              placeholder="Ej. 300 123 4567"
            />
          </label>
          <p className="rounded-lg bg-[#f0f6ed] px-3 py-2 text-xs text-[#557068]">
            Si registras un arrendatario, el puesto se marcará automáticamente
            como ocupado. Déjalo vacío para conservarlo libre.
          </p>
          <div className="flex justify-end gap-3 border-t border-[#edf1ed] pt-5">
            <button
              type="button"
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#557068] hover:bg-[#f0f4f0]"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              className="button-primary rounded-xl px-5 py-2.5 text-sm font-bold"
              type="submit"
            >
              Guardar puesto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}