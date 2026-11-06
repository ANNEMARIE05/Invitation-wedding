import { Navigate, useLocation } from "react-router-dom";
import { useCoupleAuth } from "@/lib/useCoupleAuth";
import CoupleAuthGate from "./WeddingLoader";

export default function RequireCoupleAuth({ children }) {
  const location = useLocation();
  const { authenticated, checking } = useCoupleAuth();

  if (checking) return <CoupleAuthGate />;

  if (!authenticated) {
    return <Navigate to="/espace-maries" replace state={{ from: location.pathname }} />;
  }
  return children;
}
