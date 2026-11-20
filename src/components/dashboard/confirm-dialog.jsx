"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  pendingLabel = "Saving…",
  pending = false,
  destructive = false,
  onConfirm,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-surface border-border p-6 rounded-[22px]">
        <DialogTitle className="text-lg font-bold text-foreground">{title}</DialogTitle>
        <DialogDescription className="text-sm text-muted mt-2 leading-relaxed">
          {description}
        </DialogDescription>
        <div className="flex items-center justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={pending}>
            Cancel
          </Button>
          <Button
            variant={destructive ? "primary" : "action"}
            onClick={onConfirm}
            disabled={pending}
            className={destructive ? "bg-danger text-white hover:bg-danger/90" : undefined}
          >
            {pending ? pendingLabel : confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
