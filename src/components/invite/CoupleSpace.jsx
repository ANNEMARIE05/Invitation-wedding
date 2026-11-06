import { useCoupleAuth } from "@/lib/useCoupleAuth";
import CoupleLogin from "./CoupleLogin";
import CoupleHub from "./CoupleHub";
import CoupleAuthGate from "./WeddingLoader";

/** Point d'entrée « Espace mariés » : connexion ou tableau de bord. */
export default function CoupleSpace() {
  const { authenticated, checking } = useCoupleAuth();
  if (checking) return <CoupleAuthGate />;
  if (authenticated) return <CoupleHub />;
  return <CoupleLogin />;
}
