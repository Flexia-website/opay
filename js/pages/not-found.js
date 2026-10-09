function renderNotFoundPage(container) {
  const { primaryColor } = Stores.customization.get();
  container.innerHTML = `
  <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f9fafb;">
    <div style="text-align:center;">
      <h1 style="font-size:2.5rem;font-weight:700;margin:0 0 0.5rem;">404</h1>
      <p style="color:#6b7280;margin:0 0 1rem;">Oops! Page not found</p>
      <button id="nf-home" style="color:white;padding:0.5rem 1.25rem;border-radius:9999px;border:none;background:${primaryColor};">Return to Dashboard</button>
    </div>
  </div>`;
  container.querySelector("#nf-home").addEventListener("click", () => navigate("/dashboard"));
}
window.renderNotFoundPage = renderNotFoundPage;
