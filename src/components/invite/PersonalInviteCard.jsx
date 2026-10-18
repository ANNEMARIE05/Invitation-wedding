import { ensureInviteCardFontsReady } from "@/lib/invite-card-capture";
import {
  guestNameDisplay,
  guestNameSizeClass,
  personalInviteCountStylePx,
  personalInviteCountStylePercent,
  personalInviteCssVars,
  personalInviteNameFieldStylePx,
  personalInviteNameFieldStylePercent,
} from "@/lib/personal-invite-layout";
import { useI18n } from "@/lib/locale";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

const SEND_CARD_BG = `${process.env.PUBLIC_URL || ""}/images/carte-invitation-envoi.jpg?v=20261018-v6`;

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

  const countStyle =
    renderedSize != null
      ? personalInviteCountStylePx(renderedSize.w, renderedSize.h)
      : personalInviteCountStylePercent();

  return (
    <article
      data-testid={testId}
      data-personal-invite-layout="v5"
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
          width={725}
          height={1024}
        />
        {displayName ? (
          <>
            <div className="personal-invite-fields" style={nameFieldStyle}>
              <div className="personal-invite-name-wrap">
                <p className={`personal-invite-name ${guestNameSizeClass(displayName)}`.trim()}>
                  {displayName}
                </p>
              </div>
            </div>
            <span className="personal-invite-count-badge" style={countStyle} aria-hidden="true">
              {count}
            </span>
          </>
        ) : null}
      </div>
    </article>
  );
}

export { partySize as personalInvitePartySize };
