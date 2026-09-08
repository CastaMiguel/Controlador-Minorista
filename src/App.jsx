import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Building2,
  LayoutDashboard,
  Menu,
  Plus,
  Search,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react";
import Dashboard from "./components/Dashboard";
import PuestosTable from "./components/PuestosTable";
import PuestoModal from "./components/PuestoModal";
import { initialPuestos } from "./data/puestos";
import {
  createPuesto,
  getPuestos,
  updatePuesto,
} from "./services/puestosService";

const navigation = [
  { id: "resumen", label: "Resumen general", icon: LayoutDashboard },
  { id: "puestos", label: "Puestos", icon: BarChart3 },
  { id: "arrendatarios", label: "Arrendatarios", icon: Users },
];

function App() {
  const [activeView, setActiveView] = useState("resumen");
  const [puestos, setPuestos] = useState(initialPuestos);
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("Todos");
  const [modalPuesto, setModalPuesto] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useEffect(() => {
    getPuestos()
      .then((data) => setPuestos(data))
      .catch(() => {});
  }, []);

  const filteredPuestos = useMemo(
    () =>
      puestos.filter((puesto) => {
        const matchesSector = sector === "Todos" || puesto.sector === sector;
        const query = search.toLowerCase().trim();
        return (
          matchesSector &&
          [puesto.numero, puesto.arrendatario, puesto.sector].some((value) =>
            String(value).toLowerCase().includes(query),
          )
        );
      }),
    [puestos, search, sector],
  );

  const arrendatarios = useMemo(
    () => puestos.filter((puesto) => puesto.estado === "Ocupado"),
    [puestos],
  );

  async function savePuesto(formData) {
    try {
      const saved =
        formData.id && puestos.some((puesto) => puesto.id === formData.id)
          ? await updatePuesto(formData.id, formData)
          : await createPuesto(formData);
      setPuestos((current) =>
        current.some((puesto) => puesto.id === saved.id)
          ? current.map((puesto) => (puesto.id === saved.id ? saved : puesto))
          : [saved, ...current],
      );
    } catch {
      setPuestos((current) =>
        current.some((puesto) => puesto.id === formData.id)
          ? current.map((puesto) =>
              puesto.id === formData.id ? formData : puesto,
            )
          : [formData, ...current],
      );
    }
    setModalPuesto(null);
  }

  function navigate(view) {
    setActiveView(view);
    setSidebarOpen(false);
    window.history.replaceState(null, "", `#${view}`);
  }

  return (
    <div className="min-h-screen bg-[#f5f7f4] text-[#17352e]">
      <aside
        className={`sidebar fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-[#102b26] px-5 py-6 text-white transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#d8f36a] text-[#102b26]">
              <Building2 size={21} />
            </div>
            <div>
              <p className="font-display text-lg leading-none">Plaza Minorista</p>
              <p className="mt-1 text-[10px] uppercase tracking-[.18em] text-[#b8cec5]">
                Medellín
              </p>
            </div>
          </div>
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Cerrar menú"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="mt-12 space-y-2 text-sm">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[.2em] text-[#799a8e]">
            Gestión
          </p>
          {navigation.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left font-semibold transition ${activeView === id ? "nav-active" : "text-[#b8cec5] hover:bg-white/10"}`}
              onClick={() => navigate(id)}
            >
              <Icon size={18} /> {label}
            </button>
          ))}
        </nav>
      </aside>
      {sidebarOpen && (
        <button
          className="fixed inset-0 z-20 bg-[#102b26]/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Cerrar menú"
        />
      )}
      <main className="lg:pl-64">
        <header className="flex h-20 items-center justify-between border-b border-[#dfe7e1] bg-white/80 px-5 backdrop-blur md:px-10">
          <div className="flex items-center gap-4">
            <button
              className="rounded-lg p-2 hover:bg-[#eef3ee] lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menú"
            >
              <Menu size={21} />
            </button>
            <div>
              <p className="text-xs font-medium text-[#789086]">
                Lunes, 07 de septiembre de 2026
              </p>
              <h1 className="font-display text-xl font-semibold tracking-tight">
                {navigation.find((item) => item.id === activeView)?.label}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden h-8 w-px bg-[#dfe7e1] sm:block" />
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-[#e4cbb9] text-sm font-bold text-[#6a4433]">
                HP
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-xs font-semibold">Henry Peréz</p>
                <p className="text-[11px] text-[#789086]">Administrador</p>
              </div>
            </div>
          </div>
        </header>
        <div className="mx-auto max-w-375 px-5 py-8 md:px-10 md:py-10">
          {activeView === "resumen" && (
            <ResumenPage
              puestos={puestos}
              onNew={() => setModalPuesto({})}
              onNavigate={navigate}
            />
          )}
          {activeView === "puestos" && (
            <PuestosPage
              puestos={filteredPuestos}
              search={search}
              setSearch={setSearch}
              sector={sector}
              setSector={setSector}
              onNew={() => setModalPuesto({})}
              onEdit={setModalPuesto}
            />
          )}
          {activeView === "arrendatarios" && (
            <ArrendatariosPage
              arrendatarios={arrendatarios}
              onEdit={setModalPuesto}
            />
          )}
        </div>
      </main>
      {modalPuesto !== null && (
        <PuestoModal
          puesto={modalPuesto}
          onClose={() => setModalPuesto(null)}
          onSave={savePuesto}
        />
      )}
    </div>
  );
}

