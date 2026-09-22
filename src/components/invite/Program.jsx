import { motion } from "framer-motion";
import { EASE, PROGRAM } from "@/lib/invite-data";
import Chapter from "./Chapter";
import CloudEdge from "./CloudEdge";

export default function Program() {
  return (
    <section id="programme" className="relative py-24 md:py-36 px-5 sm:px-8 lg:px-16 bg-[#F3ECE2]" data-testid="program-section">
      <CloudEdge tone="sand" position="bottom" />
      <div className="relative z-10 max-w-4xl mx-auto">
        <Chapter index="III" eyebrow="Déroulé" title="Programme de la Journée" script="minute par minute, ensemble" />
        <div className="relative">
          <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#D4AF37]/60 to-transparent" />
          <div className="space-y-12">
            {PROGRAM.map((p, i) => (
              <motion.div
                key={p.time}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, ease: EASE }}
                className={`relative pl-14 md:pl-0 md:w-1/2 ${i % 2 === 0 ? "md:pr-14 md:text-right" : "md:ml-auto md:pl-14"}`}
                data-testid={`program-item-${i}`}
              >
                <span className={`absolute top-3 left-[13px] w-4 h-4 rounded-full bg-[#FAF7F2] border-2 border-[#D4AF37] shadow-[0_0_0_5px_rgba(212,175,55,0.15)] ${i % 2 === 0 ? "md:left-auto md:-right-2" : "md:-left-2"}`} />
                <p className="font-display italic text-3xl text-[#D4AF37] lining-nums tabular-nums">{p.time}</p>
                <h3 className="mt-1 font-display text-2xl text-[#4A0E17]">{p.title}</h3>
                <p className="mt-2 text-sm sm:text-base text-[#5C4F51] leading-relaxed">{p.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
