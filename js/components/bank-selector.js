// Bank selector modal - used by to-bank transfer page

// Shared, robust <img onerror> handler for bank/CDN logos.
// Retries the load once (helps with transient network hiccups / cold CDN edges),
// then falls back to a neutral building icon instead of leaving a broken image.
function handleBankLogoError(img) {
  const retries = parseInt(img.dataset.retries || "0", 10);
  if (retries < 1) {
    img.dataset.retries = String(retries + 1);
    const src = img.src;
    // Bust any bad cached response and retry shortly after.
    setTimeout(() => {
      img.src = src + (src.includes("?") ? "&" : "?") + "retry=" + Date.now();
    }, 400);
    return;
  }
  const wrap = img.parentElement;
  img.remove();
  if (wrap) {
    wrap.innerHTML = `<span style="color:#00BD6A;display:flex;align-items:center;justify-content:center;width:100%;height:100%;">${Icon('building-2', { size: 18 })}</span>`;
  }
}
window.handleBankLogoError = handleBankLogoError;

function showBankSelector(onSelect) {
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.background = "white";
  overlay.style.zIndex = "1000";
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.overflow = "hidden";

  function bankItemHTML(bank) {
    return `
      <div style="display:flex;align-items:center;gap:1rem;padding:1rem 0;border-bottom:1px solid #f3f4f6;cursor:pointer;transition:background 0.2s;border-radius:0.5rem;" class="bank-item" data-bank="${bank.name}">
        <div class="bank-logo-wrap" style="width:2.75rem;height:2.75rem;border-radius:9999px;background:#f3f4f6;display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;">
          <img src="${bank.logo}" alt="${bank.name}" loading="eager" decoding="async" referrerpolicy="no-referrer" style="width:100%;height:100%;object-fit:contain;padding:4px;box-sizing:border-box;" onerror="handleBankLogoError(this)" />
        </div>
        <div style="flex:1;">
          <p style="font-size:0.9375rem;color:#111827;margin:0;font-weight:500;">${bank.name}</p>
          <p style="font-size:0.75rem;color:#9ca3af;margin:0.25rem 0 0;">Code: ${bank.code}</p>
        </div>
      </div>
    `;
  }

  overlay.innerHTML = `
    <div style="flex-shrink:0;background:white;padding:1rem;border-bottom:1px solid #e5e7eb;">
      <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem;">
        <button id="bank-back" style="background:none;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;">${Icon('x', {size: 20})}</button>
        <h1 style="font-size:1.125rem;font-weight:700;margin:0;">Select Bank</h1>
      </div>
      <input id="bank-search" type="text" placeholder="Search Bank Name" style="width:100%;padding:0.75rem;border:1px solid #e5e7eb;border-radius:0.5rem;font-family:inherit;font-size:0.9375rem;" />
    </div>

    <div style="position:relative;flex:1;min-height:0;">
      <div id="bank-list" style="height:100%;overflow-y:auto;padding:0.5rem 2.5rem 0.5rem 1rem;">
        ${NIGERIAN_BANKS.map(bankItemHTML).join("")}
      </div>

      <div style="position:absolute;right:0.25rem;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;align-items:center;gap:0.15rem;z-index:10;">
        ${['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'].map(letter => `
          <span style="font-size:0.65rem;color:#9ca3af;text-align:center;width:1.1rem;line-height:1.1rem;cursor:pointer;border-radius:0.25rem;" class="letter-jump">${letter}</span>
        `).join("")}
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const searchInput = overlay.querySelector("#bank-search");
  const bankList = overlay.querySelector("#bank-list");

  function bindBankItemEvents() {
    document.querySelectorAll(".bank-item").forEach(item => {
      item.addEventListener("click", () => {
        const bankName = item.getAttribute("data-bank");
        onSelect(bankName);
        overlay.remove();
      });
      item.addEventListener("mouseenter", () => { item.style.background = "#f9fafb"; });
      item.addEventListener("mouseleave", () => { item.style.background = "transparent"; });
    });
  }

  function updateBankList(banks) {
    bankList.innerHTML = banks.map(bankItemHTML).join("");
    bindBankItemEvents();
  }

  bindBankItemEvents();

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = NIGERIAN_BANKS.filter(b =>
      b.name.toLowerCase().includes(query) ||
      b.code.includes(query)
    );
    updateBankList(filtered);
  });

  overlay.querySelector("#bank-back").addEventListener("click", () => overlay.remove());

  document.querySelectorAll(".letter-jump").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const letter = e.target.textContent;
      const banksByLetter = NIGERIAN_BANKS.filter(b => b.name[0].toUpperCase() === letter);
      if (banksByLetter.length > 0) {
        updateBankList(banksByLetter);
        bankList.scrollTop = 0;
      }
    });
    btn.addEventListener("touchstart", () => { btn.style.color = "#00B876"; btn.style.fontWeight = "700"; }, { passive: true });
    btn.addEventListener("touchend", () => { btn.style.color = "#9ca3af"; btn.style.fontWeight = "400"; });
    btn.addEventListener("mouseenter", () => { btn.style.color = "#00B876"; btn.style.fontWeight = "700"; });
    btn.addEventListener("mouseleave", () => { btn.style.color = "#9ca3af"; btn.style.fontWeight = "400"; });
  });
}

window.showBankSelector = showBankSelector;
