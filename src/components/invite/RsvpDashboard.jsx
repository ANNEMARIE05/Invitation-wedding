import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RefreshCw, Download, MailCheck, Users, UserX, UserPlus, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import { getRsvps } from "@/lib/api";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export default function RsvpDashboard() {
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  const load = async () => {
    setLoading(true);
    try {
      setRsvps(await getRsvps());
    } catch {
      toast.error("Impossible de charger les réponses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const presents = rsvps.filter((r) => r.present);
  const absents = rsvps.filter((r) => !r.present);
  const accompagnants = presents.reduce((s, r) => s + (r.accompagnants || 0), 0);
  const totalPersonnes = presents.length + accompagnants;
  const regimes = {};
  presents.forEach((r) => {
    if (r.regime && r.regime !== "Aucun") {
      const key = r.regime.replace(" (préciser en message)", "");
      regimes[key] = (regimes[key] || 0) + 1 + (r.accompagnants || 0);
    }
  });
  const regimeEntries = Object.entries(regimes);

  const pageSize = 8;
  const pageCount = Math.ceil(rsvps.length / pageSize);
  const safePage = Math.min(page, Math.max(0, pageCount - 1));
  const pageRsvps = rsvps.slice(safePage * pageSize, (safePage + 1) * pageSize);

  const exportCsv = () => {
    const rows = [
      ["Nom", "Email", "Présent", "Accompagnants", "Régime", "Chanson", "Message", "Date"],
      ...rsvps.map((r) => [
        r.nom, r.email, r.present ? "Oui" : "Non", r.accompagnants, r.regime, r.chanson,
        (r.message || "").replace(/[\r\n;]+/g, " "), formatDate(r.created_at),
      ]),
    ];
    const csv = "﻿" + rows.map((row) => row.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(";")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "reponses-mariage.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Liste des réponses téléchargée (CSV, compatible Excel).");
  };

  const stats = [
    { icon: Users, label: "Présents", value: presents.length, testId: "stat-presents" },
    { icon: UserX, label: "Absents", value: absents.length, testId: "stat-absents" },
    { icon: UserPlus, label: "Accompagnants", value: accompagnants, testId: "stat-accompagnants" },
    { icon: MailCheck, label: "Total attendu", value: totalPersonnes, testId: "stat-total" },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1617] px-4 sm:px-10 py-6 sm:py-10" data-testid="rsvp-dashboard">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link to="/" data-testid="dashboard-back-link" className="inline-flex items-center gap-2 font-cinzel text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-[#C48B92] hover:text-[#6B1724] transition-colors">
              <ArrowLeft size={13} /> Retour à l'invitation
            </Link>
            <h1 className="mt-3 font-display text-3xl sm:text-5xl text-[#4A0E17]">Bilan des réponses</h1>
            <p className="mt-0.5 font-script text-xl sm:text-2xl text-[#C48B92]">qui sera des nôtres</p>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <button
              data-testid="dashboard-refresh-button"
              onClick={load}
              className="inline-flex items-center gap-2 rounded-full border hairline px-4 py-2.5 sm:px-6 sm:py-3 font-cinzel text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-[#4A0E17] hover:border-[#D4AF37] transition-all"
            >
              <RefreshCw size={13} /> Actualiser
            </button>
            <button
              data-testid="dashboard-export-button"
              onClick={exportCsv}
              disabled={rsvps.length === 0}
              className="inline-flex items-center gap-2 rounded-full bg-[#4A0E17] text-[#FAF7F2] px-4 py-2.5 sm:px-6 sm:py-3 font-cinzel text-[10px] sm:text-[11px] tracking-[0.2em] uppercase hover:bg-[#6B1724] transition-all disabled:opacity-50"
            >
              <Download size={13} /> Exporter
            </button>
          </div>
        </div>

        <div className="mt-6 sm:mt-10 grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4" data-testid="dashboard-stats">
          {stats.map(({ icon: Icon, label, value, testId }) => (
            <div key={label} className="bg-white border hairline rounded-xl sm:rounded-sm p-3.5 sm:p-6 text-center shadow-[0_10px_30px_rgba(74,14,23,0.06)]" data-testid={testId}>
              <Icon size={16} className="mx-auto text-[#D4AF37] sm:hidden" strokeWidth={1.5} />
              <Icon size={20} className="mx-auto text-[#D4AF37] hidden sm:block" strokeWidth={1.5} />
              <p className="mt-1.5 sm:mt-3 font-display text-2xl sm:text-4xl text-[#4A0E17] tabular-nums">{value}</p>
              <p className="mt-0.5 sm:mt-1 font-cinzel text-[8px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.25em] uppercase text-[#8C7B7E]">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-3 sm:mt-6 bg-white border hairline rounded-xl sm:rounded-sm px-4 py-3.5 sm:px-6 sm:py-5 flex items-center gap-3 sm:gap-4" data-testid="dashboard-regimes">
          <UtensilsCrossed size={18} className="text-[#D4AF37] shrink-0" strokeWidth={1.5} />
          {regimeEntries.length === 0 ? (
            <p className="text-xs sm:text-sm text-[#8C7B7E]">Aucun régime particulier signalé pour le moment.</p>
          ) : (
            <p className="text-xs sm:text-sm text-[#5C4F51]">
              <span className="font-cinzel text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-[#8C7B7E] mr-2 sm:mr-3">Repas :</span>
              {regimeEntries.map(([k, v]) => `${v} ${k.toLowerCase()}`).join(" · ")}
            </p>
          )}
        </div>

        <div className="mt-3 sm:mt-6 bg-white border hairline rounded-xl sm:rounded-sm overflow-hidden" data-testid="dashboard-table">
          {loading && <p className="p-6 sm:p-8 text-center font-display italic text-lg sm:text-xl text-[#8C7B7E]">Chargement des réponses…</p>}
          {!loading && rsvps.length === 0 && (
            <p className="p-6 sm:p-8 text-center font-display italic text-lg sm:text-xl text-[#8C7B7E]" data-testid="dashboard-empty">
              Aucune réponse pour le moment — les premières ne vont pas tarder.
            </p>
          )}
          {!loading && rsvps.length > 0 && (
            <>
              {/* fiches compactes — mobile */}
              <div className="sm:hidden divide-y divide-[#D4AF37]/15">
                {pageRsvps.map((r, i) => (
                  <div key={r.id || i} className="px-4 py-3.5" data-testid={`dashboard-rsvp-${i}`}>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-[#1C1617] truncate">{r.nom}</p>
                      <span className={`shrink-0 rounded-full px-3 py-0.5 font-cinzel text-[9px] tracking-[0.15em] uppercase ${r.present ? "bg-[#4A0E17] text-[#D4AF37]" : "border border-[#C48B92]/50 text-[#C48B92]"}`}>
                        {r.present ? "Oui" : "Non"}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-[#8C7B7E] truncate">{r.email} · {formatDate(r.created_at)}</p>
                    <p className="mt-1 text-[11px] text-[#5C4F51]">
                      {[
                        r.present && r.accompagnants > 0 ? `+${r.accompagnants} accomp.` : "",
                        r.regime && r.regime !== "Aucun" ? r.regime.replace(" (préciser en message)", "") : "",
                      ].filter(Boolean).join(" · ") || "Sans précision"}
                    </p>
                    {(r.chanson || r.message) && (
                      <p className="mt-1 text-[11px] italic text-[#8C7B7E] line-clamp-2">
                        {r.chanson ? `♪ ${r.chanson}` : ""}{r.chanson && r.message ? " — " : ""}{r.message ? `« ${r.message} »` : ""}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* tableau — tablette & ordinateur */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[640px]">
                  <thead>
                    <tr className="border-b hairline font-cinzel text-[10px] tracking-[0.25em] uppercase text-[#8C7B7E]">
                      <th className="px-5 py-4">Invité</th>
                      <th className="px-4 py-4">Présence</th>
                      <th className="px-4 py-4">Accomp.</th>
                      <th className="px-4 py-4">Régime</th>
                      <th className="px-5 py-4">Chanson & message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageRsvps.map((r, i) => (
                      <tr key={r.id || i} className="border-b hairline last:border-0 align-top" data-testid={`dashboard-rsvp-row-${i}`}>
                        <td className="px-5 py-4">
                          <p className="font-medium text-[#1C1617]">{r.nom}</p>
                          <p className="text-xs text-[#8C7B7E]">{r.email}</p>
                          <p className="mt-0.5 text-[10px] font-cinzel tracking-[0.15em] uppercase text-[#8C7B7E]/70">{formatDate(r.created_at)}</p>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-block rounded-full px-3.5 py-1 font-cinzel text-[10px] tracking-[0.15em] uppercase ${r.present ? "bg-[#4A0E17] text-[#D4AF37]" : "border border-[#C48B92]/50 text-[#C48B92]"}`}>
                            {r.present ? "Oui" : "Non"}
                          </span>
                        </td>
                        <td className="px-4 py-4 tabular-nums">{r.present && r.accompagnants > 0 ? `+${r.accompagnants}` : "—"}</td>
                        <td className="px-4 py-4">{r.regime && r.regime !== "Aucun" ? r.regime.replace(" (préciser en message)", "") : "—"}</td>
                        <td className="px-5 py-4 text-[#5C4F51]">
                          {r.chanson && <p>♪ {r.chanson}</p>}
                          {r.message && <p className="italic">« {r.message} »</p>}
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

        {pageCount > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2" data-testid="dashboard-pagination">
            <button
              data-testid="dashboard-prev-page"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={safePage === 0}
              className="rounded-full border hairline px-4 py-2 font-cinzel text-[10px] tracking-[0.2em] uppercase text-[#4A0E17] disabled:opacity-40 hover:border-[#D4AF37] transition-all"
            >
              ← Préc.
            </button>
            {Array.from({ length: pageCount }).map((_, p) => (
              <button
                key={p}
                data-testid={`dashboard-page-${p}`}
                onClick={() => setPage(p)}
                aria-label={`Page ${p + 1}`}
                className={`w-8 h-8 rounded-full font-cinzel text-[10px] transition-all ${p === safePage ? "bg-[#4A0E17] text-[#D4AF37]" : "border hairline text-[#8C7B7E] hover:border-[#D4AF37]"}`}
              >
                {p + 1}
              </button>
            ))}
            <button
              data-testid="dashboard-next-page"
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              disabled={safePage === pageCount - 1}
              className="rounded-full border hairline px-4 py-2 font-cinzel text-[10px] tracking-[0.2em] uppercase text-[#4A0E17] disabled:opacity-40 hover:border-[#D4AF37] transition-all"
            >
              Suiv. →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
