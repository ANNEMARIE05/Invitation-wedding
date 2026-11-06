import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Download,
  MailCheck,
  Users,
  UserX,
  UtensilsCrossed,
  Search,
  ChevronLeft,
  ChevronRight,
  Music2,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import { getRsvps } from "@/lib/api";
import { useStoreSync } from "@/lib/useStoreSync";
import CoupleBackofficeLayout from "@/components/invite/CoupleBackofficeLayout";
import { WeddingLoader } from "@/components/invite/WeddingLoader";

const PAGE_SIZE = 8;

const formatDate = (iso) => {
  const d = new Date(iso);
  const date = d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${date} · ${time}`;
};

const norm = (s) =>
  String(s ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

const cleanRegime = (regime) =>
  regime && regime !== "Aucun" ? regime.replace(" (préciser en message)", "") : "";

function PresenceBadge({ present }) {
  return (
    <span
      className={`backoffice-rsvp-badge ${present ? "backoffice-rsvp-badge--yes" : "backoffice-rsvp-badge--no"}`}
    >
      {present ? "Présent" : "Absent"}
    </span>
  );
}

function ModeBadge({ r }) {
  if (!r.present) return null;
  const zoom = r.mode === "zoom";
  return (
    <span className={`backoffice-rsvp-badge ${zoom ? "backoffice-rsvp-badge--zoom" : "backoffice-rsvp-badge--live"}`}>
      {zoom ? "Zoom" : "Sur place"}
    </span>
  );
}

function RsvpListItem({ r, index }) {
  const regime = cleanRegime(r.regime);
  const accomp =
    r.present && r.mode !== "zoom" && (r.accompagnants || 0) > 0 ? r.accompagnants : 0;
  const contact = r.telephone || r.email;

  return (
    <li className="backoffice-rsvp-row" data-testid={`dashboard-rsvp-${index}`}>
      <div className="backoffice-rsvp-row__head">
        <p className="backoffice-rsvp-row__name">{r.nom}</p>
        <div className="backoffice-rsvp-row__badges">
          <PresenceBadge present={r.present} />
          <ModeBadge r={r} />
        </div>
      </div>

      {(contact || r.created_at) && (
        <div className="backoffice-rsvp-row__meta">
          {contact ? (
            <p className="backoffice-rsvp-row__contact tabular-nums">{contact}</p>
          ) : null}
          <time className="backoffice-rsvp-row__date tabular-nums" dateTime={r.created_at}>
            {formatDate(r.created_at)}
          </time>
        </div>
      )}

      {(accomp > 0 || regime) && (
        <ul className="backoffice-rsvp-row__facts">
          {accomp > 0 ? (
            <li>
              <span className="backoffice-rsvp-row__fact-label">Accompagnants</span>
              <span className="backoffice-rsvp-row__fact-value">+{accomp}</span>
            </li>
          ) : null}
          {regime ? (
            <li>
              <span className="backoffice-rsvp-row__fact-label">Régime</span>
              <span className="backoffice-rsvp-row__fact-value">{regime}</span>
            </li>
          ) : null}
        </ul>
      )}

      {r.chanson ? (
        <p className="backoffice-rsvp-row__extra">
          <Music2 size={14} className="shrink-0 opacity-70" aria-hidden />
          {r.chanson}
        </p>
      ) : null}
      {r.message ? (
        <p className="backoffice-rsvp-row__message">
          <MessageCircle size={14} className="mt-0.5 shrink-0 opacity-60" aria-hidden />
          {r.message}
        </p>
      ) : null}
    </li>
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

  const regimeSummary = useMemo(() => {
    const regimes = {};
    presentiel.forEach((r) => {
      const key = cleanRegime(r.regime);
      if (!key) return;
      regimes[key] = (regimes[key] || 0) + 1 + (r.accompagnants || 0);
    });
    return Object.entries(regimes);
  }, [presentiel]);

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
    {
      icon: Users,
      label: "Sur place",
      value: totalPersonnes,
      detail: `${presentiel.length} fiche${presentiel.length > 1 ? "s" : ""} · ${accompagnants} accomp.`,
      testId: "stat-total",
    },
    {
      icon: MailCheck,
      label: "Zoom",
      value: zoomJoins.length,
      testId: "stat-zoom",
    },
    {
      icon: UserX,
      label: "Absents",
      value: absents.length,
      testId: "stat-absents",
    },
    {
      icon: Users,
      label: "Réponses",
      value: rsvps.length,
      testId: "stat-presents",
    },
  ];

  return (
    <CoupleBackofficeLayout
      panel={{
        testId: "rsvp-dashboard",
        wide: true,
        eyebrow: "Backoffice",
        title: "Bilan des réponses",
        subtitle: "Qui sera des nôtres",
      }}
    >
      <div className="backoffice-rsvp w-full">
        <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-2 lg:grid-cols-4" data-testid="dashboard-stats">
          {stats.map(({ icon: Icon, label, value, detail, testId }) => (
            <div key={label} className="backoffice-rsvp-stat" data-testid={testId}>
              <Icon size={17} className="text-wedding-wine-accent" strokeWidth={1.6} aria-hidden />
              <p className="backoffice-rsvp-stat__value">{value}</p>
              <p className="backoffice-rsvp-stat__label">{label}</p>
              {detail ? <p className="backoffice-rsvp-stat__detail">{detail}</p> : null}
            </div>
          ))}
        </div>

        {regimeSummary.length > 0 ? (
          <p className="backoffice-rsvp-regimes mt-4" data-testid="dashboard-regimes">
            <UtensilsCrossed size={15} className="shrink-0" strokeWidth={1.6} aria-hidden />
            <span>
              {regimeSummary.map(([k, v]) => `${v} ${k.toLowerCase()}`).join(" · ")}
            </span>
          </p>
        ) : null}

        <div className="backoffice-section mt-6" data-testid="dashboard-filters">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-5">
            <label className="min-w-0 flex-1">
              <span className="backoffice-label">Rechercher</span>
              <div className="relative mt-1.5">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-wedding-wine-deep/40"
                  strokeWidth={1.5}
                  aria-hidden
                />
                <input
                  type="search"
                  data-testid="dashboard-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Nom, téléphone, message…"
                  className="backoffice-field w-full py-2.5 pl-10"
                />
              </div>
            </label>
            <label className="w-full sm:w-auto sm:min-w-[9.5rem]">
              <span className="backoffice-label">Présence</span>
              <select
                data-testid="dashboard-filter-presence"
                value={presenceFilter}
                onChange={(e) => {
                  const v = e.target.value;
                  setPresenceFilter(v);
                  if (v === "no") setModeFilter("all");
                }}
                className="backoffice-field mt-1.5 w-full cursor-pointer py-2.5"
              >
                <option value="all">Tous</option>
                <option value="yes">Présents</option>
                <option value="no">Absents</option>
              </select>
            </label>
            <label className="w-full sm:w-auto sm:min-w-[9.5rem]">
              <span className="backoffice-label">Mode</span>
              <select
                data-testid="dashboard-filter-mode"
                value={modeFilter}
                onChange={(e) => setModeFilter(e.target.value)}
                disabled={presenceFilter === "no"}
                className="backoffice-field mt-1.5 w-full cursor-pointer py-2.5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="all">Tous</option>
                <option value="presentiel">Sur place</option>
                <option value="zoom">Zoom</option>
              </select>
            </label>
            <button
              type="button"
              data-testid="dashboard-export-button"
              onClick={exportCsv}
              disabled={filtered.length === 0}
              className="backoffice-btn-primary w-full shrink-0 lg:w-auto lg:min-w-[10.5rem]"
            >
              <Download size={15} strokeWidth={1.5} aria-hidden />
              Exporter CSV
            </button>
          </div>
        </div>

        <section className="mt-6" aria-labelledby="rsvp-list-heading">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
            <h2 id="rsvp-list-heading" className="couple-classic-card__legend mb-0">
              Liste des invités
            </h2>
            <p className="backoffice-hint tabular-nums">
              {loading ? "…" : (
                <>
                  <span className="font-semibold text-wedding-wine-deep">{filtered.length}</span>
                  {" / "}
                  {rsvps.length} réponse{rsvps.length !== 1 ? "s" : ""}
                </>
              )}
            </p>
          </div>

          <div className="backoffice-rsvp-list" data-testid="dashboard-table">
            {loading && <WeddingLoader compact label="Chargement des réponses…" />}
            {!loading && rsvps.length === 0 && (
              <p className="backoffice-rsvp-list__empty font-display italic" data-testid="dashboard-empty">
                Aucune réponse pour le moment.
              </p>
            )}
            {!loading && rsvps.length > 0 && filtered.length === 0 && (
              <p className="backoffice-rsvp-list__empty" data-testid="dashboard-no-match">
                Aucun résultat — élargissez la recherche ou les filtres.
              </p>
            )}
            {!loading && filtered.length > 0 && (
              <ul className="space-y-3">
                {pageRsvps.map((r, i) => (
                  <RsvpListItem key={r.id ?? `${r.nom}-${r.created_at}-${i}`} r={r} index={i} />
                ))}
              </ul>
            )}
          </div>

          {!loading && filtered.length > PAGE_SIZE && (
            <nav
              className="mt-5 flex flex-wrap items-center justify-between gap-3"
              aria-label="Pagination"
              data-testid="dashboard-pagination"
            >
              <p className="backoffice-hint tabular-nums">
                Page {safePage + 1} / {pageCount}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  data-testid="dashboard-prev-page"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={safePage === 0}
                  className="backoffice-rsvp-page-btn"
                >
                  <ChevronLeft size={16} aria-hidden />
                  Précédent
                </button>
                <button
                  type="button"
                  data-testid="dashboard-next-page"
                  onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                  disabled={safePage >= pageCount - 1}
                  className="backoffice-rsvp-page-btn"
                >
                  Suivant
                  <ChevronRight size={16} aria-hidden />
                </button>
              </div>
            </nav>
          )}
        </section>
      </div>
    </CoupleBackofficeLayout>
  );
}
