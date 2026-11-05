import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Copy,
  Link2,
  Trash2,
  Check,
  Users,
  Sparkles,
  CircleCheck,
  Clock3,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import { EASE } from "@/lib/invite-data";
import { buildInviteUrl, shareInviteLinkOnWhatsApp } from "@/lib/invite-link";
import { useSettings } from "@/lib/settings";
import { createInviteLink, deleteInviteLink, getHealth, getInviteLinks } from "@/lib/api";
import { useStoreSync } from "@/lib/useStoreSync";
import CoupleBackofficeLayout from "@/components/invite/CoupleBackofficeLayout";

const PARTY_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function WhatsAppShareButton({ url, partySize, testId, variant = "default", coupleLabel }) {
  const share = () => {
    const ok = shareInviteLinkOnWhatsApp({ url, partySize, coupleLabel });
    if (ok) toast.success("WhatsApp s’ouvre — choisissez le contact et envoyez.");
    else toast.error("Impossible d’ouvrir WhatsApp sur cet appareil.");
  };
  const cls =
    variant === "primary"
      ? "invites-admin-whatsapp invites-admin-whatsapp--primary"
      : "invites-admin-whatsapp";
  return (
    <button type="button" data-testid={testId} onClick={share} className={cls}>
      <MessageCircle size={15} strokeWidth={1.75} aria-hidden />
      Envoyer sur WhatsApp
    </button>
  );
}

function CopyButton({ text, testId, variant = "default" }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      toast.success("Lien copié.");
      window.setTimeout(() => setDone(false), 2000);
    } catch {
      toast.error("Copie impossible — sélectionnez le lien manuellement.");
    }
  };
  const cls =
    variant === "primary"
      ? "invites-admin-copy invites-admin-copy--primary"
      : "invites-admin-copy";
  return (
    <button type="button" data-testid={testId} onClick={copy} className={cls}>
      {done ? <Check size={15} strokeWidth={2} /> : <Copy size={15} strokeWidth={1.75} />}
      {done ? "Copié" : "Copier le lien"}
    </button>
  );
}

function formatDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export default function InvitesAdmin() {
  const { coupleLabel } = useSettings();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [partySize, setPartySize] = useState(2);
  const [creating, setCreating] = useState(false);
  const [lastCreatedUrl, setLastCreatedUrl] = useState("");
  const [ephemeralDb, setEphemeralDb] = useState(false);

  useEffect(() => {
    const isLocalHost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
    if (isLocalHost) return;
    getHealth()
      .then((health) => setEphemeralDb(health.db === "sqlite"))
      .catch(() => {});
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    getInviteLinks()
      .then(setRows)
      .catch(() => toast.error("Impossible de charger les liens."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useStoreSync("invites", load);

  const stats = useMemo(() => {
    const used = rows.filter((r) => r.rsvp_id).length;
    return { total: rows.length, used, available: rows.length - used };
  }, [rows]);

  const create = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const row = await createInviteLink({ party_size: partySize });
      const url = buildInviteUrl(row.token);
      setLastCreatedUrl(url);
      toast.success("Lien prêt à envoyer.");
      await load();
    } catch {
      toast.error("Création impossible — réessayez.");
    } finally {
      setCreating(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Supprimer ce lien non utilisé ?")) return;
    try {
      await deleteInviteLink(id);
      toast.success("Lien supprimé.");
      load();
    } catch {
      toast.error("Suppression impossible (lien déjà utilisé).");
    }
  };

  return (
    <CoupleBackofficeLayout
      panel={{
        testId: "invites-admin",
        eyebrow: "Backoffice",
        title: "Liens d’invitation",
        subtitle: "un lien, un invité",
        intro:
          "Choisissez combien de personnes le lien autorise, générez-le et envoyez-le. Après la première inscription, personne d’autre ne pourra l’utiliser.",
      }}
    >
      <div className="invites-admin mx-auto max-w-3xl">
        {ephemeralDb ? (
          <div
            role="alert"
            className="backoffice-section mb-6 border border-wedding-wine/30 text-center"
            data-testid="invites-ephemeral-db-warning"
          >
            <p className="couple-hub-intro text-sm font-medium text-wedding-wine-deep">
              Base temporaire : les liens peuvent être effacés au redémarrage du serveur. Configurez
              DATABASE_URL (PostgreSQL) sur l’hébergeur de l’API.
            </p>
          </div>
        ) : null}
        {!loading && rows.length > 0 ? (
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="invites-admin-stats grid grid-cols-3 gap-2 sm:gap-3"
            aria-label="Statistiques des liens"
          >
            <li className="invites-admin-stat">
              <span className="invites-admin-stat__value">{stats.total}</span>
              <span className="invites-admin-stat__label">Créés</span>
            </li>
            <li className="invites-admin-stat invites-admin-stat--ok">
              <span className="invites-admin-stat__value">{stats.available}</span>
              <span className="invites-admin-stat__label">Disponibles</span>
            </li>
            <li className="invites-admin-stat invites-admin-stat--used">
              <span className="invites-admin-stat__value">{stats.used}</span>
              <span className="invites-admin-stat__label">Utilisés</span>
            </li>
          </motion.ul>
        ) : null}

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12, ease: EASE }}
          onSubmit={create}
          className="invites-admin-create mt-8 sm:mt-10"
          data-testid="invites-create-form"
        >
          <div className="invites-admin-create__inner backoffice-section">
            <div className="flex items-center justify-center gap-2 text-wedding-wine-deep">
              <Sparkles size={16} strokeWidth={1.5} aria-hidden />
              <h2 className="couple-classic-card__legend mb-0">Nouveau lien</h2>
            </div>

            <p className="couple-hub-intro mt-4 text-center text-sm">
              Nombre de personnes autorisées avec ce lien (invité principal inclus)
            </p>

            <div className="invites-admin-party mt-5" role="group" aria-label="Nombre de personnes">
              <div className="invites-admin-party__display" aria-live="polite">
                <Users size={22} className="text-wedding-wine-accent" strokeWidth={1.35} aria-hidden />
                <span className="invites-admin-party__number">{partySize}</span>
                <span className="invites-admin-party__suffix">
                  personne{partySize > 1 ? "s" : ""}
                </span>
              </div>
              <div className="invites-admin-party__grid mt-4">
                {PARTY_OPTIONS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    data-testid={`invite-party-${n}`}
                    onClick={() => setPartySize(n)}
                    className={`invites-admin-party__chip${partySize === n ? " invites-admin-party__chip--active" : ""}`}
                    aria-pressed={partySize === n}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <select
                id="invite-party"
                data-testid="invite-party-select"
                value={partySize}
                onChange={(e) => setPartySize(Number(e.target.value))}
                className="sr-only"
                aria-hidden
                tabIndex={-1}
              >
                {PARTY_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={creating}
              data-testid="invite-create-submit"
              className="btn-couple-classic invites-admin-submit mt-7 w-full sm:mt-8"
            >
              <Link2 size={17} strokeWidth={1.75} aria-hidden />
              {creating ? "Génération…" : "Générer le lien"}
            </button>

            {lastCreatedUrl ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="invites-admin-fresh mt-6 overflow-hidden"
                data-testid="invite-last-created"
              >
                <p className="couple-classic-card__legend mb-0 block text-center">Lien à envoyer</p>
                <p className="invites-admin-fresh__url mt-2">{lastCreatedUrl}</p>
                <div className="invites-admin-fresh__actions">
                  <CopyButton text={lastCreatedUrl} testId="invite-copy-last" variant="primary" />
                  <WhatsAppShareButton
                    url={lastCreatedUrl}
                    partySize={partySize}
                    coupleLabel={coupleLabel}
                    testId="invite-whatsapp-last"
                    variant="primary"
                  />
                </div>
              </motion.div>
            ) : null}
          </div>
        </motion.form>

        <section className="mt-10 sm:mt-12">
          <h2 className="couple-classic-card__legend text-center">Vos liens</h2>

          {loading ? <p className="couple-hub-intro mt-6 text-center text-sm">Chargement…</p> : null}

          {!loading && rows.length === 0 ? (
            <div className="invites-admin-empty backoffice-section mt-6 text-center">
              <Link2 size={28} strokeWidth={1.25} className="mx-auto text-wedding-wine-accent/70" aria-hidden />
              <p className="couple-classic-card__title mt-3 font-display text-lg italic">Aucun lien pour l’instant</p>
              <p className="couple-hub-intro mt-1 text-sm">Générez votre premier lien ci-dessus.</p>
            </div>
          ) : null}

          <ul className="mt-5 space-y-3 sm:space-y-4">
            {rows.map((row, i) => {
              const url = buildInviteUrl(row.token);
              const used = Boolean(row.rsvp_id);
              return (
                <motion.li
                  key={row.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.05 * Math.min(i, 8), ease: EASE }}
                  className={`invites-admin-row backoffice-section${used ? " invites-admin-row--used" : ""}`}
                  data-testid={`invite-row-${row.id}`}
                >
                  <div className="invites-admin-row__head">
                    <span className="invites-admin-row__party">
                      <Users size={14} aria-hidden />
                      {row.party_size} pers.
                    </span>
                    <span
                      className={`invites-admin-row__status${used ? " invites-admin-row__status--used" : ""}`}
                    >
                      {used ? (
                        <>
                          <CircleCheck size={13} aria-hidden /> Utilisé
                        </>
                      ) : (
                        <>
                          <Clock3 size={13} aria-hidden /> Disponible
                        </>
                      )}
                    </span>
                  </div>
                  <p className="invites-admin-row__url">{url}</p>
                  <p className="invites-admin-row__meta">Créé le {formatDate(row.created_at)}</p>
                  <div className="invites-admin-row__actions">
                    <CopyButton text={url} testId={`invite-copy-${row.id}`} />
                    <WhatsAppShareButton
                      url={url}
                      partySize={row.party_size}
                      coupleLabel={coupleLabel}
                      testId={`invite-whatsapp-${row.id}`}
                    />
                    {!used ? (
                      <button
                        type="button"
                        data-testid={`invite-delete-${row.id}`}
                        onClick={() => remove(row.id)}
                        className="invites-admin-delete"
                      >
                        <Trash2 size={14} aria-hidden />
                        Supprimer
                      </button>
                    ) : null}
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </section>
      </div>
    </CoupleBackofficeLayout>
  );
}
