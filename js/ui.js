// ---- UI helper functions (vanilla replacements for shadcn/ui components actually used) ----

const UI = {};

// Button: returns HTML string. variant: primary|secondary|outline|ghost|destructive|opay
UI.button = function ({ text, icon, variant = "primary", size = "", id = "", cls = "", disabled = false, attrs = "" }) {
  const sizeCls = size ? `btn-${size}` : "";
  const iconHtml = icon ? Icon(icon, { size: 18 }) : "";
  return `<button ${id ? `id="${id}"` : ""} class="btn btn-${variant} ${sizeCls} ${cls}" ${disabled ? "disabled" : ""} ${attrs}>${iconHtml}${text ? `<span>${text}</span>` : ""}</button>`;
};

// Card
UI.card = function (innerHtml, cls = "") {
  return `<div class="card ${cls}">${innerHtml}</div>`;
};

// Toast system (replaces sonner)
(function initToast() {
  document.addEventListener("DOMContentLoaded", () => {
    if (!document.getElementById("toast-container")) {
      const c = document.createElement("div");
      c.id = "toast-container";
      document.body.appendChild(c);
    }
  });
})();

window.toast = function (message, opts = {}) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }
  const el = document.createElement("div");
  el.className = `toast ${opts.type || ""}`;
  el.textContent = typeof message === "string" ? message : (message.title || "");
  if (message.description) {
    const desc = document.createElement("div");
    desc.style.fontSize = "0.75rem";
    desc.style.opacity = "0.85";
    desc.style.marginTop = "2px";
    desc.textContent = message.description;
    el.appendChild(desc);
  }
  container.appendChild(el);
  setTimeout(() => {
    el.style.transition = "opacity .2s";
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 200);
  }, opts.duration || 3000);
};
toast.success = (msg, opts) => toast(msg, { ...opts, type: "success" });
toast.error = (msg, opts) => toast(msg, { ...opts, type: "error" });

// Dialog / Modal (replaces Radix Dialog)
UI.openDialog = function (contentHtml, opts = {}) {
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  overlay.id = "active-overlay";
  const content = document.createElement("div");
  content.className = "dialog-content";
  content.innerHTML =
    (opts.showClose !== false
      ? `<button class="dialog-close" data-close-dialog>${Icon("x", { size: 18 })}</button>`
      : "") + contentHtml;
  overlay.appendChild(content);
  document.body.appendChild(overlay);

  function close() {
    overlay.remove();
    if (opts.onClose) opts.onClose();
  }
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  content.querySelectorAll("[data-close-dialog]").forEach((btn) =>
    btn.addEventListener("click", close)
  );
  return { close, content };
};

// Bottom Sheet (replaces vaul/Sheet)
UI.openSheet = function (contentHtml, opts = {}) {
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  const content = document.createElement("div");
  content.className = "sheet-content sheet-bottom";
  content.innerHTML = contentHtml;
  overlay.appendChild(content);
  document.body.appendChild(overlay);

  function close() {
    overlay.remove();
    if (opts.onClose) opts.onClose();
  }
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  content.querySelectorAll("[data-close-dialog]").forEach((btn) =>
    btn.addEventListener("click", close)
  );
  return { close, content };
};

// Select dropdown (replaces Radix Select) - basic native-feeling implementation
UI.select = function ({ id, options, value, placeholder = "Select...", onChange }) {
  const wrapper = document.createElement("div");
  wrapper.className = "relative";
  const selected = options.find((o) => o.value === value);
  wrapper.innerHTML = `
    <button type="button" class="input" style="display:flex;align-items:center;justify-content:space-between;cursor:pointer;" id="${id}-trigger">
      <span>${selected ? selected.label : placeholder}</span>
      ${Icon("chevron-down", { size: 16 })}
    </button>
  `;
  const trigger = wrapper.querySelector(`#${id}-trigger`);
  trigger.addEventListener("click", () => {
    const existing = document.getElementById(`${id}-popover`);
    if (existing) {
      existing.remove();
      return;
    }
    const pop = document.createElement("div");
    pop.className = "popover-content";
    pop.id = `${id}-popover`;
    pop.style.width = trigger.offsetWidth + "px";
    pop.style.top = trigger.offsetTop + trigger.offsetHeight + 4 + "px";
    pop.style.left = trigger.offsetLeft + "px";
    pop.innerHTML = options
      .map((o) => `<div class="select-item" data-value="${o.value}">${o.label}</div>`)
      .join("");
    wrapper.appendChild(pop);
    pop.querySelectorAll(".select-item").forEach((item) => {
      item.addEventListener("click", () => {
        onChange(item.dataset.value);
        pop.remove();
      });
    });
    const closeHandler = (e) => {
      if (!wrapper.contains(e.target)) {
        pop.remove();
        document.removeEventListener("click", closeHandler);
      }
    };
    setTimeout(() => document.addEventListener("click", closeHandler), 0);
  });
  return wrapper;
};

// Switch toggle (replaces Radix Switch)
UI.switch = function ({ id, checked, onChange }) {
  return `<button type="button" class="switch" id="${id}" data-checked="${checked}"><span class="switch-thumb"></span></button>`;
};
UI.bindSwitch = function (id, onChange) {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener("click", () => {
    const newVal = el.dataset.checked !== "true";
    el.dataset.checked = String(newVal);
    onChange(newVal);
  });
};

// Simple client-side page transition helper
UI.formatCurrency = function (n) {
  return "₦" + Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

window.UI = UI;
