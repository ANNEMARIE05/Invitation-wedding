import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  RefreshCw,
  Download,
  MailCheck,
  Users,
  UserRound,
  UserX,
  UserPlus,
  UtensilsCrossed,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { getRsvps } from "@/lib/api";
import { useStoreSync } from "@/lib/useStoreSync";

const PAGE_SIZE = 6;

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const norm = (s) =>
  String(s ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

const panel =
  "rounded-md bg-[#FDFAF8] ring-1 ring-[#DDD2D8] shadow-[0_2px_8px_rgba(42,5,11,0.04)]";

const surfaceBtn =
  "rounded-md bg-[#FDFAF8] ring-1 ring-[#DDD2D8] transition-all hover:ring-[#935065]/30";

const labelCaps =
  "font-cinzel text-[10px] font-semibold tracking-[0.14em] uppercase text-[#4A3840]";

const selectCls =
  "mt-1.5 w-full min-w-[9.5rem] cursor-pointer rounded-md border-0 bg-[#FFFBFC] py-2.5 pl-3 pr-9 text-sm font-medium text-[#1F181A] ring-1 ring-[#DDD2D8] transition-all focus:ring-2 focus:ring-[#935065]/30 disabled:cursor-not-allowed disabled:bg-[#F5F0F2] disabled:text-[#8C7B7E]";

const thCell =
  "border-r border-[#E0D0D6] px-4 py-3 font-cinzel text-[10px] font-semibold tracking-[0.12em] uppercase text-[#4A3840] last:border-r-0";

const tdCell =
  "border-r border-[#EDE4E8] px-4 py-3.5 align-top text-[#1F181A] last:border-r-0";

function PresenceBadge({ present }) {
  return (
    <span
      className={`inline-flex min-w-[2.75rem] justify-center rounded-lg px-2.5 py-1 font-cinzel text-[10px] tracking-[0.1em] uppercase ${
        present
          ? "bg-[#935065]/10 text-[#865563] ring-1 ring-[#935065]/18"
          : "bg-[#F3E8EA] text-[#5C3038] ring-1 ring-[#C48B92]/45"
      }`}
    >
      {present ? "Oui" : "Non"}
    </span>
  );
}

export default function RsvpDashboard() {
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState("");
  const [presenceFilter, setPresenceFilter] = useState("all");
  const [modeFilter, setModeFilter] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRsvps(await getRsvps());
    } catch {
      toast.error("Impossible de charger les réponses.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useStoreSync("rsvps", load);

  const presents = rsvps.filter((r) => r.present);
  const presentiel = presents.filter((r) => (r.mode || "presentiel") !== "zoom");
  const zoomJoins = presents.filter((r) => r.mode === "zoom");
  const absents = rsvps.filter((r) => !r.present);
  const accompagnants = presentiel.reduce((s, r) => s + (r.accompagnants || 0), 0);
  const totalPersonnes = presentiel.length + accompagnants;
  const regimes = {};
  presentiel.forEach((r) => {
    if (r.regime && r.regime !== "Aucun") {
      const key = r.regime.replace(" (préciser en message)", "");
      regimes[key] = (regimes[key] || 0) + 1 + (r.accompagnants || 0);
    }
  });
  const regimeEntries = Object.entries(regimes);

  const filtered = useMemo(() => {
    const q = norm(query.trim());
    return rsvps.filter((r) => {
      if (presenceFilter === "yes" && !r.present) return false;
      if (presenceFilter === "no" && r.present) return false;
      if (presenceFilter !== "no" && modeFilter !== "all" && r.present) {
        const mode = r.mode === "zoom" ? "zoom" : "presentiel";
        if (modeFilter !== mode) return false;
      }
      if (presenceFilter === "no" && modeFilter !== "all") return false;
      if (!q) return true;
      const hay = norm(`${r.nom} ${r.telephone || ""} ${r.email || ""} ${r.message || ""} ${r.chanson || ""}`);
      return hay.includes(q);
    });
  }, [rsvps, query, presenceFilter, modeFilter]);

  useEffect(() => {
    setPage(0);
  }, [query, presenceFilter, modeFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const pageStart = safePage * PAGE_SIZE;
  const pageRsvps = filtered.slice(pageStart, pageStart + PAGE_SIZE);
  const rangeFrom = filtered.length === 0 ? 0 : pageStart + 1;
  const rangeTo = Math.min(pageStart + PAGE_SIZE, filtered.length);

  const exportCsv = () => {
    const rows = [
      ["Nom", "WhatsApp", "Présent", "Mode", "Accompagnants", "Régime", "Chanson", "Message", "Date"],
      ...filtered.map((r) => [
        r.nom,
        r.telephone || r.email,
        r.present ? "Oui" : "Non",
        r.present ? (r.mode === "zoom" ? "Zoom" : "Présentiel") : "",
        r.accompagnants,
        r.regime,
        r.chanson,
        (r.message || "").replace(/[\r\n;]+/g, " "),
        formatDate(r.created_at),
      ]),
    ];
    const csv = "﻿" + rows.map((row) => row.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(";")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "reponses-mariage.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Liste exportée (filtres appliqués).");
  };

  const stats = [
    { icon: Users, label: "Présentiel", value: presentiel.length, testId: "stat-presents" },
    {
      icon: UserRound,
      label: "Accompagnants",
      value: accompagnants,
      testId: "stat-accompagnants",
    },
    { icon: MailCheck, label: "Sur Zoom", value: zoomJoins.length, testId: "stat-zoom" },
    { icon: UserX, label: "Absents", value: absents.length, testId: "stat-absents" },
    { icon: UserPlus, label: "Total sur place", value: totalPersonnes, testId: "stat-total" },
  ];

  return (
    <div
      className="admin-dashboard-light min-h-screen w-full text-[#1F181A] px-5 py-9 sm:px-7 sm:py-10 lg:px-9"
      data-testid="rsvp-dashboard"
    >
      <div className="mx-auto w-full max-w-[96rem]">
        <div className="flex flex-wrap items-start justify-between gap-4 sm:gap-6">
          <div>
            <Link
              to="/espace-maries"
              data-testid="dashboard-back-link"
              className="inline-flex items-center gap-1.5 font-cinzel text-[10px] font-medium tracking-[0.18em] uppercase text-[#865563] transition-colors hover:text-[#5A3840]"
            >
              <ArrowLeft size={14} strokeWidth={1.5} /> Espace mariés
            </Link>
            <h1 className="mt-2 font-display text-[1.75rem] font-semibold leading-tight tracking-[-0.02em] text-[#5A3840] sm:text-[2rem]">
              Bilan des réponses
            </h1>
            <p className="mt-0.5 font-display text-base italic text-[#755057]">Qui sera des nôtres</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              data-testid="dashboard-refresh-button"
              onClick={load}
              className={`inline-flex items-center gap-2 px-3.5 py-2 font-cinzel text-[10px] tracking-[0.14em] uppercase text-[#5A3840] ${surfaceBtn}`}
            >
              <RefreshCw size={14} strokeWidth={1.5} /> Actualiser
            </button>
            <button
              type="button"
              data-testid="dashboard-export-button"
              onClick={exportCsv}
              disabled={filtered.length === 0}
              className="inline-flex items-center gap-2 rounded-md bg-[#935065] px-3.5 py-2 font-cinzel text-[10px] tracking-[0.14em] uppercase text-white transition-all hover:bg-[#7F5562] disabled:opacity-45"
            >
              <Download size={14} strokeWidth={1.5} /> Exporter
            </button>
          </div>
        </div>

        <div className="mt-9 grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-4 xl:grid-cols-5" data-testid="dashboard-stats">
          {stats.map(({ icon: Icon, label, value, testId }) => (
            <div key={label} className={`${panel} p-4 text-center sm:p-5`} data-testid={testId}>
              <Icon size={18} className="mx-auto text-[#A89573]" strokeWidth={1.75} />
              <p className="mt-2 font-display text-3xl font-semibold tabular-nums leading-none text-[#4A3539]">{value}</p>
              <p className={`mt-1.5 ${labelCaps}`}>{label}</p>
            </div>
          ))}
        </div>

        <div className={`${panel} mt-7 flex items-center gap-3 px-5 py-4`} data-testid="dashboard-regimes">
          <UtensilsCrossed size={17} className="shrink-0 text-[#A89573]" strokeWidth={1.75} />
          {regimeEntries.length === 0 ? (
            <p className="text-sm font-medium leading-snug text-[#4A3840]">Aucun régime particulier signalé.</p>
          ) : (
            <p className="text-sm font-medium leading-snug text-[#1F181A]">
              <span className={`mr-2 ${labelCaps}`}>Repas</span>
              {regimeEntries.map(([k, v]) => `${v} ${k.toLowerCase()}`).join(" · ")}
            </p>
          )}
        </div>

        <div className={`${panel} mt-7 p-5 sm:p-6`} data-testid="dashboard-filters">
          <p className={labelCaps}>Filtrer</p>
          <div className="mt-3.5 grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_11rem_11rem] lg:items-end">
            <label className="block sm:col-span-2 lg:col-span-1">
              <span className={labelCaps}>Recherche</span>
              <div className="relative mt-1.5">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#935065]/50"
                  strokeWidth={1.5}
                />
                <input
                  type="search"
                  data-testid="dashboard-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Nom, téléphone, message…"
                  className="w-full rounded-md border-0 bg-[#FFFBFC] py-2.5 pl-10 pr-3 text-sm font-medium text-[#1F181A] placeholder:font-normal placeholder:text-[#6B5A60] ring-1 ring-[#DDD2D8] transition-all focus:ring-2 focus:ring-[#935065]/30"
                />
              </div>
            </label>
            <label className="block">
              <span className={labelCaps}>Présence</span>
              <select
                data-testid="dashboard-filter-presence"
                value={presenceFilter}
                onChange={(e) => {
                  const v = e.target.value;
                  setPresenceFilter(v);
                  if (v === "no") setModeFilter("all");
                }}
                className={selectCls}
              >
                <option value="all">Tous</option>
                <option value="yes">Présents</option>
                <option value="no">Absents</option>
              </select>
            </label>
            <label className="block">
              <span className={labelCaps}>Mode</span>
              <select
                data-testid="dashboard-filter-mode"
                value={modeFilter}
                onChange={(e) => setModeFilter(e.target.value)}
                disabled={presenceFilter === "no"}
                className={selectCls}
              >
                <option value="all">Tous</option>
                <option value="presentiel">Présentiel</option>
                <option value="zoom">Sur Zoom</option>
              </select>
            </label>
          </div>
          <p className="mt-4 text-sm text-[#4A3840]">
            <span className="font-semibold tabular-nums text-[#4A3539]">{filtered.length}</span>
            {" "}réponse{filtered.length !== 1 ? "s" : ""} sur {rsvps.length}
          </p>
        </div>

        <div className={`${panel} mt-7 overflow-hidden`} data-testid="dashboard-table">
          {loading && (
            <p className="p-6 text-center font-display text-base text-[#4A3840]">Chargement des réponses…</p>
          )}
          {!loading && rsvps.length === 0 && (
            <p className="p-6 text-center font-display text-base text-[#4A3840]" data-testid="dashboard-empty">
              Aucune réponse pour le moment — les premières ne vont pas tarder.
            </p>
          )}
          {!loading && rsvps.length > 0 && filtered.length === 0 && (
            <p className="p-6 text-center text-sm font-medium text-[#4A3840]" data-testid="dashboard-no-match">
              Aucun résultat pour ces filtres. Essayez d&apos;élargir la recherche.
            </p>
          )}
          {!loading && filtered.length > 0 && (
            <>
              <div className="divide-y divide-[#EDE4E8] sm:hidden">
                {pageRsvps.map((r, i) => (
                  <div key={r.id || i} className="px-5 py-4" data-testid={`dashboard-rsvp-${i}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-display text-base font-semibold text-[#1F181A]">{r.nom}</p>
                        <p className="mt-0.5 text-sm text-[#4A3840]">{r.telephone || r.email}</p>
                        <p className="mt-0.5 text-[10px] font-cinzel font-medium uppercase tracking-[0.08em] text-[#6B5A60]">
                          {formatDate(r.created_at)}
                        </p>
                      </div>
                      <PresenceBadge present={r.present} />
                    </div>
                    <p className="mt-2 text-sm text-[#1F181A]">
                      {[
                        r.present ? (r.mode === "zoom" ? "Zoom" : "Présentiel") : "Absent",
                        r.present && r.mode !== "zoom" && r.accompagnants > 0 ? `+${r.accompagnants} accompagnant(s)` : "",
                        r.regime && r.regime !== "Aucun" ? r.regime.replace(" (préciser en message)", "") : "",
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    {r.chanson && (
                      <p className="mt-1.5 text-sm font-medium text-[#5A3840]">♪ {r.chanson}</p>
                    )}
                    {r.message && (
                      <p className="mt-1 text-[15px] font-medium leading-relaxed text-[#1F181A]">
                        « {r.message} »
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="hidden overflow-x-auto sm:block">
                <table className="w-full min-w-[720px] border-collapse text-left">
                  <thead>
                    <tr className="border-b-2 border-[#E0D0D6] bg-[#FBF7F9]">
                      <th className={`${thCell} pl-4`}>Invité</th>
                      <th className={thCell}>Présence</th>
                      <th className={thCell}>Mode</th>
                      <th className={thCell}>Accomp.</th>
                      <th className={thCell}>Régime</th>
                      <th className={`${thCell} pr-4`}>Chanson & message</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {pageRsvps.map((r, i) => (
                      <tr
                        key={r.id || i}
                        className="border-b border-[#EDE4E8] transition-colors hover:bg-[#FBF7F9]"
                        data-testid={`dashboard-rsvp-row-${i}`}
                      >
                        <td className={`${tdCell} pl-4`}>
                          <p className="font-display text-[15px] font-semibold leading-snug text-[#1F181A]">{r.nom}</p>
                          <p className="mt-0.5 text-sm text-[#4A3840]">{r.telephone || r.email}</p>
                          <p className="mt-0.5 text-[10px] font-cinzel font-medium uppercase tracking-[0.08em] text-[#6B5A60]">
                            {formatDate(r.created_at)}
                          </p>
                        </td>
                        <td className={tdCell}>
                          <PresenceBadge present={r.present} />
                        </td>
                        <td className={`${tdCell} font-cinzel text-[11px] font-medium uppercase tracking-[0.06em] text-[#3D2A30]`}>
                          {r.present ? (r.mode === "zoom" ? "Zoom" : "Présentiel") : "—"}
                        </td>
                        <td className={`${tdCell} tabular-nums font-medium`}>
                          {r.present && r.mode !== "zoom" && r.accompagnants > 0 ? `+${r.accompagnants}` : "—"}
                        </td>
                        <td className={`${tdCell} font-medium`}>
                          {r.regime && r.regime !== "Aucun" ? r.regime.replace(" (préciser en message)", "") : "—"}
                        </td>
                        <td className={`${tdCell} pr-4 leading-snug text-[#1F181A]`}>
                          {r.chanson && <p className="text-sm font-semibold text-[#5A3840]">♪ {r.chanson}</p>}
                          {r.message && (
                            <p className="mt-1 text-[15px] font-medium leading-relaxed text-[#1F181A]">
                              « {r.message} »
                            </p>
                          )}
                          {!r.chanson && !r.message && "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {!loading && filtered.length > 0 && (
          <div
            className={`${panel} mt-6 flex flex-col items-center justify-between gap-3 px-5 py-3.5 sm:flex-row`}
            data-testid="dashboard-pagination"
          >
            <p className="text-sm text-[#4A3840]">
              Affichage{" "}
              <span className="font-semibold tabular-nums text-[#4A3539]">
                {rangeFrom}–{rangeTo}
              </span>{" "}
              sur{" "}
              <span className="font-semibold tabular-nums text-[#4A3539]">{filtered.length}</span>
              {pageCount > 1 && (
                <span className="text-[#6B5A60]">
                  {" "}
                  · page {safePage + 1}/{pageCount}
                </span>
              )}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                data-testid="dashboard-prev-page"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={safePage === 0}
                className={`inline-flex items-center gap-1 px-3 py-2 font-cinzel text-[10px] tracking-[0.12em] uppercase text-[#5A3840] disabled:opacity-40 ${surfaceBtn}`}
              >
                <ChevronLeft size={16} /> Préc.
              </button>
              {pageCount <= 7 ? (
                Array.from({ length: pageCount }).map((_, p) => (
                  <button
                    key={p}
                    type="button"
                    data-testid={`dashboard-page-${p}`}
                    onClick={() => setPage(p)}
                    aria-label={`Page ${p + 1}`}
                    aria-current={p === safePage ? "page" : undefined}
                    className={`flex h-8 min-w-[2rem] items-center justify-center rounded-md font-cinzel text-[10px] tabular-nums transition-all ${
                      p === safePage
                        ? "bg-[#935065] text-white"
                        : "bg-[#FDFAF8] text-[#3D2A30] ring-1 ring-[#DDD2D8] hover:ring-[#935065]/28"
                    }`}
                  >
                    {p + 1}
                  </button>
                ))
              ) : (
                <span className="px-2 font-cinzel text-xs font-medium text-[#4A3840]">{safePage + 1} / {pageCount}</span>
              )}
              <button
                type="button"
                data-testid="dashboard-next-page"
                onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                disabled={safePage >= pageCount - 1}
                className={`inline-flex items-center gap-1 px-3 py-2 font-cinzel text-[10px] tracking-[0.12em] uppercase text-[#5A3840] disabled:opacity-40 ${surfaceBtn}`}
              >
                Suiv. <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
