import { Armchair, CheckCircle2, Store } from "lucide-react";

function SummaryCard({ label, value, detail, icon: Icon, tone }) {
  return (
    <article className={`summary-card ${tone} rounded-2xl border p-5`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.12em] opacity-70">
            {label}
          </p>
          <p className="mt-3 font-display text-4xl font-semibold">{value}</p>
        </div>
        <div className="rounded-xl bg-white/70 p-2.5">
          <Icon size={20} />
        </div>
      </div>
      <p className="mt-5 text-xs font-medium opacity-70">{detail}</p>
    </article>
  );
}

export default function Dashboard({ puestos }) {
  const occupied = puestos.filter(
    (puesto) => puesto.estado === "Ocupado",
  ).length;
  const free = puestos.filter((puesto) => puesto.estado === "Libre").length;
  return (
    <section className="grid gap-4 md:grid-cols-3">
      <SummaryCard
        label="Total de puestos"
        value={puestos.length}
        detail="Capacidad registrada"
        icon={Store}
        tone="summary-lime"
      />
      <SummaryCard
        label="Puestos ocupados"
        value={occupied}
        detail={`${Math.round((occupied / puestos.length) * 100)}% de ocupación actual`}
        icon={CheckCircle2}
        tone="summary-peach"
      />
      <SummaryCard
        label="Puestos libres"
        value={free}
        detail="Disponibles para asignación"
        icon={Armchair}
        tone="summary-sage"
      />
    </section>
  );
}