import { ensureInviteCardFontsReady } from "@/lib/invite-card-capture";
import {
  guestNameDisplay,
  guestNameSizeClass,
  personalInviteCssVars,
  personalInviteNameFieldStylePx,
  personalInviteNameFieldStylePercent,
  personalInviteCountFieldStylePx,
  personalInviteCountFieldStylePercent,
} from "@/lib/personal-invite-layout";
import { useI18n } from "@/lib/locale";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

const SEND_CARD_BG = `${process.env.PUBLIC_URL || ""}/images/carte-invitation-personnelle.png?v=20261023-template-v3`;

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

  const nameFieldStyle =
    renderedSize != null
      ? personalInviteNameFieldStylePx(renderedSize.w, renderedSize.h)
      : personalInviteNameFieldStylePercent();

  const countFieldStyle =
    renderedSize != null
      ? personalInviteCountFieldStylePx(renderedSize.w, renderedSize.h)
      : personalInviteCountFieldStylePercent();

  return (
    <article
      data-testid={testId}
      data-personal-invite-layout="v7"
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
            <div className="personal-invite-name-field" style={nameFieldStyle}>
              <p className={`personal-invite-name ${guestNameSizeClass(displayName)}`.trim()}>
                {displayName}
              </p>
            </div>
            <div className="personal-invite-count-field" style={countFieldStyle}>
              <span className="personal-invite-count">
                {count}
              </span>
            </div>
          </>
        ) : null}
      </div>
    </article>
  );
}

export { partySize as personalInvitePartySize };
