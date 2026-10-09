// Bank / network logo badges (small circular icons used on the overlapping logo badge)
const BANK_LOGOS = {
  "GTB": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3E%3Ccircle cx='15' cy='15' r='14' fill='%23FF6600'/%3E%3Ctext x='15' y='19' font-family='Arial' font-weight='900' font-size='9' fill='%23fff' text-anchor='middle'%3EGTB%3C/text%3E%3C/svg%3E",
  "Access Bank": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3E%3Ccircle cx='15' cy='15' r='14' fill='%23D41159'/%3E%3C/svg%3E",
  "First Bank": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3E%3Ccircle cx='15' cy='15' r='14' fill='%231a3365'/%3E%3Cpath d='M10 8 L18 8 L18 11 L13 11 L13 14 L17 14 L17 17 L13 17 L13 22 L10 22 Z' fill='%23f5c722'/%3E%3C/svg%3E",
  "UBA": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3E%3Ccircle cx='15' cy='15' r='14' fill='%23EC1C24'/%3E%3C/svg%3E",
  "Stanbic IBTC": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3E%3Ccircle cx='15' cy='15' r='14' fill='%23003478'/%3E%3C/svg%3E",
  "FCMB": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3E%3Ccircle cx='15' cy='15' r='14' fill='%23004B93'/%3E%3C/svg%3E",
  "Zenith Bank": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3E%3Ccircle cx='15' cy='15' r='14' fill='%23001E6C'/%3E%3C/svg%3E",
  "OPay": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3E%3Ccircle cx='15' cy='15' r='14' fill='%2300cc66'/%3E%3C/svg%3E",
  "MTN": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3E%3Ccircle cx='15' cy='15' r='14' fill='%23FFCC00'/%3E%3Ctext x='15' y='19' font-family='Arial' font-weight='900' font-size='10' fill='%23000' text-anchor='middle' letter-spacing='0.5'%3EMTN%3C/text%3E%3C/svg%3E",
  "Airtel": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3E%3Ccircle cx='15' cy='15' r='14' fill='%23fff'/%3E%3Ccircle cx='15' cy='15' r='14' fill='none' stroke='%23EF2B2D' stroke-width='3'/%3E%3Ctext x='15' y='19' font-family='Arial' font-weight='900' font-size='9' fill='%23EF2B2D' text-anchor='middle'%3EAirtel%3C/text%3E%3C/svg%3E",
  "Glo": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3E%3Ccircle cx='15' cy='15' r='14' fill='%2300A651'/%3E%3Ctext x='15' y='19' font-family='Arial' font-weight='900' font-size='10' fill='%23fff' text-anchor='middle'%3EGlo%3C/text%3E%3C/svg%3E",
  "9Mobile": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3E%3Ccircle cx='15' cy='15' r='14' fill='%23006F3A'/%3E%3Ctext x='15' y='19' font-family='Arial' font-weight='900' font-size='8' fill='%23fff' text-anchor='middle'%3E9mobile%3C/text%3E%3C/svg%3E"
};

