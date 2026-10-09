function renderQrCodePage(container) {
  const { primaryColor } = Stores.customization.get();
  const currentUrl = window.location.origin + window.location.pathname;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}`;

  container.innerHTML = `
  <div style="min-height:100vh;background:#f9fafb;padding-bottom:4rem;">
    <header style="background:white;padding:0.75rem;display:flex;align-items:center;gap:0.75rem;border-bottom:1px solid hsl(var(--border));">
      <button data-nav-back style="background:none;border:none;">${Icon("arrow-left", { size: 20 })}</button>
      <div class="flex items-center" style="gap:0.5rem;">
        <span style="color:${primaryColor};">${Icon("qr-code", { size: 20 })}</span>
        <h1 style="font-size:1.125rem;font-weight:600;margin:0;">QR Code</h1>
      </div>
    </header>

    <div style="padding:1rem;display:flex;flex-direction:column;gap:1.5rem;">
      <div class="card" style="padding:1.5rem;text-align:center;">
        <h2 style="font-size:1.125rem;font-weight:600;margin:0 0 0.5rem;">Share OPay App</h2>
        <p style="color:#6b7280;font-size:0.875rem;margin:0 0 1.5rem;">Scan this QR code to access the OPay app</p>
        <div class="flex justify-center" style="margin-bottom:1.5rem;">
          <div style="padding:1rem;background:white;border-radius:0.75rem;box-shadow:0 4px 12px rgb(0 0 0 / 0.1);border:1px solid hsl(var(--border));">
            <img src="${qrCodeUrl}" alt="QR Code for OPay App" style="width:12rem;height:12rem;" />
          </div>
        </div>
        <div class="flex justify-center" style="gap:0.75rem;">
          <button id="share-btn" style="display:flex;align-items:center;gap:0.5rem;padding:0.5rem 1rem;border-radius:0.5rem;border:1px solid ${primaryColor};color:${primaryColor};background:white;">${Icon("share", { size: 16 })} Share</button>
          <button id="download-btn" style="display:flex;align-items:center;gap:0.5rem;padding:0.5rem 1rem;border-radius:0.5rem;color:white;border:none;background:${primaryColor};">${Icon("download", { size: 16 })} Download</button>
        </div>
      </div>

      <div class="card" style="padding:1rem;">
        <h3 style="font-weight:600;margin:0 0 0.75rem;">How to use</h3>
        <div style="display:flex;flex-direction:column;gap:0.5rem;font-size:0.875rem;color:#4b5563;">
          <p style="margin:0;">• Open any QR code scanner on your phone</p>
          <p style="margin:0;">• Point the camera at the QR code above</p>
          <p style="margin:0;">• Tap the notification to open the OPay app</p>
          <p style="margin:0;">• Share this code with friends and family</p>
        </div>
      </div>

      <div class="card" style="padding:1rem;">
        <h3 style="font-weight:600;margin:0 0 0.5rem;">App URL</h3>
        <div style="display:flex;align-items:center;gap:0.5rem;padding:0.5rem;background:#f9fafb;border-radius:0.5rem;">
          <span style="font-size:0.875rem;color:#4b5563;flex:1;word-break:break-all;">${currentUrl}</span>
          <button id="copy-url-btn" style="font-size:0.75rem;padding:0.25rem 0.5rem;border-radius:0.25rem;color:white;border:none;background:${primaryColor};">Copy</button>
        </div>
      </div>
    </div>
  </div>`;

  container.querySelector("[data-nav-back]").addEventListener("click", () => navigate("/dashboard"));
  container.querySelector("#share-btn").addEventListener("click", async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "OPay App", text: "Check out this amazing OPay app!", url: currentUrl });
      } catch (e) {}
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      toast.success("Link copied to clipboard!");
    }
  });
  container.querySelector("#download-btn").addEventListener("click", () => {
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = "opay-qr-code.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("QR code downloaded!");
  });
  container.querySelector("#copy-url-btn").addEventListener("click", () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      toast.success("URL copied!");
    }
  });
}

window.renderQrCodePage = renderQrCodePage;
