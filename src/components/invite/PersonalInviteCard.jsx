import { ensureInviteCardFontsReady } from "@/lib/invite-card-capture";
import {
  guestNameDisplay,
  guestNameSizeClass,
  personalInviteCssVars,
} from "@/lib/personal-invite-layout";
import { useI18n } from "@/lib/locale";
import { useEffect } from "react";

const SEND_CARD_BG = `${process.env.PUBLIC_URL || ""}/images/carte-invitation-envoi.jpg?v=20261017-florale-raffinee2`;

const partySize = (guest) => 1 + Number(guest?.accompagnants || 0);

/**
 * @param {{ guest: { nom: string, accompagnants?: number }, testId?: string }} props
 */
export default function PersonalInviteCard({ guest, testId = "personal-invite-card" }) {
  const { m } = useI18n();
  const displayName = guestNameDisplay(guest?.nom);
  const count = partySize(guest);
  const partyWord = count > 1 ? m.inviteSection.persons : m.inviteSection.person;

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
        aria-label={displayName ? `${displayName}, ${count} ${partyWord}` : undefined}
      >
        <img
          src={SEND_CARD_BG}
          alt=""
          className="personal-invite-bg"
          aria-hidden
          decoding="async"
          draggable={false}
        />
        {displayName ? (
          <div className="personal-invite-fields">
            <div className="personal-invite-name-wrap">
              <p className={`personal-invite-name ${guestNameSizeClass(displayName)}`.trim()}>
                {displayName}
              </p>
            </div>
            <div className="personal-invite-sep" aria-hidden="true">
              <span className="personal-invite-sep-line" />
              <span className="personal-invite-sep-gem">✦</span>
              <span className="personal-invite-sep-line" />
            </div>
            <p className="personal-invite-party-line">
              <span className="personal-invite-party-label">{m.inviteSection.personalValidFor}</span>{" "}
              <span className="personal-invite-party-count">{count}</span>{" "}
              <span className="personal-invite-party-unit">{partyWord}</span>
            </p>
          </div>
        ) : null}
      </div>
    </article>
  );
}

export { partySize as personalInvitePartySize };
