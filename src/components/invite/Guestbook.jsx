import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Feather } from "lucide-react";
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
  const [loading, setLoading] = useState(false);

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
    <section id="livre-or" className="py-24 md:py-36 px-5 sm:px-8 lg:px-16 bg-[#F3ECE2]" data-testid="guestbook-section">
      <div className="max-w-4xl mx-auto">
        <Chapter index="VIII" eyebrow="Livre d'Or" title="Vos Mots Doux" script="gravez votre passage" />

        <motion.form
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: EASE }}
          onSubmit={submit}
          className="bg-white border hairline rounded-sm shadow-[0_20px_60px_rgba(74,14,23,0.08)] p-7 sm:p-9"
          data-testid="guestbook-form"
        >
          <div className="grid sm:grid-cols-[1fr_2fr] gap-5">
            <input
              required
              data-testid="guestbook-input-nom"
              placeholder="Votre nom *"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="bg-[#FAF7F2] border hairline rounded-sm px-4 py-3.5 text-sm placeholder:text-[#8C7B7E] transition-all duration-300"
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
                className="w-full bg-[#FAF7F2] border hairline rounded-sm px-4 py-3.5 text-sm placeholder:text-[#8C7B7E] transition-all duration-300 resize-none"
              />
              <span className="absolute bottom-2.5 right-3 text-[10px] text-[#8C7B7E]" data-testid="guestbook-char-counter">{message.length}/280</span>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            data-testid="guestbook-submit-button"
            className="mt-5 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#4A0E17] text-[#FAF7F2] font-cinzel text-[11px] tracking-[0.25em] uppercase px-8 py-3.5 hover:bg-[#6B1724] transition-all duration-300 disabled:opacity-60"
          >
            <Feather size={15} /> {loading ? "Gravure…" : "Signer le livre d'or"}
          </button>
        </motion.form>

        <div className="mt-12 grid sm:grid-cols-2 gap-5" data-testid="guestbook-list">
          {messages.length === 0 && (
            <p className="sm:col-span-2 text-center font-display italic text-xl text-[#8C7B7E]" data-testid="guestbook-empty">
              Soyez le premier à laisser une trace d'encre dorée…
            </p>
          )}
          {messages.map((m, i) => (
            <motion.article
              key={m.id || i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: (i % 4) * 0.06, ease: EASE }}
              className="bg-white border hairline rounded-sm p-6 relative"
              data-testid={`guestbook-message-${i}`}
            >
              <p className="font-display italic text-lg text-[#4A0E17] leading-relaxed">« {m.message} »</p>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="font-script text-xl text-[#C48B92]">{m.nom}</p>
                  <p className="text-[10px] font-cinzel tracking-[0.2em] uppercase text-[#8C7B7E]">{formatDate(m.created_at)}</p>
                </div>
                <button
                  data-testid={`guestbook-like-${i}`}
                  onClick={() => setLiked({ ...liked, [m.id || i]: !liked[m.id || i] })}
                  aria-label="Aimer ce message"
                  className="transition-transform duration-300 hover:scale-125"
                >
                  <Heart
                    size={20}
                    strokeWidth={1.5}
                    className={liked[m.id || i] ? "fill-[#6B1724] text-[#6B1724]" : "text-[#C48B92]"}
                  />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
