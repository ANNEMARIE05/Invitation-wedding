import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Check, MessageCircle, Sparkles, Search } from "lucide-react";
import { toast } from "sonner";
import { ApiError, createRsvp, findRsvpByPhone } from "@/lib/api";
import { EASE, WHATSAPP_NUMBER } from "@/lib/invite-data";
import { useI18n } from "@/lib/locale";
import { useSettings } from "@/lib/settings";
import Chapter from "./Chapter";
import InviteCardModal from "./InviteCardModal";
import LuxeCard from "./LuxeCard";

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

function RsvpField({ label, htmlFor, children }) {
  return (
    <div className="min-w-0">
      <label className="rsvp-label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
    </div>
  );
}

const Frame = ({ children }) => (
  <LuxeCard className="rsvp-card overflow-visible px-5 py-6 shadow-[0_24px_60px_rgba(0,0,0,0.2)] sm:px-8 sm:py-7">
    {children}
  </LuxeCard>
);

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
      d.chanson ? `${m.rsvp.waSong} : ${d.chanson}` : "",
      d.message ? `${m.rsvp.waMessage} : ${d.message}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  };

  const lookup = async (e) => {
    e?.preventDefault?.();
    const phone = lookupPhone.trim() || form.telephone.trim();
    if (!phone) return;
    setLookupBusy(true);
    try {
      const result = await findRsvpByPhone(phone);
      if (!result?.rsvp) {
        setForm({ ...initial, telephone: phone });
        setIsUpdate(false);
        setEditLocked(false);
        toast.message(m.rsvp.lookupNotFound);
        return;
      }
      setEditLocked(Boolean(result.edit_locked));
      if (result.edit_locked) {
        setSent(result.rsvp);
        setIsUpdate(false);
        toast.error(m.rsvp.lookupLocked);
        return;
      }
      setForm(rsvpToForm(result.rsvp, m.rsvp.regimes));
      setIsUpdate(true);
      setSent(null);
      toast.success(m.rsvp.lookupFound(firstName(result.rsvp.nom)));
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
      };
      delete payload.regimeIdx;
      const data = await createRsvp(payload, { update: isUpdate });
      setSent(data);
      setIsUpdate(true);
      setEditLocked(false);
      if (data.present && data.mode === "presentiel") {
        setCardModalOpen(true);
      }
      toast.success(data.present ? m.rsvp.toastPresent : m.rsvp.toastAbsent);
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
      <div className="relative z-10 mx-auto max-w-2xl">
        <Chapter index="VI" eyebrow={m.rsvp.chapter} title={m.rsvp.title} script={deadlineLabel} dark />
        <AnimatePresence mode="wait">
          {confirmed ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: EASE }}
              data-testid="rsvp-confirmation"
            >
              <Frame>
                <div className="text-center">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#D4AF37]/60 bg-[#4A0E17]">
                    <Check size={22} className="text-[#D4AF37]" />
                  </span>
                  <h3 className="mt-4 font-display text-3xl text-[#4A0E17]">{m.rsvp.thanks(firstName(confirmed.nom))}</h3>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#5C4F51]">
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
                      className="mt-5 text-sm text-[#4A0E17] underline decoration-[#D4AF37]/50 underline-offset-4 hover:decoration-[#D4AF37]"
                    >
                      {m.rsvp.editMyRsvp}
                    </button>
                  ) : (
                    <p className="mx-auto mt-5 max-w-md text-xs text-[#5C4F51]/90">{m.rsvp.lookupLocked}</p>
                  )}

                  {confirmed.present && confirmed.mode === "presentiel" ? (
                    <>
                      <button
                        type="button"
                        data-testid="rsvp-view-card-button"
                        onClick={() => setCardModalOpen(true)}
                        className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#ED1E79]/35 bg-white px-7 py-3.5 font-cinzel text-[11px] font-semibold uppercase tracking-[0.18em] text-[#5C0A20] transition-all hover:border-[#ED1E79]/55 hover:bg-[#FFF5F8]"
                      >
                        <Sparkles size={15} className="text-[#ED1E79]" />
                        {m.inviteSection.viewCard}
                      </button>
                      <InviteCardModal
                        open={cardModalOpen}
                        onOpenChange={setCardModalOpen}
                        guest={confirmed}
                      />
                    </>
                  ) : confirmed.present ? (
                    <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-[#5C4F51]">
                      {m.rsvp.zoomCode(zoom.code)}
                      {zoom.joinUrl ? (
                        <>
                          {" "}
                          <a
                            href={zoom.joinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="gold-underline text-[#4A0E17]"
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
                      className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#4A0E17] px-7 py-3.5 font-cinzel text-[11px] uppercase tracking-[0.18em] text-[#FAF7F2] transition-colors duration-300 hover:bg-[#6B1724]"
                    >
                      <MessageCircle size={15} className="text-[#D4AF37]" /> {m.rsvp.whatsapp}
                    </a>
                  )}
                </div>
              </Frame>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <Frame>
                <div className="mb-5 rounded-2xl border border-[#D4AF37]/25 bg-[#FFF8FA]/80 px-4 py-4">
                  <p className="font-cinzel text-[10px] uppercase tracking-[0.2em] text-[#9B1B4A]">{m.rsvp.lookupTitle}</p>
                  <p className="mt-1 text-xs leading-relaxed text-[#5C4F51]">{m.rsvp.lookupHint}</p>
                  <form onSubmit={lookup} className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <input
                      type="tel"
                      inputMode="tel"
                      value={lookupPhone}
                      onChange={(e) => setLookupPhone(e.target.value)}
                      placeholder={m.rsvp.phonePh}
                      className="rsvp-input flex-1"
                      data-testid="rsvp-lookup-phone"
                    />
                    <button
                      type="submit"
                      disabled={lookupBusy || !lookupPhone.trim()}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-[#4A0E17]/20 bg-white px-5 py-2.5 font-cinzel text-[10px] uppercase tracking-[0.16em] text-[#4A0E17] disabled:opacity-50"
                      data-testid="rsvp-lookup-submit"
                    >
                      <Search size={14} />
                      {lookupBusy ? m.rsvp.lookupBusy : m.rsvp.lookupAction}
                    </button>
                  </form>
                </div>

                <form onSubmit={submit} className="space-y-3.5" data-testid="rsvp-form">
                  <div className="grid items-start gap-3.5 sm:grid-cols-2">
                    <RsvpField label={m.rsvp.name} htmlFor="rsvp-nom">
                      <input
                        id="rsvp-nom"
                        required
                        data-testid="rsvp-input-nom"
                        placeholder={m.rsvp.namePh}
                        value={form.nom}
                        onChange={set("nom")}
                        className="rsvp-input"
                        autoComplete="name"
                      />
                    </RsvpField>
                    <RsvpField label={m.rsvp.phone} htmlFor="rsvp-telephone">
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
                        className="rsvp-input"
                      />
                    </RsvpField>
                  </div>

                  <div>
                    <span className="rsvp-label">{m.rsvp.attendance}</span>
                    <div className="rsvp-choices" data-testid="rsvp-attendance">
                      {[
                        { v: true, label: m.rsvp.present },
                        { v: false, label: m.rsvp.absent },
                      ].map((o) => (
                        <button
                          type="button"
                          key={String(o.v)}
                          data-testid={o.v ? "rsvp-present-oui" : "rsvp-present-non"}
                          onClick={() => setForm({ ...form, present: o.v })}
                          className={`rsvp-choice${form.present === o.v ? " rsvp-choice--active" : ""}`}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {form.present ? (
                    <div>
                      <span className="rsvp-label">{m.rsvp.mode}</span>
                      <div className="rsvp-choices" data-testid="rsvp-mode">
                        {[
                          { v: "presentiel", label: m.rsvp.inPerson },
                          { v: "zoom", label: m.rsvp.onZoom },
                        ].map((o) => (
                          <button
                            type="button"
                            key={o.v}
                            data-testid={`rsvp-mode-${o.v}`}
                            onClick={() => setForm({ ...form, mode: o.v })}
                            className={`rsvp-choice${form.mode === o.v ? " rsvp-choice--active" : ""}`}
                          >
                            {o.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {form.present && form.mode === "presentiel" ? (
                    <div className="grid items-start gap-3.5 sm:grid-cols-2">
                      <RsvpField label={m.rsvp.guests} htmlFor="rsvp-accompagnants">
                        <select
                          id="rsvp-accompagnants"
                          data-testid="rsvp-select-accompagnants"
                          value={form.accompagnants}
                          onChange={set("accompagnants")}
                          className="rsvp-input"
                        >
                          {[0, 1, 2, 3, 4].map((n) => (
                            <option key={n} value={n}>
                              {n === 0 ? m.rsvp.alone : m.rsvp.plusGuests(n)}
                            </option>
                          ))}
                        </select>
                      </RsvpField>
                      <RsvpField label={m.rsvp.diet} htmlFor="rsvp-regime">
                        <select
                          id="rsvp-regime"
                          data-testid="rsvp-select-regime"
                          value={form.regimeIdx}
                          onChange={(e) => setForm({ ...form, regimeIdx: Number(e.target.value) })}
                          className="rsvp-input"
                        >
                          {m.rsvp.regimes.map((r, i) => (
                            <option key={r} value={i}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </RsvpField>
                    </div>
                  ) : null}

                  <RsvpField label={m.rsvp.song} htmlFor="rsvp-chanson">
                    <input
                      id="rsvp-chanson"
                      data-testid="rsvp-input-chanson"
                      placeholder={m.rsvp.songPh}
                      value={form.chanson}
                      onChange={set("chanson")}
                      className="rsvp-input"
                    />
                  </RsvpField>

                  <RsvpField label={m.rsvp.note} htmlFor="rsvp-message">
                    <textarea
                      id="rsvp-message"
                      data-testid="rsvp-input-message"
                      rows={2}
                      placeholder={m.rsvp.notePh}
                      value={form.message}
                      onChange={set("message")}
                      className="rsvp-input rsvp-input--area"
                    />
                  </RsvpField>

                  <button
                    type="submit"
                    disabled={loading}
                    data-testid="rsvp-submit-button"
                    className="animate-blink inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#4A0E17] px-7 py-3.5 font-cinzel text-xs uppercase tracking-[0.22em] text-[#FAF7F2] transition-colors duration-300 hover:bg-[#6B1724] disabled:opacity-60"
                  >
                    <Send size={15} className="text-[#D4AF37]" />
                    {loading ? m.rsvp.submitting : isUpdate ? m.rsvp.submitUpdate : m.rsvp.submit}
                  </button>
                </form>
              </Frame>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
