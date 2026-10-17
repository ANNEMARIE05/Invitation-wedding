import { ensureInviteCardFontsReady } from "@/lib/invite-card-capture";
import {
  guestNameDisplay,
  guestNameSizeClass,
  personalInviteCssVars,
} from "@/lib/personal-invite-layout";
import { useEffect } from "react";

const SEND_CARD_BG = `${process.env.PUBLIC_URL || ""}/images/carte-invitation-envoi.jpg?v=20261017-stephane-marie`;

const partySize = (guest) => 1 + Number(guest?.accompagnants || 0);

/**
 * @param {{ guest: { nom: string, accompagnants?: number }, testId?: string }} props
 */
export default function PersonalInviteCard({ guest, testId = "personal-invite-card" }) {
  const displayName = guestNameDisplay(guest?.nom);
  const count = partySize(guest);

  useEffect(() => {
    void ensureInviteCardFontsReady();
  }, [displayName, count]);

  return (
    <article
      data-testid={testId}
      className="personal-invite-article relative mx-auto w-full max-w-[min(100%,480px)] overflow-visible [container-type:inline-size] sm:max-w-[520px]"
    >
      <div
        className="personal-invite-shell"
        style={personalInviteCssVars()}
        aria-label={displayName ? `${displayName}, ${count} personne(s)` : undefined}
      >
        <img
          src={SEND_CARD_BG}
          alt=""
          className="personal-invite-bg"
          aria-hidden
          decoding="async"
          draggable={false}
        />
        <div className="personal-invite-overlay">
          {displayName ? (
            <p className={`personal-invite-name ${guestNameSizeClass(displayName)}`.trim()}>
              {displayName}
            </p>
          ) : null}
          <p className="personal-invite-count" aria-hidden={!displayName}>
            {count}
          </p>
        </div>
      </div>
    </article>
  );
}

export { partySize as personalInvitePartySize };
