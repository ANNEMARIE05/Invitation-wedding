import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Lock, Sparkles } from "lucide-react";
import { EASE } from "@/lib/invite-data";
import { useI18n } from "@/lib/locale";
import { coupleLogin } from "@/lib/couple-auth";
import { useCoupleAuth } from "@/lib/useCoupleAuth";
import LangToggle from "@/components/invite/LangToggle";
import CoupleAuthShell from "./CoupleAuthShell";

export default function CoupleLogin() {
  const { m } = useI18n();
  const t = m.coupleSpace.login;
  const navigate = useNavigate();
  const location = useLocation();
  const { refresh } = useCoupleAuth();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setError("");
    setBusy(true);
    const result = await coupleLogin(password.trim());
    setBusy(false);
    if (result.ok) {
      await refresh();
      const dest = location.state?.from || "/espace-maries";
      navigate(dest, { replace: true });
      return;
    }
    if (result.reason === "no_password") setError(t.errConfig);
    else if (result.reason === "network") setError(t.errNetwork || t.errInvalid);
    else setError(t.errInvalid);
    setPassword("");
  };

  return (
    <CoupleAuthShell backLabel={t.backInvitation} backTo="/" narrow>
      <LangToggle floating />
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.12, ease: EASE }}
        className="couple-login-card relative mx-auto w-full"
        data-testid="couple-login"
      >
        <div className="pointer-events-none absolute -inset-px rounded-[1.35rem] bg-gradient-to-br from-[#D4AF37]/35 via-transparent to-[#ED1E79]/25 opacity-80 blur-sm" aria-hidden />
        <div className="relative overflow-hidden rounded-[1.25rem] border border-[#FAF7F2]/18 bg-[#FAF7F2]/[0.12] shadow-[0_24px_64px_rgba(42,5,11,0.28)] backdrop-blur-md">
          <div className="pointer-events-none absolute inset-3 rounded-xl border border-[#C0C0C0]/22" aria-hidden />
          <div className="relative px-6 py-8 sm:px-10 sm:py-9">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#D4AF37]/50 bg-gradient-to-br from-[#B8326A]/90 to-[#6B2440] shadow-[0_12px_32px_rgba(237,30,121,0.22)]">
              <Lock size={22} className="text-[#D4AF37]" strokeWidth={1.4} aria-hidden />
            </div>

            <h1 className="mt-6 text-center font-display text-3xl font-medium italic text-[#FAF7F2] sm:text-4xl">
              {t.title}
            </h1>
            <p className="mt-2 text-center font-script text-2xl text-[#D4AF37]">{t.subtitle}</p>

            <form onSubmit={submit} className="mt-7 space-y-5">
              <div>
                <label htmlFor="couple-password" className="mb-2 block font-cinzel text-[10px] tracking-[0.28em] uppercase text-[#C48B92]">
                  {t.passwordLabel}
                </label>
                <div className="relative">
                  <input
                    id="couple-password"
                    data-testid="couple-password-input"
                    type={show ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    disabled={busy}
                    placeholder={t.passwordPh}
                    className="couple-auth-input w-full rounded-2xl border border-[#FAF7F2]/22 bg-[#2A050B]/35 py-3.5 pl-4 pr-12 text-[#FAF7F2] placeholder:text-[#E8C4CE]/55 transition-all duration-300 focus:border-[#D4AF37]/55 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    data-testid="couple-password-toggle"
                    onClick={() => setShow((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[#C48B92] transition-colors hover:text-[#D4AF37]"
                    aria-label={show ? t.hidePassword : t.showPassword}
                  >
                    {show ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-sm text-[#FFB4C8]"
                  role="alert"
                  data-testid="couple-login-error"
                >
                  {error}
                </motion.p>
              )}

              <button
                type="submit"
                data-testid="couple-login-submit"
                disabled={busy || !password.trim()}
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-[#B8326A] via-[#9B1B4A] to-[#7A1538] py-3.5 font-cinzel text-[11px] tracking-[0.28em] uppercase text-[#FAF7F2] shadow-[0_12px_32px_rgba(92,10,32,0.35)] transition-all hover:shadow-[0_16px_40px_rgba(212,175,55,0.22)] disabled:cursor-not-allowed disabled:opacity-45"
              >
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-[#FAF7F2]/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <Sparkles size={15} className="text-[#D4AF37]" strokeWidth={1.5} aria-hidden />
                {busy ? t.submitting : t.submit}
              </button>
            </form>

            <p className="mt-6 text-center font-cinzel text-[9px] tracking-[0.22em] uppercase text-[#FAF7F2]/35">{t.privateNote}</p>
          </div>
        </div>
      </motion.div>
    </CoupleAuthShell>
  );
}
