import { Navigate, useLocation } from "react-router-dom";
import { useCoupleAuth } from "@/lib/useCoupleAuth";

export default function RequireCoupleAuth({ children }) {
  const location = useLocation();
  const { authenticated, checking } = useCoupleAuth();

  if (checking) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center bg-[#2A050B] text-sm text-[#C48B92]">
        …
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/espace-maries" replace state={{ from: location.pathname }} />;
  }
  return children;
}
