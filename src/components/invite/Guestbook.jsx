import { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Feather, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { getGuestbook, createGuestbook } from "@/lib/api";
import { useStoreSync } from "@/lib/useStoreSync";
import { EASE } from "@/lib/invite-data";
import { useI18n } from "@/lib/locale";
import { useSettings } from "@/lib/settings";
import Chapter from "./Chapter";
import LuxeCard from "./LuxeCard";
import ClassicRule from "./ClassicRule";
import SparkleField from "./SparkleField";

/** Messages de test / maquette — non affichés (état vide à la place). */
function isPlaceholderGuestbookEntry(row) {
  const nom = String(row?.nom || "").trim();
  return /^testeur$/i.test(nom);
}

function GuestbookEmptyState({ text, testId = "guestbook-empty" }) {
  return (
    <LuxeCard animate className="guestbook-empty-card px-6 py-9 text-center sm:px-12 sm:py-11">
      <div className="guestbook-empty-card__icon" aria-hidden="true">
        <Feather size={40} strokeWidth={1.35} className="guestbook-empty-card__feather" />
      </div>
      <p className="guestbook-empty-card__text" data-testid={testId}>
        {text}
      </p>
    </LuxeCard>
  );
}

function GuestField({ label, htmlFor, className = "", children }) {
  return (
    <div className={`min-w-0 ${className}`.trim()}>
      <label className="rsvp-label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
    </div>
  );
}

export default function Guestbook() {
  const { m } = useI18n();
  const { locale } = useSettings();
  const locTag = locale === "en" ? "en-GB" : "fr-FR";

  const formatDate = useCallback(
    (iso) =>
      new Date(iso).toLocaleDateString(locTag, {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    [locTag],
  );

  const [messages, setMessages] = useState([]);
  const [nom, setNom] = useState("");
  const [message, setMessage] = useState("");
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [carouselPaused, setCarouselPaused] = useState(false);

  const displayMessages = useMemo(
    () => messages.filter((row) => !isPlaceholderGuestbookEntry(row)),
    [messages],
  );

  useEffect(() => {
    setIndex((i) => (displayMessages.length ? Math.min(i, displayMessages.length - 1) : 0));
  }, [displayMessages.length]);

  useEffect(() => {
    if (displayMessages.length < 2 || carouselPaused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % displayMessages.length), 7000);
    return () => clearInterval(t);
  }, [displayMessages.length, carouselPaused]);

  const prev = () =>
    setIndex((i) => (displayMessages.length ? (i - 1 + displayMessages.length) % displayMessages.length : 0));
  const next = () => setIndex((i) => (displayMessages.length ? (i + 1) % displayMessages.length : 0));

  const reloadMessages = useCallback(() => {
    getGuestbook()
      .then((rows) => setMessages(Array.isArray(rows) ? rows : []))
      .catch(() => setMessages([]));
  }, []);

  useEffect(() => {
    reloadMessages();
  }, [reloadMessages]);

  useStoreSync("guestbook", reloadMessages);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await createGuestbook({ nom, message });
      setMessages((prevMsgs) => [data, ...prevMsgs]);
      setIndex(0);
      setNom("");
      setMessage("");
      toast.success(m.guestbook.toastOk);
    } catch {
      toast.error(m.guestbook.toastErr);
    } finally {
      setLoading(false);
    }
  };

  const current = displayMessages[index];

  return (
    <section
      id="livre-or"
      className="guestbook-section relative overflow-hidden px-5 py-16 sm:px-8 sm:py-24 md:py-36 lg:px-16"
      data-testid="guestbook-section"
    >
      {/* Halo d'ambiance doux en arrière-plan */}
      <div
        className="pointer-events-none absolute -top-20 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-gradient-to-br from-wedding-rose-light/40 via-wedding-ivory to-transparent blur-3xl"
        aria-hidden="true"
      />
      <SparkleField count={10} className="opacity-45" />
      <div className="relative z-10 mx-auto max-w-4xl">
        <Chapter index="VIII" eyebrow={m.guestbook.chapter} title={m.guestbook.title} script={m.guestbook.script} />

        <LuxeCard animate className="guestbook-form-card mx-auto max-w-3xl overflow-hidden px-5 py-6 sm:px-8 sm:py-8">
          <form onSubmit={submit} data-testid="guestbook-form">
          <p className="guestbook-form-lead text-center">{m.guestbook.formLead}</p>
          <ClassicRule className="mx-auto mt-3 mb-5 max-w-[8rem]" gem="♥" />
          <div className="guestbook-form-grid mt-4">
            <GuestField
              label={m.guestbook.nameLabel}
              htmlFor="guestbook-nom"
              className="guestbook-form-name"
            >
              <input
                id="guestbook-nom"
                required
                data-testid="guestbook-input-nom"
                placeholder={m.guestbook.namePh}
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="rsvp-input"
                autoComplete="name"
              />
            </GuestField>
            <GuestField
              label={m.guestbook.messageLabel}
              htmlFor="guestbook-message"
              className="guestbook-form-message"
            >
              <div className="relative">
                <textarea
                  id="guestbook-message"
                  required
                  data-testid="guestbook-input-message"
                  rows={4}
                  maxLength={280}
                  placeholder={m.guestbook.messagePh}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="rsvp-input rsvp-input--area guestbook-textarea pr-14"
                />
                <span
                  className="guestbook-char-counter"
                  data-testid="guestbook-char-counter"
                  aria-live="polite"
                >
                  {message.length}/280
                </span>
              </div>
            </GuestField>
            <button
              type="submit"
              disabled={loading}
              data-testid="guestbook-submit-button"
              className="guestbook-sign-btn guestbook-form-submit"
            >
              <Feather size={16} strokeWidth={2} aria-hidden />
              <span>{loading ? m.guestbook.signing : m.guestbook.sign}</span>
            </button>
          </div>
          </form>
        </LuxeCard>

        <div className="mt-14 md:mt-16" data-testid="guestbook-list">
          {displayMessages.length === 0 && <GuestbookEmptyState text={m.guestbook.empty} />}

          {displayMessages.length > 0 && current && (
            <div
              className="guestbook-carousel relative mx-auto max-w-2xl px-2 sm:px-14"
              onMouseEnter={() => setCarouselPaused(true)}
              onMouseLeave={() => setCarouselPaused(false)}
              onFocusCapture={() => setCarouselPaused(true)}
              onBlurCapture={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) setCarouselPaused(false);
              }}
            >
              {displayMessages.length > 1 && (
                <p className="guestbook-carousel-meta mb-4 text-center" aria-live="polite">
                  {m.guestbook.messageOf(index + 1, displayMessages.length)}
                </p>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id ?? `${current.nom}-${current.created_at}-${index}`}
                  initial={{ opacity: 0, y: 18, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.98 }}
                  transition={{ duration: 0.55, ease: EASE }}
                >
                  <LuxeCard
                    lift
                    animate={false}
                    className="guestbook-quote-card px-6 py-8 text-center sm:px-12 sm:py-12"
                    data-testid="guestbook-message"
                  >
                    <span className="guestbook-quote-mark" aria-hidden>
                      «
                    </span>
                    <blockquote className="guestbook-quote-text font-display italic">
                      {current.message}
                    </blockquote>
                    <footer className="guestbook-quote-footer mt-8">
                      <div className="guestbook-quote-rule" aria-hidden>
                        <span className="guestbook-quote-fleuron">✦</span>
                      </div>
                      <p className="font-script text-[1.45rem] leading-tight text-wedding-wine-accent sm:text-[2rem]">
                        {current.nom}
                      </p>
                      <time
                        className="mt-1 block font-cinzel text-[10px] tracking-[0.22em] text-wedding-wine-accent"
                        dateTime={current.created_at}
                      >
                        {formatDate(current.created_at)}
                      </time>
                    </footer>
                  </LuxeCard>
                </motion.div>
              </AnimatePresence>

              {displayMessages.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label={m.guestbook.prev}
                    onClick={prev}
                    className="guestbook-nav-btn guestbook-nav-btn--prev"
                  >
                    <ChevronLeft size={20} strokeWidth={2.25} />
                  </button>
                  <button
                    type="button"
                    aria-label={m.guestbook.next}
                    onClick={next}
                    className="guestbook-nav-btn guestbook-nav-btn--next"
                  >
                    <ChevronRight size={20} strokeWidth={2.25} />
                  </button>
                  <div className="mt-7 flex justify-center gap-2" role="tablist" aria-label={m.guestbook.chapter}>
                    {displayMessages.map((msg, i) => (
                      <button
                        key={msg.id ?? i}
                        type="button"
                        role="tab"
                        aria-selected={i === index}
                        aria-label={m.guestbook.messageOf(i + 1, displayMessages.length)}
                        onClick={() => setIndex(i)}
                        className={`guestbook-dot ${i === index ? "guestbook-dot--active" : ""}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
