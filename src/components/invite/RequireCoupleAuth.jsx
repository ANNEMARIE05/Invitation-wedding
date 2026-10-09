import { Navigate, useLocation } from "react-router-dom";
import { isCoupleAuthenticated } from "@/lib/couple-auth";

export default function RequireCoupleAuth({ children }) {
  const location = useLocation();
  if (!isCoupleAuthenticated()) {
    return <Navigate to="/espace-maries" replace state={{ from: location.pathname }} />;
  }
  return children;
}
