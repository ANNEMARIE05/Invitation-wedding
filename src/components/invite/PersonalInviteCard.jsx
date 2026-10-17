/** Carte imprimable / WhatsApp — fond fixe, seuls le nom et le nombre de personnes sont ajoutés. */
const SEND_CARD_BG = `${process.env.PUBLIC_URL || ""}/images/carte-invitation-envoi.jpg?v=20261017-stephane-marie`;

const partySize = (guest) => 1 + Number(guest?.accompagnants || 0);

/**
 * @param {{ guest: { nom: string, accompagnants?: number }, testId?: string }} props
 */
export default function PersonalInviteCard({ guest, testId = "personal-invite-card" }) {
  const name = String(guest?.nom || "").trim();
  const count = partySize(guest);

  return (
    <article
      data-testid={testId}
      className="relative mx-auto w-full max-w-[min(100%,480px)] overflow-visible [container-type:inline-size] sm:max-w-[520px]"
    >
      <div className="personal-invite-shell">
        <img
          src={SEND_CARD_BG}
          alt=""
          className="personal-invite-bg"
          aria-hidden
          decoding="async"
          draggable={false}
        />
        <div className="personal-invite-overlay" aria-label={name ? `${name}, ${count} personne(s)` : undefined}>
          {name ? <p className="personal-invite-name">{name}</p> : null}
          <p className="personal-invite-count" aria-hidden={!name}>
            {count}
          </p>
        </div>
      </div>
    </article>
  );
}

export { partySize as personalInvitePartySize };
