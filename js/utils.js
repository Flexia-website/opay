// Utility helpers
function formatCurrency(n) {
  return '₦' + Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
// formatMoney: used by transaction-history — formats a number with commas, no symbol
function formatMoney(n) {
  return Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function formatDate(d) {
  try { return new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }); }
  catch(e) { return d; }
}
window.formatCurrency = formatCurrency;
window.formatMoney = formatMoney;
window.formatDate = formatDate;
