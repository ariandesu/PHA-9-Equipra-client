"use client";

import Link from "next/link";
import { Check, X, Trash2, ExternalLink, Pencil } from "lucide-react";

export default function AdminEquipmentActions({ item, onStatus, onDelete }) {
  return (
    <div className="flex items-center justify-end gap-1.5">
      <button
        type="button"
        onClick={() => onStatus(item, "approved")}
        disabled={item.status === "approved"}
        aria-label={`Approve ${item.name}`}
        className="flex size-8 items-center justify-center rounded-[8px] border border-success/40 text-success hover:bg-success/10 disabled:opacity-40"
      >
        <Check className="size-3.5" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => onStatus(item, "rejected")}
        disabled={item.status === "rejected"}
        aria-label={`Reject ${item.name}`}
        className="flex size-8 items-center justify-center rounded-[8px] border border-danger/40 text-danger hover:bg-danger/10 disabled:opacity-40"
      >
        <X className="size-3.5" aria-hidden="true" />
      </button>
      <Link
        href={`/dashboard/admin/equipment/${item.id}/edit`}
        aria-label={`Edit ${item.name}`}
        className="flex size-8 items-center justify-center rounded-[8px] border border-border text-muted hover:text-foreground"
      >
        <Pencil className="size-3.5" aria-hidden="true" />
      </Link>
      <Link
        href={`/equipment/${item.id}`}
        aria-label={`View ${item.name}`}
        className="flex size-8 items-center justify-center rounded-[8px] border border-border text-muted hover:text-foreground"
      >
        <ExternalLink className="size-3.5" aria-hidden="true" />
      </Link>
      <button
        type="button"
        onClick={() => onDelete(item)}
        aria-label={`Delete ${item.name}`}
        className="flex size-8 items-center justify-center rounded-[8px] border border-danger/40 text-danger hover:bg-danger/10"
      >
        <Trash2 className="size-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}