// Copy-to-clipboard icon used next to Transaction No. / Session ID rows
const COPY_ICON_SVG = `<svg viewBox="0 0 24 24" width="14" height="14" style="stroke:#aaa;fill:none;stroke-width:2;display:inline-block;vertical-align:middle;margin-left:5px;cursor:pointer;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;

function copyToClipboard(text) {
  try {
    navigator.clipboard.writeText(text);
    toast.success("Copied");
  } catch (e) {
    /* no-op */
  }
}

// formatNumberWithCommas kept as a thin alias for backward compatibility;
// the real logic now lives in the shared window.formatMoney (js/utils.js)
// so every page/component formats amounts identically.
function formatNumberWithCommas(num) {
  return formatMoney(num);
}

function generateTransactionId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 24; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateReceiptId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 20; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function captureAndShareReceipt(elementId, filename = 'receipt') {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      toast.error('Receipt not found');
      return;
    }
    
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 3,
      logging: false,
      useCORS: true,
      allowTaint: true,
      imageTimeout: 0,
      windowHeight: element.scrollHeight,
      windowWidth: element.scrollWidth
    });
    
    canvas.toBlob(async (blob) => {
      if (navigator.share) {
        try {
          const file = new File([blob], `${filename}.png`, { type: 'image/png' });
          await navigator.share({
            files: [file],
            title: 'Receipt',
            text: 'Transaction Receipt'
          });
        } catch (err) {
          // User cancelled or share failed
          downloadImage(canvas, filename);
        }
      } else {
        downloadImage(canvas, filename);
      }
    }, 'image/png');
  } catch (err) {
    console.error('Capture error:', err);
    toast.error('Failed to capture receipt');
  }
}

function downloadImage(canvas, filename) {
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = `${filename}.png`;
  link.click();
}

// The app-wide logo mark: <img logo.png/> + "Pay" text, used everywhere the
// reference designs used a plain "O" + "Pay" wordmark.
function opayWordmark({ imgSize = 24, textSize = "1.375rem" } = {}) {
  return `<span style="display:inline-flex;align-items:center;gap:0.3rem;">` +
    `<img src="./assets/opay-logo.png" alt="" style="width:${imgSize}px;height:${imgSize}px;object-fit:contain;flex-shrink:0;" />` +
    `<span style="color:#151d52;font-size:${textSize};font-weight:700;">Pay</span>` +
    `</span>`;
}

function showTransactionReceipt({ amount, success = true, date, details = [], onClose, title = "Transaction Receipt", footerText, variant = "badge", recipientName, recipientIcon, bank, recipientBank }) {
  const primaryColor = Stores.customization.get().primaryColor;
  const formattedAmount = amount.replace(/^[-+]/, "").replace(/^₦/, "").trim();

  const overlay = document.createElement("div");
  overlay.className = "overlay";
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.background = "#f5f6f8";
  overlay.style.zIndex = "1000";
  overlay.style.overflowY = "auto";
  overlay.style.maxWidth = "100vw";
  overlay.style.width = "100%";
  overlay.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

  const statusColor = success ? "#00cc66" : "#dc2626";

  // Helper: turn a `details` array into <detail-row> markup, matching the
  // reference styling (label left, value right, uppercase bold for names,
  // copy icon for long IDs).
  function detailRows(rows, { copyableLabels = ["Transaction No.", "Session ID"] } = {}) {
    return rows.map((d, i) => {
      const isLast = i === rows.length - 1;
      const isCopyable = copyableLabels.includes(d.label);
      const lines = String(d.value).split("<br/>");
      const isNameRow = lines.length > 1; // "Name<br/>Bank | Account" style rows only
      const valueHtml = lines.map((line, li) => {
        const bold = isNameRow && li === 0;
        return `<span style="font-weight:${bold ? 600 : 400};color:${bold ? '#111' : '#555'};font-size:${bold ? '14px' : '13px'};${bold ? 'text-transform:uppercase;' : ''}display:block;">${line}</span>`;
      }).join("");
      return `
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:${isLast ? '0' : '12px'};font-size:14px;">
          <span style="color:#666;font-weight:400;flex-shrink:0;margin-right:15px;padding-top:2px;">${d.label}</span>
          <div style="text-align:right;max-width:70%;word-break:break-word;">
            ${valueHtml}${isCopyable ? COPY_ICON_SVG : ""}
          </div>
        </div>`;
    }).join("");
  }

  // Decide the logo badge shown on transfer / service styles.
  const isMTN = /^mtn$/i.test(title);
  const isAirtel = /^airtel$/i.test(title);
  const isGlo = /^glo$|^globe$/i.test(title);
  const is9mobile = /^9mobile$/i.test(title);
  const isTelco = isMTN || isAirtel || isGlo || is9mobile;
  const telcoName = isMTN ? "MTN" : isAirtel ? "Airtel" : isGlo ? "Glo" : is9mobile ? "9Mobile" : null;
  const telcoBg = isMTN ? "#FFCC00" : isAirtel ? "#fff" : isGlo ? "#00A651" : is9mobile ? "#006F3A" : "#1a3365";
  const bankName = recipientBank || bank;
  const logoBadgeSrc = isTelco
    ? BANK_LOGOS[telcoName]
    : (BANK_LOGOS[bankName] || recipientIcon || BANK_LOGOS["First Bank"]);

  const logoBadge = `
    <div style="position:absolute;top:0;left:50%;transform:translate(-50%,-50%);width:50px;height:50px;border-radius:50%;display:flex;align-items:center;justify-content:center;background-color:white;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.15);border:2px solid white;flex-shrink:0;">
      ${recipientIcon ? `<img src="${recipientIcon}" style="width:50px;height:50px;object-fit:cover;border-radius:50%;" onerror="this.style.display='none';" />` : `<img src="${logoBadgeSrc}" style="width:50px;height:50px;object-fit:cover;border-radius:50%;" onerror="this.style.display='none';" />`}
    </div>`;

  // ---------------------------------------------------------------------
  // STYLE A — "recipt.html": simple OPay-branded card with watermark,
  // used as the generic/default fallback receipt.
  // ---------------------------------------------------------------------
  function styleA() {
    const watermark = `background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Ctext x='50%25' y='50%25' transform='rotate(-35 60 60)' text-anchor='middle' dominant-baseline='central' font-family='Arial, sans-serif' font-weight='700' font-size='18' fill='%23cccccc' opacity='0.08'%3EPay%3C/text%3E%3C/svg%3E");background-repeat:repeat;background-attachment:fixed;background-position:0 0;`;
    const commaSeparated = formatNumberWithCommas(formattedAmount);
    return `
      <div style="display:flex;align-items:center;padding:15px 20px;background:#fff;gap:10px;">
        <button id="receipt-back" style="background:none;border:none;cursor:pointer;display:flex;align-items:center;color:#333;">${Icon("chevron-left", { size: 22 })}</button>
        <span style="font-size:16px;font-weight:500;color:#222;">Share Receipt</span>
      </div>
      <section style="position:relative;background:#fff;margin:15px;padding:24px 20px 20px;border-radius:16px;border:1px solid #ebebeb;box-shadow:0 4px 10px rgba(0,0,0,0.06);${watermark}" id="receipt-section">
        <div style="position:relative;z-index:1;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
            ${opayWordmark({ imgSize: 22, textSize: "22px" })}
            <div style="color:#333;font-size:14px;font-weight:400;">Transaction Receipt</div>
          </div>
          <div style="text-align:center;font-size:26px;font-weight:700;color:${statusColor};margin-bottom:2px;">₦${commaSeparated}</div>
          <div style="text-align:center;font-size:14px;font-weight:500;color:${statusColor};margin-bottom:6px;">${success ? "Successful" : "Failed"}</div>
          <div style="text-align:center;font-size:12px;color:#666;margin-bottom:20px;">${date || ""}</div>
          <hr style="border:0;border-top:1px solid #f0f0f0;margin:12px 0;">
          ${detailRows(details)}
          <hr style="border:0;border-top:1px dashed #e0e0e0;margin:12px 0;">
          <div style="margin-top:5px;font-size:11px;color:#666;line-height:1.4;letter-spacing:0.2px;">
            ${footerText || `Enjoy a better life with ${"OPay"}. Get free transfers, withdrawals, bill payments, instant loans, and good annual interest on your savings. OPay is licensed by the Central Bank of Nigeria and insured by the NDIC.`}
          </div>
        </div>
      </section>
      <div style="display:flex;justify-content:center;align-items:center;gap:15px;padding:10px 0;">
        <button id="receipt-share-image" style="background:none;border:none;font-size:14px;font-weight:500;color:#333;display:flex;align-items:center;gap:8px;cursor:pointer;padding:8px 12px;">
          <svg viewBox="0 0 24 24" width="18" height="18" style="stroke:${statusColor};fill:none;stroke-width:2;"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 7v10M17 7v10"/></svg>
          Share as image
        </button>
        <div style="width:1px;height:18px;background:#e0e0e0;"></div>
        <button id="receipt-share-pdf" style="background:none;border:none;font-size:14px;font-weight:500;color:#333;display:flex;align-items:center;gap:8px;cursor:pointer;padding:8px 12px;">
          <svg viewBox="0 0 24 24" width="18" height="18" style="stroke:${statusColor};fill:none;stroke-width:2;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          Share as PDF
        </button>
      </div>`;
  }

  // ---------------------------------------------------------------------
  // STYLE B — "transfer.html": overlapping bank logo, progress tracker,
  // used for bank transfers / OPay-to-OPay transfers (variant === "tracker").
  // ---------------------------------------------------------------------
  function styleB() {
    const steps = [
      { label: "Payment<br>successful", time: date || "" },
      { label: "Processing<br>by bank", time: date || "" },
      { label: success ? "Received<br>by bank" : "Failed", time: date || "" },
    ];
    return `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:15px 20px;background:#fff;">
        <div style="display:flex;align-items:center;gap:15px;">
          <button id="receipt-back" style="background:none;border:none;cursor:pointer;display:flex;align-items:center;color:#333;">${Icon("chevron-left", { size: 20 })}</button>
          <span style="font-size:16px;font-weight:500;color:#222;">Transaction Details</span>
        </div>
        <span style="color:${statusColor};display:flex;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></span>
      </div>
      <div style="position:relative;overflow:visible;background:#fff;margin:15px;padding:20px;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.04);">
        ${logoBadge}
        <div style="text-align:center;margin-top:25px;margin-bottom:10px;font-weight:500;font-size:16px;">${title || `Transfer to ${recipientName || "Recipient"}`}</div>
        <div style="text-align:center;font-size:32px;font-weight:700;letter-spacing:0.5px;color:#000;">₦${formatMoney(formattedAmount)}</div>
        <div style="color:${statusColor};text-align:center;font-weight:500;margin-top:5px;font-size:15px;display:flex;justify-content:center;align-items:center;gap:6px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg> ${success ? "Successful" : "Failed"}
        </div>
        <div style="display:flex;justify-content:space-between;margin:25px 0 0;position:relative;padding:0 15px;">
          <div style="position:absolute;top:10px;left:15px;right:15px;height:2px;background:${statusColor};z-index:0;"></div>
          ${steps.map(step => `
            <div style="display:flex;flex-direction:column;align-items:center;z-index:1;width:60px;text-align:center;">
              <div style="width:20px;height:20px;background:${statusColor};border-radius:50%;display:flex;align-items:center;justify-content:center;margin-bottom:5px;">
                <svg viewBox="0 0 24 24" width="12" height="12" style="fill:none;stroke:#fff;stroke-width:3;"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div style="font-size:11px;font-weight:600;color:#1a1a1a;margin-bottom:2px;line-height:1.1;">${step.label}</div>
              <div style="font-size:10px;color:#666;">${step.time}</div>
            </div>`).join("")}
        </div>
        <div style="background:#f4f6f8;border-radius:8px;padding:12px;margin-top:15px;font-size:11px;color:#555;text-align:center;line-height:1.4;">The recipient account is expected to be credited within 5 minutes, subject to notification by the bank.</div>
      </div>
      <div style="background:#fff;margin:15px;padding:20px;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.04);">
        <div style="font-size:15px;font-weight:600;margin-bottom:15px;">Transaction Details</div>
        ${detailRows(details)}
      </div>
      <div style="background:#fff;margin:15px;padding:20px;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.04);">
        <div style="font-size:15px;font-weight:600;margin-bottom:15px;">More Actions</div>
        <div style="display:flex;align-items:center;gap:10px;font-weight:500;color:${statusColor};font-size:14px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg> Transfer Again
        </div>
      </div>
      <div style="display:flex;gap:10px;padding:0 15px;margin:15px 0 30px;justify-content:center;">
        <button id="receipt-report" style="flex:1;padding:14px 20px;border-radius:50px;font-weight:600;font-size:15px;border:none;cursor:pointer;background:#e6f9ef;color:${statusColor};">Report Issue</button>
        <button id="receipt-done" style="flex:1;padding:14px 20px;border-radius:50px;font-weight:600;font-size:15px;border:none;cursor:pointer;background:${statusColor};color:#fff;">Share Receipt</button>
      </div>`;
  }

  // ---------------------------------------------------------------------
  // STYLE C — "airtime.html": overlapping telco logo, cost breakdown,
  // used for airtime / data / bill-style purchases (telco titles, or
  // any generic non-transfer purchase).
  // ---------------------------------------------------------------------
  function styleC() {
    // Split details into "breakdown" rows (Amount / Cashback / Voucher / Amount Paid / Bonus)
    // vs the rest which go in the plain Transaction Details card, matching the reference.
    const breakdownLabels = ["Amount", "Cashback Used", "Cashback to Use", "Voucher Used", "Amount Paid", "From Balance", "Cashback Earned", "OPay Bonus"];
    const breakdown = details.filter(d => breakdownLabels.includes(d.label));
    const rest = details.filter(d => !breakdownLabels.includes(d.label));

    const breakdownHtml = breakdown.length > 0 ? `
      <div style="margin-top:15px;border-top:1px solid #f0f0f0;padding-top:15px;">
        ${breakdown.map(d => {
          const isBonus = /bonus|cashback earned/i.test(d.label);
          return `<div style="display:flex;justify-content:space-between;font-size:14px;padding:6px 0;">
            <span style="color:#666;">${d.label}</span>
            <span style="font-weight:500;color:${isBonus ? statusColor : '#1a1a1a'};">${d.value}</span>
          </div>`;
        }).join("")}
      </div>` : "";

    return `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:15px 20px;background:#fff;">
        <div style="display:flex;align-items:center;gap:15px;">
          <button id="receipt-back" style="background:none;border:none;cursor:pointer;display:flex;align-items:center;color:#333;">${Icon("chevron-left", { size: 20 })}</button>
          <span style="font-size:16px;font-weight:500;color:#222;">Transaction Details</span>
        </div>
        <span style="color:${statusColor};display:flex;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></span>
      </div>
      <div style="position:relative;overflow:visible;background:#fff;margin:15px;padding:20px;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.04);">
        ${logoBadge}
        <div style="text-align:center;margin-top:25px;margin-bottom:10px;font-weight:500;font-size:16px;">${title || "Purchase"}</div>
        <div style="text-align:center;font-size:32px;font-weight:700;letter-spacing:0.5px;color:#000;">₦${formatMoney(formattedAmount)}</div>
        <div style="color:${statusColor};text-align:center;font-weight:500;margin-top:5px;font-size:15px;display:flex;justify-content:center;align-items:center;gap:6px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg> ${success ? "Successful" : "Failed"}
        </div>
        ${breakdownHtml}
      </div>
      <div style="background:#fff;margin:15px;padding:20px;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.04);">
        <div style="font-size:15px;font-weight:600;margin-bottom:15px;">Transaction Details</div>
        ${detailRows(rest)}
      </div>
      <div style="display:flex;gap:10px;padding:0 15px;margin:15px 0 30px;justify-content:center;">
        <button id="receipt-report" style="flex:1;padding:14px 20px;border-radius:50px;font-weight:600;font-size:15px;border:none;cursor:pointer;background:#e6f9ef;color:${statusColor};">Report Issue</button>
        <button id="receipt-done" style="flex:1;padding:14px 20px;border-radius:50px;font-weight:600;font-size:15px;border:none;cursor:pointer;background:${statusColor};color:#fff;">Share Receipt</button>
      </div>`;
  }

  // Choose which style to render based on what the caller passed:
  //  - variant === "tracker"  -> Style B (bank/OPay transfer with progress bar)
  //  - telco title or has a cost breakdown -> Style C (airtime/data/bills)
  //  - everything else (default) -> Style A (simple branded receipt)
  const hasBreakdownFields = details.some(d => ["Cashback Used", "Cashback Earned", "Amount Paid", "OPay Bonus", "Cashback to Use"].includes(d.label));
  let bodyHtml;
  let usesReportDone = false;
  if (variant === "tracker") {
    bodyHtml = styleB();
    usesReportDone = true;
  } else if (isTelco || hasBreakdownFields) {
    bodyHtml = styleC();
    usesReportDone = true;
  } else {
    bodyHtml = styleA();
  }

  overlay.innerHTML = bodyHtml;
  overlay.setAttribute("data-overlay", "true");
  document.body.appendChild(overlay);

  const close = () => {
    overlay.remove();
    if (onClose) onClose();
  };

  const backBtn = overlay.querySelector("#receipt-back");
  if (backBtn) backBtn.addEventListener("click", close);

  // Wire up copy-to-clipboard on every copy icon
  overlay.querySelectorAll(".copy-row-icon, svg").forEach(() => {}); // no-op placeholder, real binding below
  overlay.querySelectorAll("[data-copy-value]").forEach(el => {
    el.addEventListener("click", () => copyToClipboard(el.getAttribute("data-copy-value")));
  });

  if (usesReportDone) {
    const reportBtn = overlay.querySelector("#receipt-report");
    const doneBtn = overlay.querySelector("#receipt-done");
    if (reportBtn) reportBtn.addEventListener("click", () => toast.success("Issue reported. Our team will review this transaction."));
    if (doneBtn) doneBtn.addEventListener("click", () => {
      showShareReceipt({ amount: formattedAmount, success, date, details, variant, title });
    });
  } else {
    const shareImgBtn = overlay.querySelector("#receipt-share-image");
    const sharePdfBtn = overlay.querySelector("#receipt-share-pdf");
    if (shareImgBtn) shareImgBtn.addEventListener("click", () => {
      captureAndShareReceipt('receipt-section', title || 'receipt');
    });
    if (sharePdfBtn) sharePdfBtn.addEventListener("click", () => showShareReceipt({ amount: formattedAmount, success, date, details, variant, title }));
  }
}

