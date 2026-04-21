import { useState } from "react";
import Icon from "@/components/ui/icon";

// ─── Types ────────────────────────────────────────────────────────────────────
type Section = "orders" | "doctors" | "technicians" | "patients" | "reports" | "stats" | "settings";

interface Order {
  id: string;
  patient: string;
  doctor: string;
  technician: string;
  types: string[];
  status: "new" | "in_progress" | "done" | "cancelled";
  date: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  teeth: number[];
}

interface Person {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  orders: number;
  status: "active" | "busy" | "offline";
}

interface Patient {
  id: string;
  name: string;
  dob: string;
  phone: string;
  doctor: string;
  orders: number;
  lastVisit: string;
}

interface Notification {
  id: string;
  text: string;
  time: string;
  type: "order" | "info" | "warning";
  read: boolean;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const mockOrders: Order[] = [
  { id: "ЗН-2401", patient: "Иванов И.И.", doctor: "Кузнецов А.В.", technician: "Петров С.Н.", types: ["Протезирование", "Коронки"], status: "new", date: "21.04.2026", dueDate: "28.04.2026", priority: "high", teeth: [14, 15, 16] },
  { id: "ЗН-2400", patient: "Смирнова О.Г.", doctor: "Волкова Е.М.", technician: "Сидоров Д.К.", types: ["Ортодонтия"], status: "in_progress", date: "20.04.2026", dueDate: "27.04.2026", priority: "medium", teeth: [11, 12, 13, 21, 22, 23] },
  { id: "ЗН-2399", patient: "Козлов В.Р.", doctor: "Кузнецов А.В.", technician: "Орлов В.Я.", types: ["Имплантация", "Мосты"], status: "done", date: "19.04.2026", dueDate: "25.04.2026", priority: "low", teeth: [46] },
  { id: "ЗН-2398", patient: "Новикова Т.С.", doctor: "Морозов П.Л.", technician: "Петров С.Н.", types: ["Виниры"], status: "in_progress", date: "19.04.2026", dueDate: "24.04.2026", priority: "high", teeth: [11, 12, 13, 14] },
  { id: "ЗН-2397", patient: "Фёдоров К.Д.", doctor: "Волкова Е.М.", technician: "Сидоров Д.К.", types: ["Коронки", "Протезирование", "Виниры"], status: "new", date: "18.04.2026", dueDate: "26.04.2026", priority: "medium", teeth: [36, 37] },
  { id: "ЗН-2396", patient: "Алексеева М.В.", doctor: "Морозов П.Л.", technician: "Орлов В.Я.", types: ["Мосты"], status: "cancelled", date: "17.04.2026", dueDate: "23.04.2026", priority: "low", teeth: [44, 45, 46] },
];

const mockDoctors: Person[] = [
  { id: "Д-001", name: "Кузнецов Алексей Викторович", specialty: "Ортопед", phone: "+7 (900) 123-45-67", orders: 14, status: "active" },
  { id: "Д-002", name: "Волкова Елена Михайловна", specialty: "Ортодонт", phone: "+7 (900) 234-56-78", orders: 9, status: "busy" },
  { id: "Д-003", name: "Морозов Павел Леонидович", specialty: "Хирург", phone: "+7 (900) 345-67-89", orders: 7, status: "active" },
  { id: "Д-004", name: "Соколова Анна Игоревна", specialty: "Терапевт", phone: "+7 (900) 456-78-90", orders: 5, status: "offline" },
];

const mockTechnicians: Person[] = [
  { id: "Т-001", name: "Петров Сергей Николаевич", specialty: "Зубной техник", phone: "+7 (901) 111-22-33", orders: 11, status: "busy" },
  { id: "Т-002", name: "Сидоров Дмитрий Константинович", specialty: "Техник-ортодонт", phone: "+7 (901) 222-33-44", orders: 8, status: "active" },
  { id: "Т-003", name: "Орлов Василий Яковлевич", specialty: "Техник-ортопед", phone: "+7 (901) 333-44-55", orders: 6, status: "active" },
  { id: "Т-004", name: "Захарова Ирина Петровна", specialty: "Техник-керамист", phone: "+7 (901) 444-55-66", orders: 3, status: "offline" },
];

const mockPatients: Patient[] = [
  { id: "П-0091", name: "Иванов Иван Иванович", dob: "15.03.1982", phone: "+7 (900) 000-11-22", doctor: "Кузнецов А.В.", orders: 3, lastVisit: "21.04.2026" },
  { id: "П-0090", name: "Смирнова Ольга Георгиевна", dob: "22.07.1975", phone: "+7 (900) 000-22-33", doctor: "Волкова Е.М.", orders: 2, lastVisit: "20.04.2026" },
  { id: "П-0089", name: "Козлов Виктор Романович", dob: "08.11.1990", phone: "+7 (900) 000-33-44", doctor: "Кузнецов А.В.", orders: 1, lastVisit: "19.04.2026" },
  { id: "П-0088", name: "Новикова Татьяна Сергеевна", dob: "30.05.1968", phone: "+7 (900) 000-44-55", doctor: "Морозов П.Л.", orders: 4, lastVisit: "19.04.2026" },
  { id: "П-0087", name: "Фёдоров Кирилл Денисович", dob: "12.09.1995", phone: "+7 (900) 000-55-66", doctor: "Волкова Е.М.", orders: 1, lastVisit: "18.04.2026" },
];

const mockNotifications: Notification[] = [
  { id: "1", text: "Новый заказ-наряд ЗН-2401 назначен врачу Кузнецову А.В.", time: "09:14", type: "order", read: false },
  { id: "2", text: "Заказ ЗН-2398 передан технику Петрову С.Н.", time: "08:52", type: "order", read: false },
  { id: "3", text: "Заказ ЗН-2399 выполнен — ожидает проверки", time: "08:30", type: "info", read: true },
  { id: "4", text: "Техник Захарова И.П. недоступна сегодня", time: "08:00", type: "warning", read: true },
];

// ─── Helper Components ────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Order["status"] }) {
  const map = {
    new: { label: "Новый", cls: "bg-blue-100 text-blue-700" },
    in_progress: { label: "В работе", cls: "bg-amber-100 text-amber-700" },
    done: { label: "Готов", cls: "bg-emerald-100 text-emerald-700" },
    cancelled: { label: "Отменён", cls: "bg-red-100 text-red-600" },
  };
  const { label, cls } = map[status];
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>{label}</span>;
}

