import { useCoupleAuth } from "@/lib/useCoupleAuth";
import CoupleLogin from "./CoupleLogin";
import CoupleHub from "./CoupleHub";

/** Point d'entrée « Espace mariés » : connexion ou tableau de bord. */
export default function CoupleSpace() {
  const { authenticated } = useCoupleAuth();
  if (authenticated) return <CoupleHub />;
  return <CoupleLogin />;
}
