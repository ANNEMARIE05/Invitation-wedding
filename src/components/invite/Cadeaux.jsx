import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Gift, Heart, MessageCircle, ArrowUpRight, PhoneCall, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { EASE, WHATSAPP_NUMBER, MOBILE_MONEY_ACCOUNTS } from "@/lib/invite-data";
import { useI18n } from "@/lib/locale";
import { useSettings } from "@/lib/settings";
import Chapter from "./Chapter";
import LuxeCard from "./LuxeCard";

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

  const waGiftUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    m.gifts?.waGiftMessage || "Bonjour Stéphane et Marie, je souhaite vous bénir avec un cadeau pour votre mariage !"
  )}`;

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
          <LuxeCard animate={false} className="overflow-hidden p-5 text-center sm:p-10">
            {/* Mot des mariés */}
            <div className="mx-auto max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-wedding-rose-light/60 bg-white/80 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-wedding-wine sm:text-xs">
                <Sparkles size={14} className="shrink-0 text-wedding-gold-accent" />
                {m.gifts.tagline || "Votre présence est déjà notre plus beau cadeau 💖"}
                <Sparkles size={14} className="shrink-0 text-wedding-gold-accent" />
              </span>

              <p className="mx-auto mt-5 max-w-2xl type-prose text-sm leading-7 text-wedding-wine-deep sm:text-base">
                {m.gifts.lead}
              </p>
            </div>

            <div className="mx-auto mt-8 grid max-w-2xl gap-4 sm:grid-cols-2">
              {accounts.map((account) => {
                const isCopied = copiedId === account.id;
                const isOrange = account.id === "orange";
                return (
                  <LuxeCard
                    as="article"
                    animate={false}
                    key={account.id}
                    className="overflow-hidden p-4 text-center transition-shadow duration-300 hover:shadow-[0_18px_40px_rgba(42,5,11,0.1)] sm:p-5"
                  >
                    {/* Logo officiel & Badge du service */}
                    <div className="flex flex-col items-center">
                      <div className="flex h-14 w-full items-center justify-center">
                        {account.logoUrl ? (
                          account.id === "wave" ? (
                            <img
                              src={account.logoUrl}
                              alt="Logo Wave"
                              className="h-12 w-12 rounded-full object-contain shadow-[0_4px_16px_rgba(29,195,244,0.3)] transition-transform duration-300 hover:scale-105"
                            />
                          ) : (
                            <img
                              src={account.logoUrl}
                              alt="Logo Orange Money"
                              className="h-12 max-w-[120px] object-contain transition-transform duration-300 hover:scale-105"
                            />
                          )
                        ) : (
                          <span className="text-3xl leading-none" aria-hidden="true">
                            {account.iconEmoji}
                          </span>
                        )}
                      </div>

                      <div
                        className={`mt-2.5 inline-flex items-center rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider ${account.badgeBg} ${account.badgeText}`}
                      >
                        <span>{account.name}</span>
                      </div>
                    </div>

                    <p className="my-3 font-display text-2xl font-bold tracking-[0.08em] text-wedding-wine-deep sm:text-3xl">
                      {account.number}
                    </p>

                    <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-wedding-ivory/80 px-3 py-1.5 shadow-sm">
                      <Heart size={13} className="shrink-0 fill-wedding-rose/30 text-wedding-rose" />
                      <span className="text-xs font-medium text-wedding-wine-deep">
                        {m.gifts.beneficiaryLabel} <strong>{beneficiaryName}</strong>
                      </span>
                    </div>

                    <div className="mt-5 flex flex-col gap-2.5">
                      <motion.button
                        type="button"
                        onClick={() => copyNumber(account)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-sm transition-all hover:brightness-105 ${
                          isCopied ? "bg-emerald-600" : ""
                        }`}
                        style={isCopied ? undefined : { backgroundColor: account.color }}
                        aria-label={`${m.gifts.copyNumber} ${account.name}`}
                      >
                        {isCopied ? <Check size={16} /> : <Copy size={15} />}
                        <span>{isCopied ? m.gifts.copied : m.gifts.copyNumber}</span>
                      </motion.button>

                      <a
                        href={account.actionUrl}
                        target={isOrange ? undefined : "_blank"}
                        rel={isOrange ? undefined : "noopener noreferrer"}
                        className={`inline-flex w-full items-center justify-center gap-2 rounded-full border bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] transition-all duration-300 ${
                          isOrange
                            ? "border-[#FF7900]/40 text-[#D35400] hover:border-[#FF7900] hover:bg-[#FF7900] hover:text-white"
                            : "border-[#1DC3F4]/40 text-[#0094C6] hover:border-[#1DC3F4] hover:bg-[#1DC3F4] hover:text-white"
                        }`}
                      >
                        <span>{isOrange ? m.gifts.orangeAction : m.gifts.openWave}</span>
                        {isOrange ? <PhoneCall size={14} /> : <ArrowUpRight size={14} />}
                      </a>
                    </div>
                  </LuxeCard>
                );
              })}
            </div>

            {/* Note douce : Urne & WhatsApp */}
            <div className="mt-8 grid gap-4 border-t border-wedding-rose-light/50 pt-6 text-left sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-6">
              <div className="flex items-start gap-3 rounded-2xl border border-wedding-rose-light/40 bg-white/75 p-4 sm:p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-wedding-ivory text-wedding-wine">
                  <Gift size={18} strokeWidth={1.7} aria-hidden="true" />
                </span>
                <p className="type-prose self-center text-sm leading-relaxed text-wedding-muted">
                  {m.gifts.urnNote ||
                    "Une boîte à vœux et enveloppes sera également à votre disposition le jour de la réception."}
                </p>
              </div>

              <a
                href={waGiftUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full border border-[#25D366]/35 bg-[#25D366]/10 px-5 py-3 text-center text-sm font-semibold text-[#167C3A] transition-all duration-300 hover:border-[#25D366] hover:bg-[#25D366] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] sm:min-w-[13rem]"
              >
                <MessageCircle size={18} className="shrink-0" aria-hidden="true" />
                <span>{m.gifts.contactWhatsApp || "Écrire aux mariés"}</span>
                <ArrowUpRight size={15} className="shrink-0" aria-hidden="true" />
              </a>
            </div>
          </LuxeCard>
        </motion.div>
      </div>
    </section>
  );
}
