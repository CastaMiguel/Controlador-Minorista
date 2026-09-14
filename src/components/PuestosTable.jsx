import { Pencil } from "lucide-react";

const sectorColors = {
  Zapatos: "bg-[#e7e1f2] text-[#68527f]",
  Electronicos: "bg-[#dce9f4] text-[#3b6280]",
  "Frutas y verduras": "bg-[#dff0d8] text-[#47733b]",
  Restaurante: "bg-[#f9dfd8] text-[#a24e35]",
  Tienda: "bg-[#fff1ce] text-[#926729]",
  Ropa: "bg-[#f1e1ee] text-[#845071]",
  Varios: "bg-[#e6e9e4] text-[#53665b]",
};

export default function PuestosTable({ puestos, onEdit }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-170 text-left text-sm">
        <thead className="bg-[#fafcf9] text-[11px] uppercase tracking-[.13em] text-[#8a9a93]">
          <tr>
            <th className="px-6 py-4 font-bold">Puesto</th>
            <th className="px-6 py-4 font-bold">Sector</th>
            <th className="px-6 py-4 font-bold">Arrendatario</th>
            <th className="px-6 py-4 font-bold">Estado</th>
            <th className="px-6 py-4 text-right font-bold">Acción</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#edf1ed]">
          {puestos.map((puesto) => (
            <tr className="table-row" key={puesto.id}>
              <td className="px-6 py-4 font-bold text-[#17352e]">
                {puesto.numero}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`rounded-md px-2.5 py-1 text-xs font-semibold ${sectorColors[puesto.sector]}`}
                >
                  {puesto.sector}
                </span>
              </td>
              <td className="px-6 py-4">
                <p
                  className={
                    puesto.estado === "Libre"
                      ? "text-[#9aaba4] italic"
                      : "font-medium"
                  }
                >
                  {puesto.arrendatario}
                </p>
                {puesto.contacto && (
                  <p className="mt-1 text-xs text-[#9aaba4]">
                    {puesto.contacto}
                  </p>
                )}
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center gap-2 text-xs font-semibold">
                  <span
                    className={`h-2 w-2 rounded-full ${puesto.estado === "Ocupado" ? "bg-[#65a467]" : "bg-[#b8c2bd]"}`}
                  />
                  {puesto.estado}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-[#42685d] hover:bg-[#eef3ee]"
                  onClick={() => onEdit(puesto)}
                >
                  <Pencil size={14} /> Editar
                </button>
              </td>
            </tr>
          ))}
          {puestos.length === 0 && (
            <tr>
              <td
                colSpan="5"
                className="px-6 py-16 text-center text-sm text-[#789086]"
              >
                No hay puestos que coincidan con la búsqueda.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}