function PersonStatus({ status }: { status: Person["status"] }) {
  const map = {
    active: { label: "Доступен", dot: "bg-emerald-500" },
    busy: { label: "Занят", dot: "bg-amber-400" },
    offline: { label: "Не в сети", dot: "bg-slate-300" },
  };
  const { label, dot } = map[status];
  return (
    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <span className={`w-2 h-2 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

function PriorityDot({ priority }: { priority: Order["priority"] }) {
  const map = { high: "bg-red-500", medium: "bg-amber-400", low: "bg-slate-300" };
  return <span className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${map[priority]}`} />;
}

// Зубная формула: верхний ряд 18→11 | 21→28, нижний ряд 48→41 | 31→38
const UPPER_RIGHT = [18,17,16,15,14,13,12,11];
const UPPER_LEFT  = [21,22,23,24,25,26,27,28];
const LOWER_RIGHT = [48,47,46,45,44,43,42,41];
const LOWER_LEFT  = [31,32,33,34,35,36,37,38];

function ToothCell({ num, selected, onClick }: { num: number; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title={`Зуб ${num}`}
      className={`w-6 h-6 rounded text-[9px] font-mono font-medium border transition-all leading-none
        ${selected
          ? "bg-primary text-white border-primary shadow-sm scale-105"
          : "bg-white text-muted-foreground border-border hover:border-primary/50 hover:text-primary"
        }`}
    >
      {num}
    </button>
  );
}

function ToothFormula({ selected, onChange }: { selected: number[]; onChange: (teeth: number[]) => void }) {
  const toggle = (n: number) =>
    onChange(selected.includes(n) ? selected.filter(t => t !== n) : [...selected, n].sort((a, b) => a - b));

  const Row = ({ nums, label }: { nums: number[]; label?: string }) => (
    <div className="flex items-center gap-0.5">
      {nums.map(n => <ToothCell key={n} num={n} selected={selected.includes(n)} onClick={() => toggle(n)} />)}
    </div>
  );

  return (
    <div className="select-none">
      <div className="flex gap-1 items-start mb-0.5">
        <div className="flex gap-0.5">
          <Row nums={UPPER_RIGHT} />
        </div>
        <div className="w-px bg-border self-stretch mx-0.5" />
        <div className="flex gap-0.5">
          <Row nums={UPPER_LEFT} />
        </div>
      </div>
      <div className="h-px bg-border mb-0.5" />
      <div className="flex gap-1 items-start">
        <div className="flex gap-0.5">
          <Row nums={LOWER_RIGHT} />
        </div>
        <div className="w-px bg-border self-stretch mx-0.5" />
        <div className="flex gap-0.5">
          <Row nums={LOWER_LEFT} />
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Выбрано:</span>
        {selected.length === 0
          ? <span className="text-xs text-muted-foreground italic">не выбрано</span>
          : <span className="text-xs font-mono font-medium text-primary">{selected.join(", ")}</span>
        }
        {selected.length > 0 && (
          <button onClick={() => onChange([])} className="text-xs text-muted-foreground hover:text-destructive ml-auto transition-colors">Сбросить</button>
        )}
      </div>
    </div>
  );
}

function TeethBadge({ teeth }: { teeth: number[] }) {
  if (!teeth.length) return <span className="text-xs text-muted-foreground">—</span>;
  return (
    <span className="font-mono text-xs text-primary bg-primary/8 px-1.5 py-0.5 rounded-md">
      {teeth.join(", ")}
    </span>
  );
}

function Toggle({ defaultOn }: { defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn(!on)}
      className={`relative rounded-full transition-colors focus:outline-none ${on ? "bg-primary" : "bg-muted-foreground/30"}`}
      style={{ width: 40, height: 22, minWidth: 40 }}
    >
      <span
        className={`absolute top-0.5 bg-white rounded-full shadow transition-transform`}
        style={{ width: 18, height: 18, left: 2, transform: on ? "translateX(18px)" : "translateX(0)" }}
      />
    </button>
  );
}

