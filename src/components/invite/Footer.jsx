import { useSettings } from "@/lib/settings";

export default function Footer() {
  const { bride, groom, dateLabel } = useSettings();
  return (
    <footer
      className="relative py-20 px-6 text-center bg-[linear-gradient(160deg,#2A050B_0%,#3B0910_60%,#58111A_100%)]"
      data-testid="footer"
    >
      <p className="font-script text-5xl sm:text-6xl text-[#D4AF37]">
        {bride} & {groom}
      </p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <span className="h-px w-14 bg-[#D4AF37]/50" />
        <span className="text-[#D4AF37]">✦</span>
        <span className="h-px w-14 bg-[#D4AF37]/50" />
      </div>
      <p className="mt-6 font-cinzel text-[11px] tracking-[0.4em] uppercase text-[#C48B92]">{dateLabel}</p>
      <p className="mt-10 text-xs text-[#FAF7F2]/40">Fait avec amour — nous avons hâte de célébrer avec vous.</p>
    </footer>
  );
}
