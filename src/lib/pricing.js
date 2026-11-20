const MS_PER_DAY = 86400000;

export function computeDays(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const startUtc = Date.UTC(
    start.getUTCFullYear(),
    start.getUTCMonth(),
    start.getUTCDate()
  );
  const endUtc = Date.UTC(
    end.getUTCFullYear(),
    end.getUTCMonth(),
    end.getUTCDate()
  );
  return Math.round((endUtc - startUtc) / MS_PER_DAY) + 1;
}

export function computeUnits(days, rentalType) {
  if (rentalType === 'weekly') return Math.ceil(days / 7);
  if (rentalType === 'monthly') return Math.ceil(days / 30);
  return days;
}

export function computeTotal(price, units, quantity) {
  return units * price * quantity;
}

export function quoteBooking({ startDate, endDate, rentalType, price, quantity }) {
  const days = computeDays(startDate, endDate);
  const units = computeUnits(days, rentalType);
  const totalAmount = computeTotal(price, units, quantity);
  return { days, units, totalAmount };
}