const ORDER_TYPES_LIST = ["Протезирование", "Ортодонтия", "Имплантация", "Виниры", "Коронки", "Мосты"];
const ALL_DOCTORS = ["Все врачи", ...mockDoctors.map(d => d.name.split(" ").slice(0, 2).join(" ") + " " + d.name.split(" ")[2]?.[0] + ".")];
const ALL_TECHNICIANS = ["Все техники", ...mockTechnicians.map(t => t.name.split(" ").slice(0, 2).join(" ") + " " + t.name.split(" ")[2]?.[0] + ".")];

// Мульти-выбор типов работ
function TypeMultiDropdown({ selected, onChange }: { selected: string[]; onChange: (v: string[]) => void }) {
  const [open, setOpen] = useState(false);
  const isActive = selected.length > 0;

  const toggle = (t: string) =>
    onChange(selected.includes(t) ? selected.filter(s => s !== t) : [...selected, t]);

  const label = isActive
    ? selected.length === 1 ? selected[0] : `${selected[0]} +${selected.length - 1}`
    : "Все типы";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border transition-all whitespace-nowrap
          ${isActive ? "bg-primary/10 border-primary/40 text-primary" : "bg-white border-border text-muted-foreground hover:border-primary/40"}`}
      >
        <Icon name="Tag" size={13} />
        <span className="max-w-[120px] truncate">{label}</span>
        {isActive && (
          <button
            onClick={e => { e.stopPropagation(); onChange([]); }}
            className="hover:text-destructive transition-colors"
          >
            <Icon name="X" size={11} />
          </button>
        )}
        <Icon name="ChevronDown" size={13} className={`transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-11 w-52 bg-white border border-border rounded-xl shadow-lg z-30 overflow-hidden animate-fade-in-up">
          <div className="px-3 py-2 border-b border-border flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">Типы работ</span>
            {selected.length > 0 && (
              <button onClick={() => onChange([])} className="text-xs text-primary hover:underline">Сбросить</button>
            )}
          </div>
          {ORDER_TYPES_LIST.map(t => (
            <button
              key={t}
              onClick={() => toggle(t)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-left hover:bg-muted/50 transition-colors
                ${selected.includes(t) ? "text-primary font-medium" : "text-foreground"}`}
            >
              <span className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors
                ${selected.includes(t) ? "bg-primary border-primary" : "border-border"}`}>
                {selected.includes(t) && <Icon name="Check" size={10} className="text-white" />}
              </span>
              {t}
            </button>
          ))}
        </div>
      )}
      {open && <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />}
    </div>
  );
}

