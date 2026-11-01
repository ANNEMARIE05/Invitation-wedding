import LangToggle from "@/components/invite/LangToggle";
import CoupleAuthShell from "@/components/invite/CoupleAuthShell";
import CoupleBackofficePanel from "@/components/invite/CoupleBackofficePanel";

export default function CoupleBackofficeLayout({
  backLabel = "Espace mariés",
  backTo = "/espace-maries",
  showLangToggle = true,
  panel,
  children,
}) {
  return (
    <CoupleAuthShell backLabel={backLabel} backTo={backTo} showCoupleBanner={false} contentAlign="start">
      {showLangToggle ? <LangToggle floating /> : null}
      <CoupleBackofficePanel {...panel}>{children}</CoupleBackofficePanel>
    </CoupleAuthShell>
  );
}
