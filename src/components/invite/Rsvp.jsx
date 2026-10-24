import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Check, MessageCircle, Sparkles, Search } from "lucide-react";
import { toast } from "sonner";
import { ApiError, createRsvp, findRsvpByPhone } from "@/lib/api";
import { EASE, WHATSAPP_NUMBER } from "@/lib/invite-data";
import { useI18n } from "@/lib/locale";
import { useSettings } from "@/lib/settings";
import Chapter from "./Chapter";
import InviteCardModal from "./InviteCardModal";

const partySize = (d) => (d.present ? 1 + Number(d.accompagnants || 0) : 0);

const initial = {
  nom: "",
  telephone: "",
  present: true,
  mode: "presentiel",
  accompagnants: 0,
  regimeIdx: 0,
  chanson: "",
  message: "",
};

function regimeIdxFromLabel(regimes, label) {
  const i = regimes.indexOf(label);
  return i >= 0 ? i : 0;
}

function rsvpToForm(rsvp, regimes) {
  return {
    nom: rsvp.nom || "",
    telephone: rsvp.telephone || "",
    present: Boolean(rsvp.present),
    mode: rsvp.mode || "presentiel",
    accompagnants: Number(rsvp.accompagnants) || 0,
    regimeIdx: regimeIdxFromLabel(regimes, rsvp.regime),
    chanson: rsvp.chanson || "",
    message: rsvp.message || "",
  };
}

function RsvpField({ label, htmlFor, hint, children, className = "" }) {
  return (
    <div className={`rsvp-reply-field min-w-0 ${className}`.trim()}>
      <label className="rsvp-reply-label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {hint ? <p className="rsvp-reply-hint">{hint}</p> : null}
    </div>
  );
}

function RsvpSection({ title, children }) {
  return (
    <div className="rsvp-reply-section">
      <h3 className="rsvp-reply-section-title">{title}</h3>
      {children}
    </div>
  );
}

function RsvpRadio({ active, onClick, testId, children }) {
  return (
    <button
      type="button"
      data-testid={testId}
      onClick={onClick}
      className={`rsvp-radio${active ? " rsvp-radio--active" : ""}`}
      aria-pressed={active}
    >
      <span className="rsvp-radio-mark" aria-hidden />
      <span className="rsvp-radio-text">{children}</span>
    </button>
  );
}

const ReplyCard = ({ children, className = "" }) => (
  <div className={`rsvp-reply-card ${className}`.trim()}>
    <div className="rsvp-reply-card__frame rsvp-reply-card__frame--gold" aria-hidden />
    <div className="rsvp-reply-card__frame rsvp-reply-card__frame--rose" aria-hidden />
    <div className="rsvp-reply-card__body">{children}</div>
  </div>
);

function RsvpPhoneLookup({ m, lookupPhone, setLookupPhone, lookup, lookupBusy }) {
  return (
    <footer className="rsvp-recall">
      <p className="rsvp-recall-title">{m.rsvp.lookupTitle}</p>
      <p className="rsvp-recall-hint">{m.rsvp.lookupHint}</p>
      <form onSubmit={lookup} className="rsvp-recall-form">
        <input
          type="tel"
          inputMode="tel"
          value={lookupPhone}
          onChange={(e) => setLookupPhone(e.target.value)}
          placeholder={m.rsvp.phonePh}
          className="rsvp-line rsvp-line--compact"
          data-testid="rsvp-lookup-phone"
        />
        <button
          type="submit"
          disabled={lookupBusy || !lookupPhone.trim()}
          className="rsvp-recall-btn"
          data-testid="rsvp-lookup-submit"
        >
          <Search size={14} aria-hidden />
          {lookupBusy ? m.rsvp.lookupBusy : m.rsvp.lookupAction}
        </button>
      </form>
    </footer>
  );
}

