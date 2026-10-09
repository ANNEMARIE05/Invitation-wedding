import { useEffect, useState, useCallback } from "react";
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
import SparkleField from "./SparkleField";

function GuestField({ label, htmlFor, children }) {
  return (
    <div className="min-w-0">
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
    (iso) => {
      const raw = new Date(iso).toLocaleDateString(locTag, {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      return locale === "en" ? raw : raw.toLocaleUpperCase(locTag);
    },
    [locale, locTag],
  );

  const [messages, setMessages] = useState([]);
  const [nom, setNom] = useState("");
  const [message, setMessage] = useState("");
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [carouselPaused, setCarouselPaused] = useState(false);

  useEffect(() => {
    if (messages.length < 2 || carouselPaused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % messages.length), 7000);
    return () => clearInterval(t);
  }, [messages.length, carouselPaused]);

  const prev = () => setIndex((i) => (i - 1 + messages.length) % messages.length);
  const next = () => setIndex((i) => (i + 1) % messages.length);

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

  const current = messages[index];

  return (
    <section
      id="livre-or"
      className="guestbook-section relative overflow-hidden px-5 py-24 sm:px-8 md:py-36 lg:px-16"
      data-testid="guestbook-section"
    >
      <SparkleField count={10} className="opacity-45" />
      <div className="relative z-10 mx-auto max-w-4xl">
        <Chapter index="VII" eyebrow={m.guestbook.chapter} title={m.guestbook.title} script={m.guestbook.script} />

        <LuxeCard animate noInset className="guestbook-form-card px-5 py-6 sm:px-8 sm:py-7">
          <form onSubmit={submit} data-testid="guestbook-form">
          <p className="guestbook-form-lead">{m.guestbook.formLead}</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.65fr)] sm:items-start">
            <div className="flex flex-col gap-3.5">
              <GuestField label={m.guestbook.nameLabel} htmlFor="guestbook-nom">
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
              <button
                type="submit"
                disabled={loading}
                data-testid="guestbook-submit-button"
                className="guestbook-sign-btn mt-auto"
              >
                <Feather size={16} strokeWidth={2} aria-hidden />
                <span>{loading ? m.guestbook.signing : m.guestbook.sign}</span>
              </button>
            </div>
            <GuestField label={m.guestbook.messageLabel} htmlFor="guestbook-message">
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
          </div>
          </form>
        </LuxeCard>

        <div className="mt-14 md:mt-16" data-testid="guestbook-list">
          {messages.length === 0 && (
            <LuxeCard animate className="guestbook-empty-card px-8 py-12 text-center sm:px-12">
              <span className="font-script text-5xl text-[#D4AF37]/80 leading-none" aria-hidden>
                ✒
              </span>
              <p className="mt-4 font-display text-xl italic leading-relaxed text-[#8C7B7E]" data-testid="guestbook-empty">
                {m.guestbook.empty}
              </p>
            </LuxeCard>
          )}

          {messages.length > 0 && current && (
            <div
              className="guestbook-carousel relative mx-auto max-w-2xl px-2 sm:px-14"
              onMouseEnter={() => setCarouselPaused(true)}
              onMouseLeave={() => setCarouselPaused(false)}
              onFocusCapture={() => setCarouselPaused(true)}
              onBlurCapture={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) setCarouselPaused(false);
              }}
            >
              {messages.length > 1 && (
                <p className="guestbook-carousel-meta mb-4 text-center" aria-live="polite">
                  {m.guestbook.messageOf(index + 1, messages.length)}
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
                    className="guestbook-quote-card px-7 py-10 text-center sm:px-12 sm:py-12"
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
                      <p className="font-script text-[1.75rem] leading-tight text-[#C48B92] sm:text-[2rem]">
                        {current.nom}
                      </p>
                      <time
                        className="mt-1 block font-cinzel text-[10px] tracking-[0.22em] text-[#8C7B7E]"
                        dateTime={current.created_at}
                      >
                        {formatDate(current.created_at)}
                      </time>
                    </footer>
                  </LuxeCard>
                </motion.div>
              </AnimatePresence>

              {messages.length > 1 && (
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
                    {messages.map((msg, i) => (
                      <button
                        key={msg.id ?? i}
                        type="button"
                        role="tab"
                        aria-selected={i === index}
                        aria-label={m.guestbook.messageOf(i + 1, messages.length)}
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
