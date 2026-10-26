import { ensureInviteCardFontsReady } from "@/lib/invite-card-capture";
import {
  guestNameDisplay,
  guestNameSizeClass,
  personalInviteCssVars,
  personalInviteNameFieldStylePx,
  personalInviteNameFieldStylePercent,
  personalInviteCountFieldStylePx,
  personalInviteCountFieldStylePercent,
  personalInviteWaveFieldStylePx,
  personalInviteWaveFieldStylePercent,
  personalInviteOrangeFieldStylePx,
  personalInviteOrangeFieldStylePercent,
} from "@/lib/personal-invite-layout";
import { GIFTS_PRIMARY_PHONE, GIFTS_PRIMARY_PHONE_RAW } from "@/lib/invite-data";
import { useI18n } from "@/lib/locale";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { toast } from "sonner";

const SEND_CARD_BG = `${process.env.PUBLIC_URL || ""}/images/carte-invitation-personnelle.png?v=20261025-v2`;

const partySize = (guest) => 1 + Number(guest?.accompagnants || 0);

/**
 * @param {{ guest: { nom: string, accompagnants?: number }, testId?: string }} props
 */
export default function PersonalInviteCard({ guest, testId = "personal-invite-card" }) {
  const { m } = useI18n();
  const displayName = guestNameDisplay(guest?.nom);
  const count = partySize(guest);
  const partyWord = count > 1 ? m.inviteSection.persons : m.inviteSection.person;

  const imgRef = useRef(null);
  const [renderedSize, setRenderedSize] = useState(null);

  const syncRenderedSize = useCallback(() => {
    const img = imgRef.current;
    if (!img?.offsetWidth || !img?.offsetHeight) return;
    setRenderedSize({ w: img.offsetWidth, h: img.offsetHeight });
  }, []);

  useLayoutEffect(() => {
    syncRenderedSize();
    const img = imgRef.current;
    if (!img) return undefined;

    const ro = new ResizeObserver(syncRenderedSize);
    ro.observe(img);
    img.addEventListener("load", syncRenderedSize);

    return () => {
      ro.disconnect();
      img.removeEventListener("load", syncRenderedSize);
    };
  }, [syncRenderedSize, displayName]);

  useEffect(() => {
    void ensureInviteCardFontsReady();
  }, [displayName, count]);

  const copyOperatorPhone = async (e, operatorName) => {
    e?.stopPropagation?.();
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(GIFTS_PRIMARY_PHONE_RAW);
      } else {
        const input = document.createElement("input");
        input.value = GIFTS_PRIMARY_PHONE_RAW;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
      }
      toast.success(`Numéro ${operatorName} copié !`, {
        description: `${GIFTS_PRIMARY_PHONE} — (Stéphane & Marie)`,
        duration: 3500,
      });
    } catch {
      toast.info(`${operatorName} : ${GIFTS_PRIMARY_PHONE}`);
    }
  };

  const nameFieldStyle =
    renderedSize != null
      ? personalInviteNameFieldStylePx(renderedSize.w, renderedSize.h)
      : personalInviteNameFieldStylePercent();

  const countFieldStyle =
    renderedSize != null
      ? personalInviteCountFieldStylePx(renderedSize.w, renderedSize.h)
      : personalInviteCountFieldStylePercent();

  const waveFieldStyle =
    renderedSize != null
      ? personalInviteWaveFieldStylePx(renderedSize.w, renderedSize.h)
      : personalInviteWaveFieldStylePercent();

  const orangeFieldStyle =
    renderedSize != null
      ? personalInviteOrangeFieldStylePx(renderedSize.w, renderedSize.h)
      : personalInviteOrangeFieldStylePercent();

  return (
    <article
      data-testid={testId}
      data-personal-invite-layout="v9"
      className="personal-invite-article relative mx-auto w-full max-w-[min(100%,480px)] overflow-visible [container-type:inline-size] sm:max-w-[520px]"
    >
      <div
        className="personal-invite-shell personal-invite-shell--flat"
        style={personalInviteCssVars()}
        aria-label={displayName ? `${displayName}, ${count} ${partyWord}` : undefined}
      >
        <img
          ref={imgRef}
          src={SEND_CARD_BG}
          alt=""
          className="personal-invite-bg"
          aria-hidden
          decoding="async"
          draggable={false}
          width={682}
          height={1024}
        />
        {displayName ? (
          <>
            {/* Nom de l'invité dans l'espace sous "INVITATION PERSONNELLE POUR" */}
            <div className="personal-invite-name-field" style={nameFieldStyle}>
              <p className={`personal-invite-name ${guestNameSizeClass(displayName)}`.trim()}>
                {displayName}
              </p>
            </div>
            {/* Nombre de personnes dans l'espace avant "PERSONNE(S)" */}
            <div className="personal-invite-count-field" style={countFieldStyle}>
              <span className="personal-invite-count">
                {count}
              </span>
            </div>
          </>
        ) : null}

        {/* Numéro Wave dans la case dédiée */}
        <div className="personal-invite-phone-field personal-invite-phone-field--wave" style={waveFieldStyle}>
          <button
            type="button"
            className="personal-invite-phone-btn"
            onClick={(e) => copyOperatorPhone(e, "Wave")}
            title="Cliquer pour copier le numéro Wave"
          >
            <span className="personal-invite-phone-text">{GIFTS_PRIMARY_PHONE}</span>
          </button>
        </div>

        {/* Numéro Orange Money dans la case dédiée */}
        <div className="personal-invite-phone-field personal-invite-phone-field--orange" style={orangeFieldStyle}>
          <button
            type="button"
            className="personal-invite-phone-btn"
            onClick={(e) => copyOperatorPhone(e, "Orange Money")}
            title="Cliquer pour copier le numéro Orange Money"
          >
            <span className="personal-invite-phone-text">{GIFTS_PRIMARY_PHONE}</span>
          </button>
        </div>
      </div>
    </article>
  );
}

export { partySize as personalInvitePartySize };
