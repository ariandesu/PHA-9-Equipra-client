"use client";

export default function BookingForm({
  item,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  quantity,
  setQuantity,
  phone,
  setPhone,
  address,
  setAddress,
  notes,
  setNotes,
  today,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} className="md:col-span-7 flex flex-col gap-4 p-6 sm:p-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-primary">BOOKING REQUEST</p>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Book {item.name}</h2>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <div>
          <label className="block text-xs font-medium text-muted mb-1">Start date</label>
          <input
            type="date"
            min={today}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-[10px] border border-border bg-raised px-3 py-2 text-xs font-mono text-foreground outline-none focus:border-primary"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted mb-1">End date</label>
          <input
            type="date"
            min={startDate || today}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded-[10px] border border-border bg-raised px-3 py-2 text-xs font-mono text-foreground outline-none focus:border-primary"
            required
          />
        </div>
      </div>

      <div className="flex items-center justify-between border-y border-border py-3">
        <span className="text-xs font-medium text-muted">Quantity</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={quantity <= 1}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex size-7 items-center justify-center rounded-md border border-border bg-raised text-foreground disabled:opacity-40"
          >
            −
          </button>
          <span className="font-mono text-sm font-semibold text-foreground w-6 text-center">{quantity}</span>
          <button
            type="button"
            disabled={quantity >= item.quantity}
            onClick={() => setQuantity((q) => Math.min(item.quantity, q + 1))}
            className="flex size-7 items-center justify-center rounded-md border border-border bg-raised text-foreground disabled:opacity-40"
          >
            +
          </button>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-muted mb-1">Contact number</label>
        <input
          type="tel"
          placeholder="+880 1712-345678"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-[10px] border border-border bg-raised px-3 py-2 text-xs font-mono text-foreground outline-none focus:border-primary"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-muted mb-1">Delivery address</label>
        <input
          type="text"
          placeholder="Address in Bangladesh"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full rounded-[10px] border border-border bg-raised px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-muted mb-1">Additional notes</label>
        <textarea
          rows={2}
          placeholder="Access conditions, gate timings, site instructions..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full rounded-[10px] border border-border bg-raised px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
        />
      </div>

      <button type="submit" id="submit-booking-btn" className="hidden">Submit</button>
    </form>
  );
}
