import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { EASE } from "@/lib/invite-data";
import { useI18n } from "@/lib/locale";
import { coupleLogin } from "@/lib/couple-auth";
import { useCoupleAuth } from "@/lib/useCoupleAuth";
import LangToggle from "@/components/invite/LangToggle";
import ClassicRule from "@/components/invite/ClassicRule";
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
    <CoupleAuthShell backLabel={t.backInvitation} backTo="/" narrow showCoupleBanner={false}>
      <LangToggle floating />
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.95, delay: 0.1, ease: EASE }}
        className="couple-classic-card relative mx-auto w-full max-w-[22rem]"
        data-testid="couple-login"
      >
        <div className="couple-classic-card__frame pointer-events-none" aria-hidden />
        <span className="faire-part-gold-point faire-part-gold-point--tl couple-classic-card__corner" aria-hidden />
        <span className="faire-part-gold-point faire-part-gold-point--tr couple-classic-card__corner" aria-hidden />
        <span className="faire-part-gold-point faire-part-gold-point--bl couple-classic-card__corner" aria-hidden />
        <span className="faire-part-gold-point faire-part-gold-point--br couple-classic-card__corner" aria-hidden />

        <div className="relative px-7 py-10 sm:px-9 sm:py-11">
          <p className="couple-classic-card__kicker text-center tracking-[0.34em]">{t.subtitle}</p>

          <h1 className="couple-classic-card__title mt-3 text-center font-display text-[2rem] font-medium italic leading-tight sm:text-[2.35rem]">
            {t.title}
          </h1>

          <ClassicRule className="mt-5" />

          <form onSubmit={submit} className="mt-8">
            <fieldset className="border-0 p-0">
              <legend className="couple-classic-card__legend mx-auto mb-4 block w-full text-center">
                {t.passwordLabel}
              </legend>

              <div className="couple-classic-field-wrap">
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
                  className="couple-classic-field couple-classic-field--with-toggle couple-auth-input couple-auth-input--paper w-full"
                />
                <button
                  type="button"
                  data-testid="couple-password-toggle"
                  onClick={() => setShow((v) => !v)}
                  disabled={busy}
                  aria-label={show ? t.hidePassword : t.showPassword}
                  aria-pressed={show}
                  className="couple-classic-field-toggle"
                >
                  {show ? (
                    <EyeOff className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.5} aria-hidden />
                  ) : (
                    <Eye className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.5} aria-hidden />
                  )}
                </button>
              </div>
            </fieldset>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-center font-display text-sm italic text-[#B8326A]"
                role="alert"
                data-testid="couple-login-error"
              >
                {error}
              </motion.p>
            )}

            <ClassicRule className="mt-7 mb-6" gem="◇" />

            <button
              type="submit"
              data-testid="couple-login-submit"
              disabled={busy || !password.trim()}
              className="btn-couple-classic w-full"
            >
              {busy ? t.submitting : t.submit}
            </button>
          </form>

          <p className="couple-classic-footnote mt-8 text-center">
            {t.privateNote}
          </p>
        </div>
      </motion.article>
    </CoupleAuthShell>
  );
}
