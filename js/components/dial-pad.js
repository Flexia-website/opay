function renderDialPad(container, { onComplete, pinLength = 4, onCancel, title = "Enter PIN" }) {
  const primaryColor = Stores.customization.get().primaryColor;
  let pin = "";
  let dotsEl = null;

  function updateDots() {
    if (!dotsEl) return;
    dotsEl.innerHTML = Array.from({ length: pinLength })
      .map((_, i) => `<div style="width:0.75rem;height:0.75rem;border-radius:9999px;background:${i < pin.length ? primaryColor : "#e5e7eb"};"></div>`)
      .join("");
  }

  container.innerHTML = `<div style="display:flex;justify-content:center;gap:1rem;padding:1.25rem 0;"></div>`;
  dotsEl = container.querySelector("div");
  updateDots();

  openNumericKeypad({
    decimal: false,
    maxLength: pinLength,
    value: "",
    onInput: (v) => {
      pin = v;
      updateDots();
    },
    onComplete: (v) => onComplete(v),
    onClose: () => {
      if (pin.length < pinLength && onCancel) onCancel();
    },
  });
}

window.renderDialPad = renderDialPad;