// Одиночный dropdown (врач / техник)
function FilterDropdown({
  value, options, onChange, icon,
}: {
  value: string; options: string[]; onChange: (v: string) => void; icon: string;
}) {
  const [open, setOpen] = useState(false);
  const isActive = value !== options[0];
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border transition-all whitespace-nowrap
          ${isActive ? "bg-primary/10 border-primary/40 text-primary" : "bg-white border-border text-muted-foreground hover:border-primary/40"}`}
      >
        <Icon name={icon} size={13} fallback="Filter" />
        <span className="max-w-[110px] truncate">{value}</span>
        <Icon name="ChevronDown" size={13} className={`transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-11 min-w-[170px] bg-white border border-border rounded-xl shadow-lg z-30 overflow-hidden animate-fade-in-up">
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-xs text-left hover:bg-muted/50 transition-colors
                ${value === opt ? "text-primary font-medium bg-primary/5" : "text-foreground"}`}
            >
              {opt}
              {value === opt && <Icon name="Check" size={12} />}
            </button>
          ))}
        </div>
      )}
      {open && <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />}
    </div>
  );
}

// ─── Section: Orders ──────────────────────────────────────────────────────────
function OrdersView() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | Order["status"]>("all");
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [doctorFilter, setDoctorFilter] = useState("Все врачи");
  const [techFilter, setTechFilter] = useState("Все техники");

  const [editTeeth, setEditTeeth] = useState<{ orderId: string; teeth: number[] } | null>(null);
  const [orders, setOrders] = useState(mockOrders);

  const filtered = orders.filter(o => {
    const q = search.toLowerCase();
    const matchSearch = o.id.toLowerCase().includes(q) || o.patient.toLowerCase().includes(q) || o.doctor.toLowerCase().includes(q);
    const matchStatus = filter === "all" || o.status === filter;
    const matchType = typeFilter.length === 0 || o.types.some(t => typeFilter.includes(t));
    const matchDoctor = doctorFilter === "Все врачи" || o.doctor.startsWith(doctorFilter.split(" ").slice(0, 2).join(" "));
    const matchTech = techFilter === "Все техники" || o.technician.startsWith(techFilter.split(" ").slice(0, 2).join(" "));
    return matchSearch && matchStatus && matchType && matchDoctor && matchTech;
  });

  const statusFilters = [
    { key: "all", label: "Все" },
    { key: "new", label: "Новые" },
    { key: "in_progress", label: "В работе" },
    { key: "done", label: "Готовы" },
    { key: "cancelled", label: "Отменены" },
  ] as const;

  const saveTeeth = () => {
    if (!editTeeth) return;
    setOrders(prev => prev.map(o => o.id === editTeeth.orderId ? { ...o, teeth: editTeeth.teeth } : o));
    setEditTeeth(null);
  };

  return (
    <div className="animate-fade-in-up">
      {/* Filters row */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Поиск по номеру, пациенту, врачу…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors shadow-sm whitespace-nowrap">
            <Icon name="Plus" size={16} />
            Новый заказ
          </button>
        </div>

        <div className="flex gap-2 flex-wrap items-center">
          <TypeMultiDropdown selected={typeFilter} onChange={setTypeFilter} />
          <FilterDropdown value={doctorFilter} options={ALL_DOCTORS} onChange={setDoctorFilter} icon="Stethoscope" />
          <FilterDropdown value={techFilter} options={ALL_TECHNICIANS} onChange={setTechFilter} icon="Wrench" />
          <div className="w-px h-5 bg-border mx-1" />
          {statusFilters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key as typeof filter)}
              className={`px-3 py-2 text-xs font-medium rounded-xl transition-all ${filter === f.key ? "bg-primary text-white shadow-sm" : "bg-white border border-border text-muted-foreground hover:border-primary/40"}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Номер</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Пациент</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Врач</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Техник</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Тип</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Зубы</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Статус</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Сдача</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => {
              const isOverdue = order.status !== "done" && order.status !== "cancelled" && order.dueDate < "22.04.2026";
              return (
                <tr key={order.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <PriorityDot priority={order.priority} />
                      <span className="font-mono text-sm font-medium text-foreground">{order.id}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{order.patient}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{order.doctor}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{order.technician}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {order.types.map(t => (
                        <span key={t} className="px-2 py-0.5 rounded-md text-xs bg-secondary text-secondary-foreground font-medium whitespace-nowrap">{t}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <button
                      onClick={() => setEditTeeth({ orderId: order.id, teeth: order.teeth })}
                      className="group flex items-center gap-1"
                      title="Редактировать зубную формулу"
                    >
                      <TeethBadge teeth={order.teeth} />
                      <Icon name="Pencil" size={11} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`text-xs font-medium ${isOverdue ? "text-red-500" : "text-muted-foreground"}`}>
                      {isOverdue && <span className="mr-1">⚠</span>}
                      {order.dueDate}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                      <Icon name="MoreHorizontal" size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-16 text-center text-muted-foreground text-sm">
            <Icon name="FileSearch" size={32} className="mx-auto mb-3 opacity-30" />
            Заказы не найдены
          </div>
        )}
      </div>

      {/* Модал зубной формулы */}
      {editTeeth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setEditTeeth(null)} />
          <div className="relative bg-white rounded-2xl border border-border shadow-2xl p-6 w-full max-w-lg animate-fade-in-up">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold text-foreground">Зубная формула</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{editTeeth.orderId} — нажмите на зуб для выбора</p>
              </div>
              <button onClick={() => setEditTeeth(null)} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
                <Icon name="X" size={16} />
              </button>
            </div>

            <div className="bg-muted/30 rounded-xl p-4 mb-5">
              <div className="flex justify-center mb-1">
                <span className="text-[10px] text-muted-foreground mr-2">Верхняя челюсть</span>
              </div>
              <ToothFormula
                selected={editTeeth.teeth}
                onChange={teeth => setEditTeeth({ ...editTeeth, teeth })}
              />
              <div className="flex justify-center mt-2">
                <span className="text-[10px] text-muted-foreground">Нижняя челюсть</span>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button onClick={() => setEditTeeth(null)} className="px-4 py-2 text-sm rounded-xl border border-border text-muted-foreground hover:bg-muted transition-colors">
                Отмена
              </button>
              <button onClick={saveTeeth} className="px-4 py-2 text-sm rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors font-medium">
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Section: People ──────────────────────────────────────────────────────────
function PeopleView({ data, type }: { data: Person[]; type: "doctors" | "technicians" }) {
  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted-foreground">{data.length} {type === "doctors" ? "врачей" : "техников"} в системе</p>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors shadow-sm">
          <Icon name="UserPlus" size={16} />
          Добавить
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((person) => (
          <div key={person.id} className="bg-white rounded-2xl border border-border p-5 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary font-semibold text-sm">
                  {person.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <div className="font-medium text-sm text-foreground">{person.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{person.specialty}</div>
                </div>
              </div>
              <span className="text-xs font-mono text-muted-foreground">{person.id}</span>
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/60">
              <PersonStatus status={person.status} />
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Icon name="ClipboardList" size={13} />
                  {person.orders} заказов
                </span>
                <button className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary">
                  <Icon name="Bell" size={14} />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary">
                  <Icon name="Phone" size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Section: Patients ────────────────────────────────────────────────────────
function PatientsView() {
  const [search, setSearch] = useState("");
  const filtered = mockPatients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="animate-fade-in-up">
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="Поиск пациента…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors shadow-sm">
          <Icon name="UserPlus" size={16} />
          Добавить
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">ID</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">ФИО</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Дата рожд.</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Врач</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Заказов</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Последний визит</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((patient) => (
              <tr key={patient.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3 font-mono text-sm text-muted-foreground">{patient.id}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-primary text-xs font-semibold">
                      {patient.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                    </div>
                    <span className="text-sm font-medium">{patient.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{patient.dob}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell">{patient.doctor}</td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className="flex items-center gap-1 text-sm font-medium text-foreground">
                    <Icon name="ClipboardList" size={13} className="text-muted-foreground" />
                    {patient.orders}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell">{patient.lastVisit}</td>
                <td className="px-4 py-3">
                  <button className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                    <Icon name="MoreHorizontal" size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Section: Stats ───────────────────────────────────────────────────────────
function StatsView() {
  const stats = [
    { label: "Всего заказов", value: "2 401", change: "+12%", icon: "ClipboardList", color: "bg-blue-50 text-blue-600" },
    { label: "Новые сегодня", value: "7", change: "+3", icon: "FilePlus", color: "bg-emerald-50 text-emerald-600" },
    { label: "В работе", value: "23", change: "активных", icon: "Activity", color: "bg-amber-50 text-amber-600" },
    { label: "Готовы к выдаче", value: "5", change: "ожидают", icon: "CheckCircle", color: "bg-teal-50 text-teal-600" },
  ];
  const monthly = [
    { month: "Ноя", value: 180 }, { month: "Дек", value: 210 }, { month: "Янв", value: 195 },
    { month: "Фев", value: 230 }, { month: "Мар", value: 215 }, { month: "Апр", value: 248 },
  ];
  const maxVal = Math.max(...monthly.map(m => m.value));
  return (
    <div className="animate-fade-in-up space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-border p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-xl ${s.color}`}>
                <Icon name={s.icon} size={18} fallback="Circle" />
              </div>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{s.change}</span>
            </div>
            <div className="text-2xl font-semibold text-foreground">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-5">Заказы по месяцам</h3>
          <div className="flex items-end gap-3 h-36">
            {monthly.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-xs text-muted-foreground">{m.value}</span>
                <div className="w-full rounded-t-lg bg-primary/80 hover:bg-primary transition-colors" style={{ height: `${(m.value / maxVal) * 100}%` }} />
                <span className="text-xs text-muted-foreground">{m.month}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-5">По типам работ</h3>
          <div className="space-y-3">
            {[
              { label: "Протезирование", pct: 38, color: "bg-primary" },
              { label: "Ортодонтия", pct: 27, color: "bg-accent" },
              { label: "Имплантация", pct: 20, color: "bg-amber-400" },
              { label: "Другое", pct: 15, color: "bg-slate-300" },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium">{item.pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Section: Reports ─────────────────────────────────────────────────────────
function ReportsView() {
  return (
    <div className="animate-fade-in-up">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: "Отчёт по заказам", desc: "Сводка заказ-нарядов за период", icon: "FileText", color: "bg-blue-50 text-blue-600" },
          { title: "Отчёт по врачам", desc: "Нагрузка и эффективность врачей", icon: "Stethoscope", color: "bg-teal-50 text-teal-600" },
          { title: "Отчёт по техникам", desc: "Выполнение заданий техниками", icon: "Wrench", color: "bg-amber-50 text-amber-600" },
          { title: "Финансовый отчёт", desc: "Выручка и оплаты за период", icon: "BarChart2", color: "bg-emerald-50 text-emerald-600" },
        ].map((r, i) => (
          <div key={i} className="bg-white rounded-2xl border border-border p-5 hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${r.color}`}>
                <Icon name={r.icon} size={20} fallback="FileText" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm text-foreground mb-1">{r.title}</div>
                <div className="text-xs text-muted-foreground">{r.desc}</div>
              </div>
              <Icon name="Download" size={16} className="text-muted-foreground group-hover:text-primary transition-colors mt-1" />
            </div>
            <div className="mt-4 pt-4 border-t border-border/60 flex gap-2">
              {["За неделю", "За месяц", "Квартал"].map(p => (
                <button key={p} className="px-3 py-1.5 text-xs rounded-lg bg-muted hover:bg-secondary hover:text-secondary-foreground transition-colors">
                  {p}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Section: Settings ────────────────────────────────────────────────────────
function SettingsView() {
  const groups = [
    {
      section: "Уведомления",
      items: [
        { label: "Уведомлять врача при создании заказа", defaultOn: true },
        { label: "Уведомлять техника при назначении заказа", defaultOn: true },
        { label: "Уведомления о просроченных заказах", defaultOn: true },
        { label: "Отчёты на e-mail (еженедельно)", defaultOn: false },
      ],
    },
    {
      section: "Система",
      items: [
        { label: "Автоматическая нумерация заказов", defaultOn: true },
        { label: "Двухфакторная аутентификация", defaultOn: false },
        { label: "Логирование действий пользователей", defaultOn: true },
      ],
    },
  ];
  return (
    <div className="animate-fade-in-up max-w-2xl space-y-4">
      {groups.map((group, gi) => (
        <div key={gi} className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border bg-muted/30">
            <h3 className="text-sm font-semibold text-foreground">{group.section}</h3>
          </div>
          {group.items.map((item, ii) => (
            <div key={ii} className="flex items-center justify-between px-5 py-3.5 border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
              <span className="text-sm text-foreground">{item.label}</span>
              <Toggle defaultOn={item.defaultOn} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Main Layout ──────────────────────────────────────────────────────────────
export default function Index() {
  const [section, setSection] = useState<Section>("orders");
  const [notifOpen, setNotifOpen] = useState(false);
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  const nav: { id: Section; label: string; icon: string }[] = [
    { id: "orders", label: "Заказы", icon: "ClipboardList" },
    { id: "doctors", label: "Врачи", icon: "Stethoscope" },
    { id: "technicians", label: "Техники", icon: "Wrench" },
    { id: "patients", label: "Пациенты", icon: "Users" },
    { id: "reports", label: "Отчёты", icon: "FileBarChart" },
    { id: "stats", label: "Статистика", icon: "BarChart2" },
    { id: "settings", label: "Настройки", icon: "Settings" },
  ];

  const sectionTitles: Record<Section, string> = {
    orders: "Заказ-наряды",
    doctors: "Врачи",
    technicians: "Техники",
    patients: "Пациенты",
    reports: "Отчёты",
    stats: "Статистика",
    settings: "Настройки",
  };

  return (
    <div className="flex h-screen bg-background font-sans overflow-hidden">
      {/* ── Sidebar ── */}
      <aside className="w-60 flex-shrink-0 flex flex-col" style={{ background: "hsl(var(--sidebar-background))" }}>
        {/* Logo */}
        <div className="px-5 py-5 border-b" style={{ borderColor: "hsl(var(--sidebar-border))" }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md">
              <Icon name="Plus" size={16} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white leading-tight">МедСистема</div>
              <div className="text-xs" style={{ color: "hsl(var(--sidebar-foreground))", opacity: 0.5 }}>Управление заказами</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {nav.map(item => {
            const active = section === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${active ? "bg-primary text-white font-medium shadow-sm" : "hover:bg-white/10"}`}
                style={!active ? { color: "hsl(var(--sidebar-foreground))" } : undefined}
              >
                <Icon name={item.icon} size={17} fallback="Circle" />
                {item.label}
                {item.id === "orders" && (
                  <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full bg-white/20 font-medium">
                    {mockOrders.filter(o => o.status === "new").length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-3 pb-4">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: "hsl(var(--sidebar-accent))" }}>
            <div className="w-7 h-7 rounded-lg bg-primary/50 flex items-center justify-center text-white text-xs font-medium">АД</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-white truncate">Администратор</div>
              <div className="text-xs truncate" style={{ color: "hsl(var(--sidebar-foreground))", opacity: 0.5 }}>Главный врач</div>
            </div>
            <button className="hover:text-white transition-colors" style={{ color: "hsl(var(--sidebar-foreground))", opacity: 0.5 }}>
              <Icon name="LogOut" size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-border px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-lg font-semibold text-foreground">{sectionTitles[section]}</h1>
            <p className="text-xs text-muted-foreground">21 апреля 2026</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-muted rounded-xl text-sm text-muted-foreground cursor-default">
              <Icon name="Search" size={14} />
              <span>Быстрый поиск…</span>
              <kbd className="ml-2 text-xs bg-white border border-border px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative w-9 h-9 flex items-center justify-center rounded-xl border border-border bg-white hover:bg-muted transition-colors"
              >
                <Icon name="Bell" size={17} className="text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-11 w-80 bg-white border border-border rounded-2xl shadow-xl z-50 animate-fade-in-up overflow-hidden">
                  <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                    <span className="text-sm font-semibold">Уведомления</span>
                    <span className="text-xs text-primary cursor-pointer hover:underline">Прочитать все</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {mockNotifications.map(n => (
                      <div key={n.id} className={`px-4 py-3 border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors ${!n.read ? "bg-primary/5" : ""}`}>
                        <div className="flex items-start gap-2.5">
                          <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${n.type === "order" ? "bg-primary" : n.type === "warning" ? "bg-amber-400" : "bg-emerald-500"}`} />
                          <div>
                            <p className="text-xs text-foreground leading-relaxed">{n.text}</p>
                            <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-6 py-6">
          {section === "orders" && <OrdersView />}
          {section === "doctors" && <PeopleView data={mockDoctors} type="doctors" />}
          {section === "technicians" && <PeopleView data={mockTechnicians} type="technicians" />}
          {section === "patients" && <PatientsView />}
          {section === "reports" && <ReportsView />}
          {section === "stats" && <StatsView />}
          {section === "settings" && <SettingsView />}
        </main>
      </div>

      {notifOpen && <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />}
    </div>
  );
}