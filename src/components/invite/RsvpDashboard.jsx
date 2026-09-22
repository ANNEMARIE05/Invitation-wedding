import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RefreshCw, Download, MailCheck, Users, UserX, Music } from "lucide-react";
import { toast } from "sonner";
import { getRsvps } from "@/lib/api";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export default function RsvpDashboard() {
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);

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
  const totalPersonnes = presents.reduce((s, r) => s + 1 + (r.accompagnants || 0), 0);
  const chansons = rsvps.filter((r) => r.chanson).length;

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
    { icon: MailCheck, label: "Réponses", value: rsvps.length, testId: "stat-reponses" },
    { icon: Users, label: "Personnes attendues", value: totalPersonnes, testId: "stat-personnes" },
    { icon: UserX, label: "Absences", value: rsvps.length - presents.length, testId: "stat-absences" },
    { icon: Music, label: "Chansons demandées", value: chansons, testId: "stat-chansons" },
  ];

  return (
    <div className="min-h-screen bg-[linear-gradient(160deg,#2A050B_0%,#3B0910_60%,#58111A_100%)] text-[#FAF7F2] px-5 sm:px-10 py-10" data-testid="rsvp-dashboard">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link to="/" data-testid="dashboard-back-link" className="inline-flex items-center gap-2 font-cinzel text-[11px] tracking-[0.25em] uppercase text-[#C48B92] hover:text-[#D4AF37] transition-colors">
              <ArrowLeft size={14} /> Retour à l'invitation
            </Link>
            <h1 className="mt-4 font-display text-4xl sm:text-5xl">Les Réponses</h1>
            <p className="mt-1 font-script text-2xl text-[#D4AF37]">qui vient, qui danse, qui régale</p>
          </div>
          <div className="flex gap-3">
            <button
              data-testid="dashboard-refresh-button"
              onClick={load}
              className="inline-flex items-center gap-2 rounded-full border hairline-gold px-6 py-3 font-cinzel text-[11px] tracking-[0.2em] uppercase hover:bg-white/10 transition-all"
            >
              <RefreshCw size={14} /> Actualiser
            </button>
            <button
              data-testid="dashboard-export-button"
              onClick={exportCsv}
              disabled={rsvps.length === 0}
              className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37] text-[#2A050B] px-6 py-3 font-cinzel text-[11px] tracking-[0.2em] uppercase hover:bg-[#B89428] transition-all disabled:opacity-50"
            >
              <Download size={14} /> Exporter CSV
            </button>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4" data-testid="dashboard-stats">
          {stats.map(({ icon: Icon, label, value, testId }) => (
            <div key={label} className="border hairline-gold bg-white/[0.04] rounded-sm p-6 text-center" data-testid={testId}>
              <Icon size={20} className="mx-auto text-[#D4AF37]" strokeWidth={1.5} />
              <p className="mt-3 font-display text-4xl text-[#D4AF37] tabular-nums">{value}</p>
              <p className="mt-1 font-cinzel text-[10px] tracking-[0.25em] uppercase text-[#C48B92]">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 space-y-4" data-testid="dashboard-list">
          {loading && <p className="text-center font-display italic text-xl text-[#C48B92]">Chargement des réponses…</p>}
          {!loading && rsvps.length === 0 && (
            <p className="text-center font-display italic text-xl text-[#C48B92]" data-testid="dashboard-empty">
              Aucune réponse pour le moment — les premières ne vont pas tarder.
            </p>
          )}
          {rsvps.map((r, i) => (
            <article
              key={r.id || i}
              className="border hairline-gold bg-white/[0.04] rounded-sm p-6 flex flex-col md:flex-row md:items-center gap-4"
              data-testid={`dashboard-rsvp-${i}`}
            >
              <div className="md:w-56 shrink-0">
                <p className="font-display text-2xl">{r.nom}</p>
                <p className="text-xs text-[#C48B92]">{r.email}</p>
                <p className="mt-1 text-[10px] font-cinzel tracking-[0.2em] uppercase text-[#FAF7F2]/50">{formatDate(r.created_at)}</p>
              </div>
              <div className="flex flex-wrap gap-2 md:w-72 shrink-0">
                <span className={`rounded-full px-4 py-1.5 font-cinzel text-[10px] tracking-[0.15em] uppercase ${r.present ? "bg-[#D4AF37] text-[#2A050B]" : "border border-[#C48B92]/50 text-[#C48B92]"}`}>
                  {r.present ? "Présent·e" : "Absent·e"}
                </span>
                {r.present && r.accompagnants > 0 && (
                  <span className="rounded-full border hairline-gold px-4 py-1.5 font-cinzel text-[10px] tracking-[0.15em] uppercase">
                    +{r.accompagnants} accompagnant(s)
                  </span>
                )}
                {r.regime && r.regime !== "Aucun" && (
                  <span className="rounded-full border hairline-gold px-4 py-1.5 font-cinzel text-[10px] tracking-[0.15em] uppercase text-[#D4AF37]">
                    {r.regime}
                  </span>
                )}
              </div>
              <div className="flex-1 text-sm text-[#FAF7F2]/75 space-y-1">
                {r.chanson && <p>♪ {r.chanson}</p>}
                {r.message && <p className="italic">« {r.message} »</p>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
