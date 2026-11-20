export function computeUnits(days, rentalType) {
  switch (rentalType) {
    case 'daily':
      return days;
    case 'weekly':
      return Math.ceil(days / 7);
    case 'monthly':
      return Math.ceil(days / 30);
    default:
      return days;
  }
}

export function computeTotal(price, units, quantity) {
  return units * price * quantity;
}

export function computeDays(startDate, endDate) {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
}
