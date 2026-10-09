import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useI18n } from "@/lib/locale";
import { CardActions, FairePart } from "./InviteCard";

export default function InviteCardModal({
  open,
  onOpenChange,
  guest,
  cardTestId = "personal-invite-card",
  fileName = "ma-carte-invitation.png",
}) {
  const { m } = useI18n();

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

          <CardActions cardTestId={cardTestId} fileName={fileName} className="invite-card-modal-actions" />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
