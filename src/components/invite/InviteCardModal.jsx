import { useEffect, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { toast } from "sonner";
import { deliverInviteCardOnWhatsApp } from "@/lib/invite-card-share";
import { useI18n } from "@/lib/locale";
import { CardActions, captureCard, FairePart } from "./InviteCard";

const firstName = (name) => String(name || "").trim().split(/\s+/)[0] || "";

export default function InviteCardModal({
  open,
  onOpenChange,
  guest,
  cardTestId = "personal-invite-card",
  fileName = "ma-carte-invitation.png",
  autoShareWhenOpen = false,
  onAutoShareDone,
}) {
  const { m } = useI18n();
  const autoShareStarted = useRef(false);

  const shareText = guest ? m.rsvp.waCardShareText(firstName(guest.nom)) : "";
  const selfChatText = m.rsvp.waCardSelfChat;

  useEffect(() => {
    if (!open) {
      autoShareStarted.current = false;
      return;
    }
    if (!autoShareWhenOpen || autoShareStarted.current || !guest?.telephone) return;
    autoShareStarted.current = true;

    let cancelled = false;
    (async () => {
      await new Promise((r) => setTimeout(r, 550));
      if (cancelled) return;

      try {
        const result = await deliverInviteCardOnWhatsApp({
          captureCard,
          cardTestId,
          fileName,
          shareText,
          selfChatText,
          telephone: guest.telephone,
        });
        if (cancelled) return;
        if (result.ok) {
          toast.success(m.inviteSection.shareWhatsAppOk);
        } else {
          toast.message(m.inviteSection.shareWhatsAppErr);
        }
      } catch {
        if (!cancelled) toast.error(m.inviteSection.shareWhatsAppErr);
      } finally {
        if (!cancelled) onAutoShareDone?.();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    open,
    autoShareWhenOpen,
    guest,
    cardTestId,
    fileName,
    shareText,
    selfChatText,
    m.inviteSection.shareWhatsAppOk,
    m.inviteSection.shareWhatsAppErr,
    onAutoShareDone,
  ]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="invite-card-modal-overlay" />
        <Dialog.Content
          className="invite-card-modal-content"
          aria-describedby={undefined}
          data-testid="invite-card-modal"
        >
          <Dialog.Title className="sr-only">{m.inviteSection.cardModalTitle}</Dialog.Title>

          <Dialog.Close
            type="button"
            className="invite-card-modal-close"
            aria-label={m.inviteSection.closeModal}
          >
            <X size={20} strokeWidth={1.75} />
          </Dialog.Close>

          <div className="invite-card-modal-card">
            <FairePart guest={guest} testId={cardTestId} variant="flat" />
          </div>

          <CardActions
            cardTestId={cardTestId}
            fileName={fileName}
            guest={guest}
            className="invite-card-modal-actions"
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
