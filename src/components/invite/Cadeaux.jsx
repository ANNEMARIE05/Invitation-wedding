import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Copy, Check, Gift, PhoneCall } from "lucide-react";
import { toast } from "sonner";
import { EASE, MOBILE_MONEY_ACCOUNTS } from "@/lib/invite-data";
import { useI18n } from "@/lib/locale";
import { useSettings } from "@/lib/settings";
import Chapter from "./Chapter";
import LuxeCard from "./LuxeCard";
import ClassicRule from "./ClassicRule";

const stripEmoji = (s = "") => s.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, "").trim();

export default function Cadeaux() {
  const { m } = useI18n();
  const { coupleLabel } = useSettings();
  const [copiedId, setCopiedId] = useState(null);
  const accounts = MOBILE_MONEY_ACCOUNTS.filter(({ id }) => id === "wave" || id === "orange");
  const beneficiaryName = coupleLabel || m.gifts.beneficiaryName || "Stéphane & Marie";

  const copyNumber = async (account) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(account.rawNumber);
      } else {
        const input = document.createElement("input");
        input.value = account.rawNumber;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
      }
      setCopiedId(account.id);
      toast.success(m.gifts.copied, {
        description: `${account.number} — ${beneficiaryName}`,
        duration: 3500,
      });
      setTimeout(() => setCopiedId(null), 3000);
    } catch {
      toast.error(m.gifts.copyError);
    }
  };

  return (
    <section
      id="cadeaux"
      className="relative overflow-hidden py-16 px-4 sm:px-8 sm:py-24 md:py-32 lg:px-16"
      data-testid="cadeaux-section"
    >
      {/* Halo d'ambiance doux en arrière-plan */}
      <div
        className="pointer-events-none absolute -top-20 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-gradient-to-br from-wedding-rose-light/40 via-wedding-ivory to-transparent blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-4xl">
        <Chapter
          index="VII"
          eyebrow={m.gifts.chapter}
          title={m.gifts.title}
          script={m.gifts.script}
        />

        {/* Moyens de paiement proposés aux invités */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -40px 0px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mx-auto mt-6"
        >
          <LuxeCard animate={false} className="mx-auto max-w-3xl overflow-hidden p-4 text-center sm:p-7">
            {/* Mot des mariés */}
            <div className="mx-auto max-w-xl">
              <p className="font-script text-[1.65rem] leading-tight text-wedding-rose sm:text-4xl">
                {stripEmoji(m.gifts.tagline || "Votre présence est déjà notre plus beau cadeau")}
              </p>

              <ClassicRule className="mx-auto mt-3 max-w-[9rem]" gem="♥" />

              <p className="mx-auto mt-4 max-w-xl font-display text-[17px] italic leading-relaxed text-wedding-wine-deep/90 sm:text-[19px] sm:leading-8">
                {m.gifts.lead}
              </p>

              <p className="mt-4 font-cinzel text-[10px] uppercase tracking-[0.3em] text-wedding-muted sm:text-[11px]">
                {(m.gifts.beneficiaryLabel || "Bénéficiaire").replace(/\s*:\s*$/, "")}
                <span className="mx-2 text-wedding-gold-accent">✦</span>
                <span className="font-semibold text-wedding-wine">{beneficiaryName}</span>
              </p>
            </div>

            <div className="mx-auto mt-6 grid max-w-2xl gap-3 sm:grid-cols-2">
              {accounts.map((account) => {
                const isCopied = copiedId === account.id;
                const isOrange = account.id === "orange";
                return (
                  <motion.article
                    key={account.id}
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className="relative overflow-hidden rounded-2xl border bg-white/85 p-3.5 text-left shadow-[0_6px_20px_rgba(42,5,11,0.06)] transition-shadow duration-300 hover:shadow-[0_14px_32px_rgba(42,5,11,0.1)] sm:p-4"
                    style={{ borderColor: `${account.color}40` }}
                  >
                    {/* Liseré couleur de l'opérateur */}
                    <span
                      className="pointer-events-none absolute inset-y-0 left-0 w-1"
                      style={{ backgroundColor: account.color }}
                      aria-hidden="true"
                    />

                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5">
                        {account.logoUrl ? (
                          <img
                            src={account.logoUrl}
                            alt={`Logo ${account.name}`}
                            className={account.id === "wave" ? "h-full w-full rounded-xl object-cover" : "h-8 w-9 object-contain"}
                          />
                        ) : (
                          <span className="text-2xl leading-none" aria-hidden="true">
                            {account.iconEmoji}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${account.badgeBg} ${account.badgeText}`}
                        >
                          {account.name}
                        </span>
                        <p className="mt-0.5 truncate font-display text-lg font-bold tracking-[0.06em] text-wedding-wine-deep sm:text-xl">
                          {account.number}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <motion.button
                        type="button"
                        onClick={() => copyNumber(account)}
                        whileTap={{ scale: 0.96 }}
                        className={`inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-white shadow-sm transition-all hover:brightness-105 ${
                          isCopied ? "bg-emerald-600" : ""
                        }`}
                        style={isCopied ? undefined : { backgroundColor: account.color }}
                        aria-label={`${m.gifts.copyNumber} ${account.name}`}
                      >
                        {isCopied ? <Check size={13} /> : <Copy size={12} />}
                        <span className="truncate">{isCopied ? m.gifts.copied : m.gifts.copyNumber}</span>
                      </motion.button>

                      <a
                        href={account.actionUrl}
                        target={isOrange ? undefined : "_blank"}
                        rel={isOrange ? undefined : "noopener noreferrer"}
                        title={isOrange ? m.gifts.orangeAction : m.gifts.openWave}
                        className={`inline-flex items-center justify-center gap-1.5 rounded-full border bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] transition-all duration-300 ${
                          isOrange
                            ? "border-[#FF7900]/40 text-[#D35400] hover:border-[#FF7900] hover:bg-[#FF7900] hover:text-white"
                            : "border-[#1DC3F4]/40 text-[#0094C6] hover:border-[#1DC3F4] hover:bg-[#1DC3F4] hover:text-white"
                        }`}
                      >
                        <span className="truncate">{isOrange ? m.gifts.orangeAction : m.gifts.openWave}</span>
                        {isOrange ? <PhoneCall size={12} className="shrink-0" /> : <ArrowUpRight size={12} className="shrink-0" />}
                      </a>
                    </div>
                  </motion.article>
                );
              })}
            </div>

            {/* Note douce : Urne & enveloppes */}
            <div className="mx-auto mt-8 max-w-xl">
              <div className="flex items-center justify-center gap-3" aria-hidden="true">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent to-wedding-gold-accent/50" />
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-wedding-gold-accent/50 bg-white/80 text-wedding-wine shadow-[0_4px_14px_rgba(212,175,55,0.18)]">
                  <Gift size={15} strokeWidth={1.6} />
                </span>
                <span className="h-px flex-1 bg-gradient-to-l from-transparent to-wedding-gold-accent/50" />
              </div>
              <p className="mx-auto mt-3 max-w-xl text-center font-display text-[16.5px] italic leading-relaxed text-wedding-wine-deep/85 sm:text-[18.5px] sm:leading-8">
                {m.gifts.urnNote ||
                  "Une boîte à vœux et enveloppes sera également à votre disposition le jour de la réception."}
              </p>
            </div>
          </LuxeCard>
        </motion.div>
      </div>
    </section>
  );
}
