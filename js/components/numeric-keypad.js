/**
 * Shared sliding numeric keypad.
 * Slides up from the bottom (half screen height, full width).
 * Tapping the empty space above it (the backdrop) slides it back down.
 * Used for money-amount fields and PIN entry only — text fields keep the native keyboard.
 */
function openNumericKeypad(opts) {
  opts = opts || {};
  const decimal = !!opts.decimal;
  const maxLength = opts.maxLength || null;
  let value = opts.value || "";

  const backdrop = document.createElement("div");
  backdrop.style.cssText = "position:fixed;inset:0;z-index:998;background:rgba(0,0,0,0);transition:background 0.25s ease;pointer-events:none;";

  const panel = document.createElement("div");
  panel.style.cssText =
    "position:fixed;left:0;right:0;bottom:0;height:42vh;width:100%;display:flex;flex-direction:column;background:#fff;box-shadow:0 -2px 12px rgba(0,0,0,0.08);z-index:999;transform:translateY(100%);transition:transform 0.28s cubic-bezier(.22,.8,.28,1);max-width:420px;margin-left:auto;margin-right:auto;";

  function keyBtn(key, label, opts2) {
    opts2 = opts2 || {};
    const hidden = opts2.hidden ? "visibility:hidden;" : "";
    return `<button data-key="${key}" style="font-size:1.75rem;font-weight:400;color:#111827;background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;cursor:pointer;padding:0;width:100%;height:100%;${hidden}">${label}</button>`;
  }

  panel.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:0.875rem 1rem;">
      <div style="display:flex;align-items:center;gap:5px;font-size:0.75rem;color:#374151;">
        <span style="color:var(--opay-primary);display:flex;align-items:center;">${Icon("shield-check", { size: 15, class: "" })}</span>
        <span>OPay Secure Numeric Keypad</span>
      </div>
      <button data-done style="font-size:0.8125rem;color:var(--opay-primary);font-weight:500;background:none;border:none;cursor:pointer;">Done</button>
    </div>
    <div style="flex:1;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(4,1fr);gap:8px;padding:1rem;border-top:none;">
      ${[1, 2, 3].map((n) => keyBtn(n, n, { borderRight: true })).join("")}
      ${keyBtn(4, 4, { borderRight: true })}${keyBtn(5, 5, { borderRight: true })}${keyBtn(6, 6, { borderRight: true })}
      ${keyBtn(7, 7, { borderRight: true })}${keyBtn(8, 8, { borderRight: true })}${keyBtn(9, 9, { borderRight: true })}
      ${decimal ? keyBtn(".", ".", { borderRight: true }) : keyBtn("", "", { borderRight: true, hidden: true })}
      ${keyBtn(0, 0, { borderRight: true })}
      <button data-backspace style="font-size:1.5rem;color:#111827;background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;cursor:pointer;padding:0;display:flex;align-items:center;justify-content:center;width:100%;height:100%;">${Icon("delete", { size: 22, class: "" })}</button>
    </div>`;

  document.body.appendChild(backdrop);
  document.body.appendChild(panel);
  requestAnimationFrame(() => {
    backdrop.style.background = "rgba(0,0,0,0.15)";
    panel.style.transform = "translateY(0)";
  });

  let closed = false;
  function close() {
    if (closed) return;
    closed = true;
    backdrop.style.background = "rgba(0,0,0,0)";
    panel.style.transform = "translateY(100%)";
    setTimeout(() => {
      backdrop.remove();
      panel.remove();
    }, 280);
    if (opts.onClose) opts.onClose(value);
  }

  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) close();
  });
  panel.querySelector("[data-done]").addEventListener("click", (e) => {
    e.preventDefault();
    e.target.blur();
    close();
  });
  panel.querySelectorAll("[data-key]").forEach((btn) => {
    const key = btn.dataset.key;
    if (key === "") return;
    btn.addEventListener("click", () => {
      if (key === "." && value.includes(".")) return;
      if (maxLength && value.replace(".", "").length >= maxLength) return;
      value += key;
      if (opts.onInput) opts.onInput(value);
      if (maxLength && !decimal && value.length === maxLength) {
        setTimeout(() => {
          if (opts.onComplete) opts.onComplete(value);
          close();
        }, 250);
      }
    });
  });
  panel.querySelector("[data-backspace]").addEventListener("click", () => {
    value = value.slice(0, -1);
    if (opts.onInput) opts.onInput(value);
  });

  return { close, setValue: (v) => (value = v) };
}

/**
 * Attaches the sliding numeric keypad to a money-amount input.
 * The input keeps showing a blinking caret but never opens the native keyboard.
 */
function attachAmountKeypad(inputEl, opts) {
  opts = opts || {};
  inputEl.setAttribute("readonly", "readonly");
  inputEl.setAttribute("inputmode", "none");
  inputEl.setAttribute("autocomplete", "off");
  inputEl.style.caretColor = "transparent";

  inputEl.addEventListener("focus", (e) => {
    e.preventDefault();
    if (inputEl._keypadOpen) return;
    if (inputEl._keypadCooldown) return;
    inputEl._keypadOpen = true;

    // Prevent any native keyboard from showing
    inputEl.blur();
    setTimeout(() => {
      openNumericKeypad({
        decimal: opts.decimal !== false,
        value: (inputEl.value || "").replace(/,/g, ""),
        onInput: (v) => {
          inputEl.value = v;
          inputEl.dispatchEvent(new Event("input", { bubbles: true }));
        },
        onClose: () => {
          inputEl._keypadOpen = false;
          // Ignore any focus events that fire in the next moment (e.g. from
          // the Done button's own click/blur cycle) so the keypad doesn't
          // immediately reopen itself.
          inputEl._keypadCooldown = true;
          inputEl.blur();
          setTimeout(() => {
            inputEl._keypadCooldown = false;
          }, 400);
        },
      });
    }, 100);
  });

  inputEl.addEventListener("keydown", (e) => {
    e.preventDefault();
  });
}

window.openNumericKeypad = openNumericKeypad;
window.attachAmountKeypad = attachAmountKeypad;
