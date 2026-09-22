import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Feather, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { getGuestbook, createGuestbook } from "@/lib/api";
import { EASE } from "@/lib/invite-data";
import Chapter from "./Chapter";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

export default function Guestbook() {
  const [messages, setMessages] = useState([]);
  const [nom, setNom] = useState("");
  const [message, setMessage] = useState("");
  const [liked, setLiked] = useState({});
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (messages.length < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % messages.length), 6000);
    return () => clearInterval(t);
  }, [messages.length]);

  const prev = () => setIndex((i) => (i - 1 + messages.length) % messages.length);
  const next = () => setIndex((i) => (i + 1) % messages.length);

  useEffect(() => {
    getGuestbook().then(setMessages).catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await createGuestbook({ nom, message });
      setMessages([data, ...messages]);
      setNom("");
      setMessage("");
      toast.success("Votre message a été gravé dans le livre d'or.");
    } catch {
      toast.error("Une erreur est survenue — merci de réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="livre-or" className="relative py-24 md:py-36 px-5 sm:px-8 lg:px-16 bg-[#F3ECE2]" data-testid="guestbook-section">
      <div className="relative z-10 max-w-4xl mx-auto">
        <Chapter index="VII" eyebrow="Livre d'Or" title="Vos Mots Doux" script="gravez votre passage" />

        <motion.form
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: EASE }}
          onSubmit={submit}
          className="rounded-3xl border hairline bg-white p-5 shadow-[0_16px_40px_rgba(74,14,23,0.08)] sm:p-6"
          data-testid="guestbook-form"
        >
          <div className="grid gap-3 sm:grid-cols-[1fr_2fr]">
            <input
              required
              data-testid="guestbook-input-nom"
              placeholder="Votre nom *"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="rounded-2xl border hairline bg-[#FAF7F2] px-3.5 py-2.5 text-sm placeholder:text-[#8C7B7E] transition-all duration-300"
            />
            <div className="relative">
              <textarea
                required
                data-testid="guestbook-input-message"
                rows={2}
                maxLength={280}
                placeholder="Un vœu, un souvenir, une déclaration… *"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full resize-none rounded-2xl border hairline bg-[#FAF7F2] px-3.5 py-2.5 text-sm placeholder:text-[#8C7B7E] transition-all duration-300"
              />
              <span className="absolute bottom-2.5 right-3 text-[10px] text-[#8C7B7E]" data-testid="guestbook-char-counter">{message.length}/280</span>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            data-testid="guestbook-submit-button"
            className="mt-3.5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#4A0E17] px-7 py-3 font-cinzel text-[11px] uppercase tracking-[0.22em] text-[#FAF7F2] transition-all duration-300 hover:bg-[#6B1724] disabled:opacity-60 sm:w-auto"
          >
            <Feather size={15} /> {loading ? "Gravure…" : "Signer le livre d'or"}
          </button>
        </motion.form>

        <div className="mt-12" data-testid="guestbook-list">
          {messages.length === 0 && (
            <p className="text-center font-display italic text-xl text-[#8C7B7E]" data-testid="guestbook-empty">
              Soyez le premier à laisser une trace d'encre dorée…
            </p>
          )}
          {messages.length > 0 && (
            <div className="relative max-w-2xl mx-auto">
              <div className="overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.article
                    key={messages[index]?.id || index}
                    initial={{ opacity: 0, x: 70 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -70 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="rounded-3xl border hairline bg-white p-6 text-center shadow-[0_16px_40px_rgba(74,14,23,0.08)] sm:p-8"
                    data-testid="guestbook-slide"
                  >
                    <span className="font-script text-6xl text-[#D4AF37] leading-none">«</span>
                    <p className="mt-2 font-display italic text-xl sm:text-2xl text-[#4A0E17] leading-relaxed">
                      {messages[index].message}
                    </p>
                    <div className="mt-6 flex items-center justify-center gap-3">
                      <span className="h-px w-8 bg-[#D4AF37]/60" />
                      <div>
                        <p className="font-script text-2xl text-[#C48B92]">{messages[index].nom}</p>
                        <p className="text-[10px] font-cinzel tracking-[0.2em] uppercase text-[#8C7B7E]">{formatDate(messages[index].created_at)}</p>
                      </div>
                      <span className="h-px w-8 bg-[#D4AF37]/60" />
                    </div>
                  </motion.article>
                </AnimatePresence>
              </div>

              <button
                data-testid="guestbook-prev-button"
                onClick={prev}
                aria-label="Message précédent"
                className="absolute top-1/2 -translate-y-1/2 -left-3 sm:-left-16 w-11 h-11 rounded-full bg-[#4A0E17] text-[#D4AF37] border hairline-gold flex items-center justify-center shadow-[0_10px_25px_rgba(74,14,23,0.25)] hover:bg-[#6B1724] hover:-translate-x-0.5 transition-all duration-300"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                data-testid="guestbook-next-button"
                onClick={next}
                aria-label="Message suivant"
                className="absolute top-1/2 -translate-y-1/2 -right-3 sm:-right-16 w-11 h-11 rounded-full bg-[#4A0E17] text-[#D4AF37] border hairline-gold flex items-center justify-center shadow-[0_10px_25px_rgba(74,14,23,0.25)] hover:bg-[#6B1724] hover:translate-x-0.5 transition-all duration-300"
              >
                <ChevronRight size={18} />
              </button>

              <div className="mt-7 flex items-center justify-center gap-2" data-testid="guestbook-dots">
                {messages.map((m, i) => (
                  <button
                    key={m.id || i}
                    data-testid={`guestbook-dot-${i}`}
                    onClick={() => setIndex(i)}
                    aria-label={`Aller au message ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${i === index ? "w-6 bg-[#4A0E17]" : "w-2 bg-[#C48B92]/50 hover:bg-[#C48B92]"}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
