// ---- Minimal hash router (replaces react-router-dom for a static, no-build app) ----
// Routes are registered as { path: renderFn }. renderFn(container, params) must render into container.
const Router = (() => {
  const routes = [];
  let notFoundHandler = null;
  let pendingState = null;
  const root = () => document.getElementById("root");

  function register(path, handler) {
    // convert "/safebox/deposit" style paths (no params in this app) to exact match
    routes.push({ path, handler });
  }

  function setNotFound(handler) {
    notFoundHandler = handler;
  }

  function navigate(path, state) {
    pendingState = state || null;
    if (location.hash.slice(1) === path) {
      render(); // force re-render even if same path
    } else {
      location.hash = path;
    }
  }

  function currentPath() {
    const hash = location.hash.slice(1);
    return hash === "" ? "/" : hash;
  }

  function render() {
    const path = currentPath();
    const container = root();
    container.innerHTML = "";
    window.scrollTo(0, 0);

    const state = pendingState;
    pendingState = null;

    const match = routes.find((r) => r.path === path);
    if (match) {
      match.handler(container, state);
    } else if (notFoundHandler) {
      notFoundHandler(container);
    } else {
      container.innerHTML = "<p>Not found</p>";
    }
  }

  window.addEventListener("hashchange", render);
  window.addEventListener("DOMContentLoaded", render);

  return { register, setNotFound, navigate, currentPath, render };
})();

window.Router = Router;
window.navigate = Router.navigate; // convenience global, mirrors useNavigate()
