import { useCoupleAuth } from "@/lib/useCoupleAuth";
import CoupleLogin from "./CoupleLogin";
import CoupleHub from "./CoupleHub";

/** Point d'entrée « Espace mariés » : connexion ou tableau de bord. */
export default function CoupleSpace() {
  const { authenticated, checking } = useCoupleAuth();
  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#2A050B] text-sm text-[#C48B92]">
        …
      </div>
    );
  }
  if (authenticated) return <CoupleHub />;
  return <CoupleLogin />;
}
