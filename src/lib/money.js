export function formatBDT(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'BDT',
  }).format(amount);
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