export default function Rsvp() {
  const { deadlineLabel, zoom } = useSettings();
  const { m } = useI18n();
  const [form, setForm] = useState(initial);
  const [sent, setSent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lookupPhone, setLookupPhone] = useState("");
  const [lookupBusy, setLookupBusy] = useState(false);
  const [editLocked, setEditLocked] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [autoShareCard, setAutoShareCard] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target ? e.target.value : e });
  const firstName = (name) => String(name || "").trim().split(/\s+/)[0] || "";

  const buildWaMessage = (d) => {
    const modeLabel = d.mode === "zoom" ? m.rsvp.onZoom : m.rsvp.inPerson;
    return [
      m.rsvp.waHeader,
      `${m.rsvp.waName} : ${d.nom}`,
      `${m.rsvp.waPhone} : ${d.telephone}`,
      `${m.rsvp.waPresent} : ${d.present ? m.rsvp.waYes : m.rsvp.waNo}`,
      d.present ? `${m.rsvp.waMode} : ${modeLabel}` : "",
      d.present && d.mode === "presentiel" ? `${m.rsvp.waCount} : ${partySize(d)}` : "",
      d.present && d.mode === "presentiel" ? `${m.rsvp.waDiet} : ${d.regime}` : "",
      d.present && d.chanson ? `${m.rsvp.waSong} : ${d.chanson}` : "",
      d.message ? `${m.rsvp.waMessage} : ${d.message}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  };

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("wedding_guest_rsvp") || "null");
      if (saved?.telephone) {
        setLookupPhone(String(saved.telephone));
      }
    } catch {}
  }, []);

  const lookup = async (e) => {
    e?.preventDefault?.();
    const phone = lookupPhone.trim() || form.telephone.trim();
    if (!phone) return;
    setLookupBusy(true);
    try {
      let rsvpData = null;
      let isLocked = false;
      try {
        const result = await findRsvpByPhone(phone);
        if (result?.rsvp) {
          rsvpData = result.rsvp;
          isLocked = Boolean(result.edit_locked);
        }
      } catch {
        // Fallback si l'API est temporairement inaccessible
      }

      // Si pas encore trouvé via API, vérifier le localStorage local
      if (!rsvpData) {
        try {
          const cached = JSON.parse(localStorage.getItem("wedding_guest_rsvp") || "null");
          if (cached && (cached.telephone === phone || String(cached.telephone || "").replace(/\D/g, "").includes(String(phone).replace(/\D/g, "")))) {
            rsvpData = cached;
          }
        } catch {}
      }

      if (!rsvpData) {
        setForm({ ...initial, telephone: phone });
        setIsUpdate(false);
        setEditLocked(false);
        toast.message(m.rsvp.lookupNotFound);
        return;
      }

      setEditLocked(isLocked);
      setForm(rsvpToForm(rsvpData, m.rsvp.regimes));
      setSent(rsvpData);
      setIsUpdate(true);
      try {
        localStorage.setItem("wedding_guest_rsvp", JSON.stringify(rsvpData));
      } catch {}

      toast.success(m.rsvp.lookupFound(firstName(rsvpData.nom)));

      // Carte retrouvée → l'afficher directement (invités présents sur place uniquement)
      setAutoShareCard(false);
      setCardModalOpen(
        Boolean(rsvpData.present && (rsvpData.mode || "presentiel") === "presentiel")
      );
    } catch {
      toast.error(m.rsvp.toastErr);
    } finally {
      setLookupBusy(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (editLocked && isUpdate) {
      toast.error(m.rsvp.toastLocked);
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        regime: m.rsvp.regimes[Number(form.regimeIdx) || 0],
        accompagnants: Number(form.accompagnants),
        chanson: form.present ? form.chanson : "",
      };
      delete payload.regimeIdx;
      const data = await createRsvp(payload, { update: isUpdate });
      setSent(data);
      setIsUpdate(true);
      setEditLocked(false);
      setAutoShareCard(false);
      setCardModalOpen(Boolean(data?.present && (data.mode || "presentiel") === "presentiel"));
      try {
        localStorage.setItem("wedding_guest_rsvp", JSON.stringify(data));
      } catch {}
      toast.success(data?.present ? m.rsvp.toastPresent : m.rsvp.toastAbsent);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.code === "rsvp_locked") {
          setEditLocked(true);
          toast.error(m.rsvp.toastLocked);
          return;
        }
        if (err.code === "rsvp_exists" && err.payload?.existing) {
          setForm(rsvpToForm(err.payload.existing, m.rsvp.regimes));
          setIsUpdate(true);
          toast.message(m.rsvp.toastExists);
          return;
        }
      }
      toast.error(m.rsvp.toastErr);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoShareDone = useCallback(() => setAutoShareCard(false), []);

  const startEdit = () => {
    if (editLocked) {
      toast.error(m.rsvp.toastLocked);
      return;
    }
    if (sent) {
      setForm(rsvpToForm(sent, m.rsvp.regimes));
      setIsUpdate(true);
      setSent(null);
    }
  };

  const confirmed = sent;

  return (
    <section
      id="rsvp"
      className="relative bg-[linear-gradient(135deg,#5C0A20_0%,#9B1B4A_50%,#7A1538_100%)] px-5 py-16 sm:px-8 md:py-24 lg:px-16"
      data-testid="rsvp-section"
    >
      <div className={`relative z-10 mx-auto ${confirmed ? "max-w-4xl" : "max-w-xl lg:max-w-2xl"}`}>
        <Chapter index="VI" eyebrow={m.rsvp.chapter} title={m.rsvp.title} script={deadlineLabel} dark />
        <AnimatePresence mode="wait">
          {confirmed ? (
            <motion.div
              key="done"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, ease: EASE }}
              data-testid="rsvp-confirmation"
            >
              <ReplyCard className="rsvp-reply-card--confirmed">
                <div className="rsvp-confirmation-layout">
                  <div className="rsvp-confirmation-copy">
                    <span className="rsvp-confirmation-mark">
                      <Check size={22} className="text-wedding-gold-accent" />
                    </span>
                    <h3 className="mt-4 font-display text-2xl font-medium text-wedding-ink sm:text-3xl">
                      {m.rsvp.thanks(firstName(confirmed.nom))}
                    </h3>
                    <p className="type-prose mx-auto mt-2 max-w-md text-sm md:mx-0">
                      {confirmed.present && confirmed.mode === "zoom"
                        ? m.rsvp.zoomThanks(firstName(confirmed.nom))
                        : confirmed.present
                          ? m.rsvp.cardThanks(confirmed.nom, partySize(confirmed))
                          : m.rsvp.absentThanks}
                    </p>

                    {!editLocked ? (
                      <button
                        type="button"
                        onClick={startEdit}
                        className="mt-5 text-sm text-wedding-wine-deep underline decoration-wedding-gold-accent/50 underline-offset-4 hover:decoration-wedding-gold-accent"
                      >
                        {m.rsvp.editMyRsvp}
                      </button>
                    ) : (
                      <p className="mx-auto mt-5 max-w-md text-xs text-wedding-wine-accent md:mx-0">
                        {m.rsvp.lookupLocked}
                      </p>
                    )}
                  </div>

                  <div className="rsvp-confirmation-actions">
                    {confirmed.present && confirmed.mode === "presentiel" ? (
                      <>
                        <div className="flex flex-wrap items-center justify-center gap-3">
                          <button
                            type="button"
                            data-testid="rsvp-view-card-button"
                            onClick={() => {
                              setAutoShareCard(false);
                              setCardModalOpen(true);
                            }}
                            className="btn-invite-pill btn-invite-pill--card"
                          >
                            <Sparkles size={15} className="text-wedding-rose" />
                            {m.inviteSection.viewCard}
                          </button>
                          <button
                            type="button"
                            data-testid="rsvp-whatsapp-card-button"
                            onClick={() => {
                              setAutoShareCard(true);
                              setCardModalOpen(true);
                            }}
                            className="btn-invite-pill btn-invite-pill--whatsapp"
                          >
                            <MessageCircle size={15} className="text-[#25D366]" />
                            {m.inviteSection.shareWhatsApp}
                          </button>
                        </div>
                        <InviteCardModal
                          open={cardModalOpen}
                          onOpenChange={setCardModalOpen}
                          guest={confirmed}
                          autoShareWhenOpen={autoShareCard}
                          onAutoShareDone={handleAutoShareDone}
                        />
                      </>
                    ) : confirmed.present ? (
                      <p className="type-prose mx-auto max-w-md text-sm md:mx-0">
                        {m.rsvp.zoomCode(zoom.code, zoom.passcode)}
                        {zoom.joinUrl ? (
                          <>
                            {" "}
                            <a
                              href={zoom.joinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="gold-underline text-wedding-wine-deep"
                            >
                              {m.rsvp.joinMeeting}
                            </a>
                          </>
                        ) : null}
                      </p>
                    ) : (
                      <a
                        data-testid="rsvp-whatsapp-button"
                        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWaMessage(confirmed))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-invite-pill btn-invite-pill--wine-fill mx-auto mt-6"
                      >
                        <MessageCircle size={15} className="text-wedding-gold-accent" /> {m.rsvp.whatsapp}
                      </a>
                    )}
                  </div>
                </div>
                <RsvpPhoneLookup
                  m={m}
                  lookupPhone={lookupPhone}
                  setLookupPhone={setLookupPhone}
                  lookup={lookup}
                  lookupBusy={lookupBusy}
                />
              </ReplyCard>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -40px 0px" }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <ReplyCard>
                <form onSubmit={submit} className="rsvp-reply-form" data-testid="rsvp-form">
                  <RsvpSection title={m.rsvp.sectionIdentity}>
                    <RsvpField label={m.rsvp.name} htmlFor="rsvp-nom">
                      <input
                        id="rsvp-nom"
                        required
                        data-testid="rsvp-input-nom"
                        placeholder={m.rsvp.namePh}
                        value={form.nom}
                        onChange={set("nom")}
                        className="rsvp-line"
                        autoComplete="name"
                      />
                    </RsvpField>
                    <RsvpField
                      label={m.rsvp.phone}
                      htmlFor="rsvp-telephone"
                      hint={m.rsvp.phoneHint}
                      className="mt-6"
                    >
                      <input
                        id="rsvp-telephone"
                        required
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        pattern="[0-9+().\s-]{8,20}"
                        data-testid="rsvp-input-telephone"
                        placeholder={m.rsvp.phonePh}
                        value={form.telephone}
                        onChange={set("telephone")}
                        onBlur={() => {
                          if (form.telephone.trim() && !lookupPhone) setLookupPhone(form.telephone);
                        }}
                        className="rsvp-line"
                      />
                    </RsvpField>
                  </RsvpSection>

                  <RsvpSection title={m.rsvp.sectionPresence}>
                    <p className="rsvp-reply-question">{m.rsvp.attendance}</p>
                    <div className="rsvp-radio-list" data-testid="rsvp-attendance">
                      <RsvpRadio
                        active={form.present === true}
                        testId="rsvp-present-oui"
                        onClick={() => setForm({ ...form, present: true })}
                      >
                        {m.rsvp.present}
                      </RsvpRadio>
                      <RsvpRadio
                        active={form.present === false}
                        testId="rsvp-present-non"
                        onClick={() => setForm({ ...form, present: false, chanson: "" })}
                      >
                        {m.rsvp.absent}
                      </RsvpRadio>
                    </div>

                    {form.present ? (
                      <>
                        <p className="rsvp-reply-question mt-7">{m.rsvp.mode}</p>
                        <div className="rsvp-radio-list" data-testid="rsvp-mode">
                          <RsvpRadio
                            active={form.mode === "presentiel"}
                            testId="rsvp-mode-presentiel"
                            onClick={() => setForm({ ...form, mode: "presentiel" })}
                          >
                            {m.rsvp.inPerson}
                          </RsvpRadio>
                          <RsvpRadio
                            active={form.mode === "zoom"}
                            testId="rsvp-mode-zoom"
                            onClick={() => setForm({ ...form, mode: "zoom" })}
                          >
                            {m.rsvp.onZoom}
                          </RsvpRadio>
                        </div>
                      </>
                    ) : null}

                    {form.present && form.mode === "presentiel" ? (
                      <div className="mt-7">
                        <RsvpField label={m.rsvp.guests} htmlFor="rsvp-accompagnants">
                          <select
                            id="rsvp-accompagnants"
                            data-testid="rsvp-select-accompagnants"
                            value={form.accompagnants}
                            onChange={set("accompagnants")}
                            className="rsvp-line rsvp-line--select"
                          >
                            {[0, 1, 2, 3, 4].map((n) => (
                              <option key={n} value={n}>
                                {n === 0 ? m.rsvp.alone : m.rsvp.plusGuests(n)}
                              </option>
                            ))}
                          </select>
                        </RsvpField>
                      </div>
                    ) : null}
                  </RsvpSection>

                  <div className="rsvp-reply-actions">
                    <button
                      type="submit"
                      disabled={loading}
                      data-testid="rsvp-submit-button"
                      className="rsvp-reply-submit animate-blink"
                    >
                      <Send size={15} className="text-wedding-gold-accent" aria-hidden />
                      {loading ? m.rsvp.submitting : isUpdate ? m.rsvp.submitUpdate : m.rsvp.submit}
                    </button>
                  </div>
                </form>

                <RsvpPhoneLookup
                  m={m}
                  lookupPhone={lookupPhone}
                  setLookupPhone={setLookupPhone}
                  lookup={lookup}
                  lookupBusy={lookupBusy}
                />
              </ReplyCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