function PageIntro({ title, description, action }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.16em] text-[#8b6f4b]">
          <span className="h-2 w-2 rounded-full bg-[#d8f36a]" /> Plaza Minorista
          José María Villa
        </div>
        <h2 className="font-display text-4xl font-semibold tracking-tight text-[#17352e] md:text-5xl">
          {title}
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-[#6b8178]">
          {description}
        </p>
      </div>
      {action && (
        <button
          className="button-primary flex w-fit items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold"
          onClick={action.onClick}
        >
          <Plus size={18} /> {action.label}
        </button>
      )}
    </div>
  );
}

function ResumenPage({ puestos, onNew, onNavigate }) {
  return (
    <>
      <PageIntro
        title="Buenos días, María."
        description="Este es el estado de la operación de la plaza para hoy."
        action={{ label: "Registrar puesto", onClick: onNew }}
      />
      <Dashboard puestos={puestos} />
      <section className="mt-9 rounded-2xl border border-[#dfe7e1] bg-white p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-display text-xl font-semibold">
              Accesos rápidos
            </h3>
            <p className="mt-1 text-sm text-[#789086]">
              Administra la información más importante de la plaza.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="secondary-button"
              onClick={() => onNavigate("puestos")}
            >
              Ver puestos
            </button>
            <button
              className="secondary-button"
              onClick={() => onNavigate("arrendatarios")}
            >
              Ver arrendatarios
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

function PuestosPage({
  puestos,
  search,
  setSearch,
  sector,
  setSector,
  onNew,
  onEdit,
}) {
  return (
    <>
      <PageIntro
        title="Directorio de puestos"
        description="Consulta y administra las asignaciones comerciales."
        action={{ label: "Registrar puesto", onClick: onNew }}
      />
      <section className="overflow-hidden rounded-2xl border border-[#dfe7e1] bg-white shadow-[0_8px_30px_rgba(35,70,56,.04)]">
        <div className="flex flex-col gap-4 border-b border-[#edf1ed] p-5 md:flex-row md:items-center md:justify-between md:p-6">
          <div>
            <h3 className="font-display text-xl font-semibold">
              Puestos registrados
            </h3>
            <p className="mt-1 text-xs text-[#789086]">
              {puestos.length} resultados encontrados
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8da098]"
                size={17}
              />
              <input
                className="h-10 w-full rounded-lg border border-[#dfe7e1] bg-[#fafcf9] pl-9 pr-3 text-sm outline-none placeholder:text-[#9aaba4] focus:border-[#9dbd48] sm:w-52"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar puesto..."
              />
            </div>
            <div className="relative">
              <SlidersHorizontal
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8da098]"
                size={15}
              />
              <select
                className="h-10 w-full appearance-none rounded-lg border border-[#dfe7e1] bg-[#fafcf9] pl-9 pr-8 text-sm outline-none focus:border-[#9dbd48] sm:w-48"
                value={sector}
                onChange={(event) => setSector(event.target.value)}
              >
                <option>Todos</option>
                <option>Zapatos</option>
                <option>Electronicos</option>
                <option>Frutas y verduras</option>
                <option>Restaurante</option>
                <option>Tienda</option>
                <option>Ropa</option>
                <option>Varios</option>
              </select>
            </div>
          </div>
        </div>
        <PuestosTable puestos={puestos} onEdit={onEdit} />
      </section>
    </>
  );
}

function ArrendatariosPage({ arrendatarios, onEdit }) {
  return (
    <>
      <PageIntro
        title="Arrendatarios"
        description="Consulta los negocios actualmente asignados a la plaza."
      />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {arrendatarios.map((puesto) => (
          <article
            className="rounded-2xl border border-[#dfe7e1] bg-white p-5 shadow-[0_8px_30px_rgba(35,70,56,.04)]"
            key={puesto.id}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.14em] text-[#8b6f4b]">
                  Puesto {puesto.numero}
                </p>
                <h3 className="mt-2 font-display text-lg font-semibold">
                  {puesto.arrendatario}
                </h3>
              </div>
              <span className="h-2.5 w-2.5 rounded-full bg-[#65a467]" />
            </div>
            <p className="mt-4 text-sm text-[#789086]">
              Sector {puesto.sector}
            </p>
            <p className="mt-1 text-sm text-[#789086]">
              {puesto.contacto || "Sin teléfono registrado"}
            </p>
            <button
              className="secondary-button mt-5 w-full"
              onClick={() => onEdit(puesto)}
            >
              Editar asignación
            </button>
          </article>
        ))}
      </section>
    </>
  );
}

export default App;
