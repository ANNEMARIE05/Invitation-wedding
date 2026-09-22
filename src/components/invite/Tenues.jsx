import { motion } from "framer-motion";
import { Crown, MessageCircle, Shirt, Sparkles } from "lucide-react";
import { EASE, WHATSAPP_NUMBER } from "@/lib/invite-data";
import Chapter from "./Chapter";

const PAGNE_MESSAGE = "Bonjour, je souhaite commander un pagne pour le mariage. Pouvez-vous me renseigner ?";

const PAGNES = [
  { id: "royal", name: "Le Royal", porteurs: "Familles & témoins", img: "/img/pagne-royal.jpg" },
  { id: "tisse", name: "Le Tissé d'Or", porteurs: "Chers invités", img: "/img/pagne-tisse.jpg" },
];

const COLORS = [
  { id: "bordeaux", label: "Bordeaux", hex: "#4A0E17" },
  { id: "rose", label: "Rose poudré", hex: "#E8B4BC" },
  { id: "blanc", label: "Blanc", hex: "#FFFFFF" },
];

const DRESSCODE = [
  { icon: Shirt, label: "Tenue de soirée chic" },
  { icon: Sparkles, label: "Touches d'or & de rose" },
  { icon: Crown, label: "Pagne à l'honneur" },
];

export default function Tenues() {
  return (
    <section id="tenues" className="relative py-24 md:py-36 px-5 sm:px-8 lg:px-16 overflow-hidden" data-testid="tenues-section">
      <div className="relative z-10 max-w-4xl mx-auto">
        <Chapter index="V" eyebrow="Tenues & Pagnes" title="Les Deux Pagnes" script="à l'unisson, avec élégance" />

        <div className="flex flex-col sm:flex-row items-center justify-center gap-10 sm:gap-14">
          {PAGNES.map((p, i) => (
            <motion.figure
              key={p.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, delay: i * 0.15, ease: EASE }}
              className="text-center"
              data-testid={`pagne-card-${p.id}`}
            >
              <div className="w-64 h-28 sm:w-72 sm:h-32 rounded-full overflow-hidden border-2 border-[#D4AF37]/70 shadow-[0_20px_50px_rgba(74,14,23,0.20)] transition-transform duration-700 ease-out hover:scale-[1.04]">
                <img src={p.img} alt={`Pagne ${p.name}`} className="w-full h-full object-cover" />
              </div>
              <figcaption className="mt-4">
                <p className="font-script text-3xl text-[#4A0E17]">{p.name}</p>
                <p className="mt-1 font-cinzel text-[10px] tracking-[0.3em] uppercase text-[#C48B92]">{p.porteurs}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <a
            data-testid="pagne-whatsapp-button"
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(PAGNE_MESSAGE)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#4A0E17] px-7 py-3.5 font-cinzel text-[11px] uppercase tracking-[0.18em] text-[#FAF7F2] transition-colors duration-300 hover:bg-[#6B1724]"
          >
            <MessageCircle size={15} className="text-[#D4AF37]" /> Commander un pagne
          </a>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE }}
          className="mt-12 text-center"
          data-testid="wedding-colors"
        >
          <p className="font-script text-4xl text-[#4A0E17]">Couleurs du mariage</p>
          <div className="mt-7 flex items-center justify-center gap-8 sm:gap-10">
            {COLORS.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", bounce: 0.45, delay: 0.15 + i * 0.12 }}
                className="text-center"
              >
                <span
                  className="block w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-[0_10px_25px_rgba(74,14,23,0.18)] border border-[#4A0E17]/15"
                  style={{ background: c.hex }}
                  data-testid={`color-${c.id}`}
                />
                <span className="mt-2.5 block font-cinzel text-[10px] tracking-[0.2em] uppercase text-[#8C7B7E]">{c.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE }}
          className="mt-12 rounded-3xl border hairline-gold bg-[#F3ECE2] p-6 text-center sm:p-7"
          data-testid="dresscode-card"
        >
          <p className="font-cinzel text-[11px] tracking-[0.4em] uppercase text-[#C48B92]">Dress Code</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3 sm:gap-4">
            {DRESSCODE.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 rounded-full bg-white border hairline px-5 py-2.5 font-cinzel text-[11px] tracking-[0.2em] uppercase text-[#4A0E17]"
                data-testid={`dresscode-${label.toLowerCase().replace(/[^a-z]/g, "-")}`}
              >
                <Icon size={14} className="text-[#D4AF37]" /> {label}
              </span>
            ))}
          </div>
          <p className="mt-6 text-sm text-[#8C7B7E] leading-relaxed max-w-xl mx-auto">
            Un pagne vous tente ? Écrivez-nous sur WhatsApp, nous vous répondons directement.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