function showShareReceipt({ amount, success, date, details = [], title = "Transaction Receipt" }) {
  const primaryColor = Stores.customization.get().primaryColor;
  const formattedShareAmount = formatNumberWithCommas(String(amount).replace(/^[-+]/, "").replace(/^₦/, "").trim());
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.background = "#f9fafb";
  overlay.style.zIndex = "1100";
  overlay.style.overflowY = "auto";

  function renderDetailValue(value) {
    return String(value).split("<br/>").join("<br/>");
  }

  const watermarkTile = `<span style="display:inline-flex;align-items:center;gap:0.2rem;min-width:6rem;justify-content:center;padding:1.1rem 0.75rem;"><img src="./assets/opay-logo.png" alt="" style="width:14px;height:14px;object-fit:contain;opacity:0.9;" /><span style="color:${primaryColor};font-weight:800;font-size:0.9375rem;">Pay</span></span>`;
  const watermarkRows = Array.from({ length: 9 })
    .map((_, row) => `
      <div style="display:flex;white-space:nowrap;margin-left:${row % 2 === 0 ? '-2rem' : '-4rem'};">
        ${Array.from({ length: 6 }).map(() => watermarkTile).join("")}
      </div>`).join("");

  const watermarkHtml = `
    <div style="position:absolute;top:-10%;left:-10%;width:130%;height:130%;opacity:0.045;pointer-events:none;overflow:hidden;transform:rotate(-28deg);z-index:0;">
      ${watermarkRows}
    </div>`;

  overlay.innerHTML = `
    <header style="background:white;padding:0.875rem 1rem;display:flex;align-items:center;font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;border-bottom:none;position:relative;z-index:10;">
      <button id="share-back" style="background:none;border:none;color:#111827;display:flex;align-items:center;gap:0.75rem;">
        ${Icon("chevron-left", { size: 22 })}
        <span style="font-size:1.0625rem;font-weight:600;color:#111827;">Share Receipt</span>
      </button>
    </header>

    <div style="padding:1.5rem 1rem;margin-top:0.5rem;position:relative;z-index:1;min-height:calc(100vh - 8rem);">
      <div id="receipt-capture" style="position:relative;background:white;border-radius:1rem;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);z-index:1;padding:2rem 1.25rem;">
        ${watermarkHtml}
        <div style="position:relative;z-index:2;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2rem;">
            <div style="display:flex;align-items:center;gap:0.4rem;">
              <img src="./assets/opay-logo.png" alt="logo" style="width:28px;height:28px;object-fit:contain;flex-shrink:0;" />
              <span style="font-size:1.5rem;font-weight:900;color:#1C1D37;letter-spacing:-0.02em;">Pay</span>
            </div>
            <span style="font-size:0.9375rem;color:#6b7280;font-weight:500;">Transaction Receipt</span>
          </div>

          <div style="text-align:center;margin-bottom:2rem;">
            <div style="font-size:2.5rem;font-weight:800;color:${primaryColor};margin-bottom:0.5rem;letter-spacing:-0.01em;">₦${formattedShareAmount}</div>
            <div style="font-size:1.0625rem;color:#111827;margin-bottom:0.5rem;font-weight:600;">${success ? "Successful" : "Failed"}</div>
            <div style="font-size:0.875rem;color:#9ca3af;">${date}</div>
          </div>

          <div style="border-top:1px solid #e5e7eb;border-bottom:1px solid #e5e7eb;padding:1.5rem 0;margin-bottom:1.5rem;">
            ${details.slice(0, 2).length > 0 ? `
              <div style="margin-bottom:${details.length > 2 ? '1.5rem' : '0'};">
                ${details.slice(0, 2).map((d, i) => `
                  <div style="display:flex;justify-content:space-between;align-items:flex-start;padding:${i > 0 ? '0.75rem 0' : '0'};${i < details.slice(0, 2).length - 1 ? 'border-bottom:1px solid #f3f4f6;' : ''}">
                    <span style="font-size:0.8125rem;color:#6b7280;font-weight:500;">${d.label}</span>
                    <span style="font-size:0.9375rem;color:#111827;font-weight:700;text-align:right;max-width:55%;">${renderDetailValue(d.value)}</span>
                  </div>
                `).join('')}
              </div>
            ` : ''}
            
            ${details.length > 2 ? `
              <div>
                ${details.slice(2).map((d, i) => `
                  <div style="display:flex;justify-content:space-between;align-items:flex-start;padding:0.75rem 0;${i < details.slice(2).length - 1 ? 'border-bottom:1px solid #f3f4f6;' : ''}">
                    <span style="font-size:0.8125rem;color:#6b7280;font-weight:500;">${d.label}</span>
                    <span style="font-size:0.8125rem;color:#111827;font-weight:600;text-align:right;font-family:monospace;">${renderDetailValue(d.value)}</span>
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>

          <div style="font-size:0.75rem;color:#9ca3af;line-height:1.6;text-align:center;">
            Enjoy a better life with <img src="./assets/opay-logo.png" alt="" style="width:11px;height:11px;object-fit:contain;vertical-align:-1px;display:inline-block;" />Pay. Get free transfers, withdrawals, bill payments, instant loans, and good annual interest on your savings. <img src="./assets/opay-logo.png" alt="" style="width:11px;height:11px;object-fit:contain;vertical-align:-1px;display:inline-block;" />Pay is licensed by the Central Bank of Nigeria and insured by the NDIC.
          </div>
        </div>
      </div>
    </div>

    <div style="padding:1.5rem 1rem 2rem;display:flex;gap:1rem;justify-content:center;">
      <button id="share-as-image" style="background:none;border:1px solid ${primaryColor}33;display:flex;align-items:center;justify-content:center;gap:0.5rem;color:${primaryColor};font-weight:600;font-size:0.875rem;cursor:pointer;padding:0.75rem 1.5rem;border-radius:0.5rem;">
        ${Icon("image", { size: 16 })} Share as image
      </button>
      <button id="share-as-pdf" style="background:none;border:1px solid ${primaryColor}33;display:flex;align-items:center;justify-content:center;gap:0.5rem;color:${primaryColor};font-weight:600;font-size:0.875rem;cursor:pointer;padding:0.75rem 1.5rem;border-radius:0.5rem;">
        ${Icon("file-text", { size: 16 })} Share as PDF
      </button>
    </div>
    <div style="height:1rem;"></div>`;

  document.body.appendChild(overlay);

  overlay.querySelector("#share-back").addEventListener("click", () => overlay.remove());
  overlay.querySelector("#share-as-image").addEventListener("click", () => {
    downloadReceiptAsImage(overlay.querySelector("#receipt-capture"));
  });
  overlay.querySelector("#share-as-pdf").addEventListener("click", () => {
    printReceiptAsPdf(overlay.querySelector("#receipt-capture"));
  });
}

function downloadReceiptAsImage(node) {
  try {
    const rect = node.getBoundingClientRect();
    const scale = 2;
    const svgHtml = new XMLSerializer().serializeToString(
      (() => {
        const wrapper = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        wrapper.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        wrapper.setAttribute("width", rect.width);
        wrapper.setAttribute("height", rect.height);
        const fo = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
        fo.setAttribute("width", "100%");
        fo.setAttribute("height", "100%");
        const clonedNode = node.cloneNode(true);
        clonedNode.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
        fo.appendChild(clonedNode);
        wrapper.appendChild(fo);
        return wrapper;
      })()
    );
    const svgBlob = new Blob([svgHtml], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = rect.width * scale;
      canvas.height = rect.height * scale;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0, rect.width, rect.height);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => {
        if (!blob) {
          toast.error("Could not generate image");
          return;
        }
        const dlUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = dlUrl;
        a.download = `opay-receipt-${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(dlUrl);
        toast.success("Receipt image downloaded");
      });
    };
    img.onerror = () => toast.error("Could not generate image on this device");
    img.src = url;
  } catch (e) {
    toast.error("Could not generate image on this device");
  }
}

function printReceiptAsPdf(node) {
  const printWindow = window.open("", "_blank", "width=420,height=720");
  if (!printWindow) {
    toast.error("Please allow pop-ups to share as PDF");
    return;
  }
  printWindow.document.write(`
    <html>
      <head>
        <title>OPay Receipt</title>
        <style>
          body { margin: 0; padding: 1.5rem; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: white; }
        </style>
      </head>
      <body>${node.outerHTML}</body>
    </html>`);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 300);
}

function showPinModal({ amount, recipientLabel, onConfirm, onCancel }) {
  const primaryColor = Stores.customization.get().primaryColor;
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.padding = "1rem";
  overlay.innerHTML = `
    <div style="background:white;border-radius:0.75rem;padding:1rem;width:100%;max-width:20rem;position:relative;z-index:101;">
      <h3 style="font-size:1.125rem;font-weight:600;margin:0 0 1rem;">Enter Transaction PIN</h3>
      <p style="font-size:0.875rem;color:#6b7280;margin:0 0 1rem;">You are about to transfer ₦${formatMoney(amount)} to ${recipientLabel}</p>
      <div style="position:relative;margin-bottom:1rem;">
        <div style="display:flex;gap:0.5rem;justify-content:center;">
          <div style="width:2.5rem;height:2.5rem;border-radius:0.5rem;border:2px solid #d1d5db;display:flex;align-items:center;justify-content:center;font-size:1.25rem;color:transparent;font-weight:700;" data-pin-digit="1">•</div>
          <div style="width:2.5rem;height:2.5rem;border-radius:0.5rem;border:2px solid #d1d5db;display:flex;align-items:center;justify-content:center;font-size:1.25rem;color:transparent;font-weight:700;" data-pin-digit="2">•</div>
          <div style="width:2.5rem;height:2.5rem;border-radius:0.5rem;border:2px solid #d1d5db;display:flex;align-items:center;justify-content:center;font-size:1.25rem;color:transparent;font-weight:700;" data-pin-digit="3">•</div>
          <div style="width:2.5rem;height:2.5rem;border-radius:0.5rem;border:2px solid #d1d5db;display:flex;align-items:center;justify-content:center;font-size:1.25rem;color:transparent;font-weight:700;" data-pin-digit="4">•</div>
        </div>
        <input id="pin-input" type="hidden" maxlength="4" style="position:absolute;opacity:0;pointer-events:none;" />
      </div>
      <div class="flex" style="gap:0.5rem;">
        <button id="pin-cancel" style="flex:1;padding:0.5rem;border:1px solid hsl(var(--border));border-radius:0.5rem;background:white;font-weight:600;">Cancel</button>
        <button id="pin-confirm" style="flex:1;padding:0.5rem;border-radius:0.5rem;color:white;border:none;background:${primaryColor};font-weight:600;">Confirm</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  const pinInput = overlay.querySelector("#pin-input");
  let pinValue = "";
  
  overlay.querySelector("#pin-cancel").addEventListener("click", () => {
    overlay.remove();
    if (onCancel) onCancel();
  });
  
  overlay.querySelector("#pin-confirm").addEventListener("click", () => {
    if (pinValue !== "0803") {
      alert("Incorrect PIN");
      pinValue = "";
      updatePinDisplay();
      return;
    }
    overlay.remove();
    onConfirm();
  });
  
  function updatePinDisplay() {
    overlay.querySelectorAll("[data-pin-digit]").forEach((el, i) => {
      el.textContent = i < pinValue.length ? "•" : "";
    });
  }
  
  openNumericKeypad({
    decimal: false,
    maxLength: 4,
    value: pinValue,
    onInput: (v) => {
      pinValue = v;
      updatePinDisplay();
    },
    onComplete: (v) => {
      pinValue = v;
      updatePinDisplay();
    },
    onClose: () => {}
  });
}

function showTransferProgress() {
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.innerHTML = `
    <div style="padding:1.5rem;border-radius:9999px;background:rgba(255,255,255,0.1);backdrop-filter:blur(8px);">
      ${Icon("send", { size: 64, class: "animate-pulse" })}
    </div>
    <p style="color:white;margin-top:1rem;font-weight:500;">Sending money...</p>`;
  overlay.querySelectorAll("svg").forEach((s) => (s.style.color = "white"));
  document.body.appendChild(overlay);
  return () => overlay.remove();
}

function showConfirmationModal({ title, amount, details = [], onConfirm, onCancel, icon = "check-circle" }) {
  const primaryColor = Stores.customization.get().primaryColor;
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.padding = "1rem";
  overlay.style.zIndex = "1000";
  
  const detailsHtml = details.map(d => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:0.75rem 0;border-bottom:1px solid #f0f0f0;">
      <span style="font-size:0.875rem;color:#6b7280;">${d.label}</span>
      <span style="font-size:0.875rem;font-weight:600;color:#111827;">${d.value}</span>
    </div>
  `).join("");
  
  overlay.innerHTML = `
    <div style="background:white;border-radius:1rem;padding:1.5rem;width:100%;max-width:22rem;box-shadow:0 10px 40px rgba(0,0,0,0.15);">
      <div style="text-align:center;margin-bottom:1.5rem;">
        <div style="width:3rem;height:3rem;border-radius:9999px;background:#f0fdf4;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;color:${primaryColor};">
          ${Icon(icon, { size: 24 })}
        </div>
        <h2 style="font-size:1rem;font-weight:700;margin:0 0 0.5rem;color:#111827;">${title}</h2>
        <div style="font-size:2rem;font-weight:800;color:#111827;margin-bottom:0.5rem;letter-spacing:-0.01em;">₦${formatMoney(amount)}</div>
      </div>
      <div style="background:#f9fafb;border-radius:0.75rem;padding:1rem;margin-bottom:1.5rem;max-height:10rem;overflow-y:auto;">
        ${detailsHtml || '<p style="text-align:center;color:#9ca3af;font-size:0.875rem;margin:0;">Review details carefully before confirming</p>'}
      </div>
      <div class="flex" style="gap:0.75rem;">
        <button id="confirm-cancel" style="flex:1;padding:0.75rem;border:1.5px solid #d1d5db;border-radius:0.75rem;background:white;font-weight:600;font-size:0.9375rem;cursor:pointer;color:#111827;">Cancel</button>
        <button id="confirm-proceed" style="flex:1;padding:0.75rem;border-radius:0.75rem;color:white;border:none;background:${primaryColor};font-weight:600;font-size:0.9375rem;cursor:pointer;">Continue to PIN</button>
      </div>
    </div>`;
  
  document.body.appendChild(overlay);
  
  overlay.querySelector("#confirm-cancel").addEventListener("click", () => {
    overlay.remove();
    if (onCancel) onCancel();
  });
  
  overlay.querySelector("#confirm-proceed").addEventListener("click", () => {
    overlay.remove();
    if (onConfirm) onConfirm();
  });
}

window.showTransactionReceipt = showTransactionReceipt;
window.showShareReceipt = showShareReceipt;
window.showConfirmationModal = showConfirmationModal;
window.showPinModal = showPinModal;
window.showTransferProgress = showTransferProgress;
