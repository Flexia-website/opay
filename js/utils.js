// Transaction ID and Receipt ID generation utilities

function generateTransactionId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 24; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateSessionId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'SESS_';
  for (let i = 0; i < 18; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateReceiptId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'RCP_';
  for (let i = 0; i < 16; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Format any number/numeric-string for display: adds thousand-separator
// commas to the integer part and preserves a decimal point + fraction if
// present. Strips any existing ₦ sign or +/- prefix from the input first;
// callers re-add those symbols themselves.
function formatMoney(value) {
  if (value === null || value === undefined) return "0";
  let str = String(value).trim();

  // Strip currency symbol / leading sign, keep track of nothing else needed
  str = str.replace(/^[-+]/, "").replace(/^₦/, "").trim();

  // Keep only digits and a single decimal point
  str = str.replace(/[^0-9.]/g, "");
  const firstDot = str.indexOf(".");
  if (firstDot !== -1) {
    str = str.slice(0, firstDot + 1) + str.slice(firstDot + 1).replace(/\./g, "");
  }

  if (str === "" || str === ".") return "0";

  const parts = str.split(".");
  let intPart = parts[0] || "0";
  const decPart = parts[1];
  intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return decPart !== undefined ? `${intPart}.${decPart}` : intPart;
}

window.generateTransactionId = generateTransactionId;
window.generateSessionId = generateSessionId;
window.generateReceiptId = generateReceiptId;
window.formatMoney = formatMoney;
