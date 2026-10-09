import { motion } from "framer-motion";
import { EASE } from "@/lib/invite-data";
import { useI18n } from "@/lib/locale";
import Chapter from "./Chapter";
import LuxeCard from "./LuxeCard";
import SparkleField from "./SparkleField";

/** Découpe « Luc 1 : 28 » / « Luke 1:28 » en livre + chapitre:verset */
function parseScriptureRef(ref) {
  const m = ref.match(/^(.+)\s+(\d+)\s*:\s*(\d+)\s*$/);
  if (!m) return { book: ref, chapter: "", verse: "" };
  return { book: m[1].trim(), chapter: m[2], verse: m[3] };
}

export default function Verses() {
  const { m } = useI18n();
  return (
    <section id="versets" className="relative py-24 md:py-36 px-5 sm:px-8 lg:px-16 overflow-hidden" data-testid="verses-section">
      <SparkleField count={8} className="opacity-50" />
      <div className="relative z-10 mx-auto max-w-4xl">
        <Chapter index="I" eyebrow={m.verses.chapter} title={m.verses.title} script={m.verses.script} />

        <div className="grid items-stretch gap-10 md:grid-cols-2 md:gap-12">
          {m.verses.items.map((v, i) => {
            const scripture = parseScriptureRef(v.ref);
            const leadLines = v.lines.filter((line) => !line.quote);
            const quoteLines = v.lines.filter((line) => line.quote);
            return (
              <motion.div
                key={v.who}
                className="flex h-full pt-3"
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, delay: i * 0.12, ease: EASE }}
              >
                <LuxeCard
                  as="blockquote"
                  lift
                  animate={false}
                  className="bible-verse-card flex h-full min-h-[22rem] w-full flex-col p-8 pt-9 sm:min-h-[24rem] sm:p-9 sm:pt-10"
                  data-testid={`verse-${v.who.toLowerCase()}`}
                >
                  <span className="bible-verse-ribbon bible-verse-ribbon--right" aria-hidden="true" />
                  <div className="bible-verse-inner flex flex-1 flex-col">
                    <header className="pr-7">
                      <p className="bible-verse-who">{v.who}</p>
                      {leadLines.map((line) => (
                        <p key={line.text} className="bible-verse-lead">
                          {line.text}
                        </p>
                      ))}
                    </header>

                    {quoteLines.length > 0 ? (
                      <div className="bible-verse-scripture mt-auto flex flex-1 flex-col justify-center">
                        {quoteLines.map((line) => (
                          <p
                            key={line.text}
                            className="bible-verse-quote font-display text-xl font-semibold italic text-[#2A050B] sm:text-[1.35rem]"
                          >
                            {scripture.chapter && scripture.verse ? (
                              <span className="bible-verse-num" aria-hidden="true">
                                {scripture.chapter}:{scripture.verse}
                              </span>
                            ) : null}
                            {line.text.replace(/^«\s*/, "").replace(/\s*»$/, "")}
                          </p>
                        ))}
                      </div>
                    ) : null}

                    <footer className="bible-ref mt-auto pt-8">
                      <div className="bible-ref-rule" aria-hidden="true">
                        <span className="bible-ref-fleuron">✦</span>
                      </div>
                      <cite className="bible-ref-cite not-italic">
                        <span className="bible-ref-book">{scripture.book}</span>
                        {scripture.chapter && scripture.verse ? (
                          <span className="bible-ref-nums">
                            {scripture.chapter}
                            <span className="bible-ref-colon">:</span>
                            {scripture.verse}
                          </span>
                        ) : null}
                      </cite>
                    </footer>
                  </div>
                </LuxeCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
