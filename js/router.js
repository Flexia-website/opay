// ---- Minimal hash router ----
const Router = (() => {
  const routes = [];
  let notFoundHandler = null;
  let pendingState = null;
  const root = () => document.getElementById("root");

  function register(path, handler) {
    routes.push({ path, handler });
  }

  function setNotFound(handler) {
    notFoundHandler = handler;
  }

  function navigate(path, state) {
    pendingState = state || null;
    if (location.hash.slice(1) === path) {
      render();
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
    if (!container) return;
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

  // hashchange fires when user navigates via hash; app.js manually calls render() on boot
  window.addEventListener("hashchange", render);

  return { register, setNotFound, navigate, currentPath, render };
})();

window.Router = Router;
window.navigate = Router.navigate;
