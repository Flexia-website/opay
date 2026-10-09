// Mobile Input Focus Manager - handles keyboard interference

const InputFocusManager = {
  activeInput: null,

  // Setup input handlers to keep keyboard open
  setupInputHandlers() {
    const inputs = document.querySelectorAll('input[type="text"], input[type="search"], input[type="number"], textarea, input:not([type])');
    
    inputs.forEach(input => {
      // Keep focus on input while typing
      input.addEventListener('focus', (e) => {
        this.activeInput = e.target;
        this.scrollIntoView(e.target);
        e.target.setAttribute('data-focused', 'true');
      });

      // Prevent blur that closes keyboard
      input.addEventListener('blur', (e) => {
        setTimeout(() => {
          if (this.activeInput === e.target) {
            e.target.focus();
          }
        }, 50);
      });

      // Handle input changes
      input.addEventListener('input', (e) => {
        this.activeInput = e.target;
        e.target.focus();
      });

      // Keep focus on keydown
      input.addEventListener('keydown', (e) => {
        this.activeInput = e.target;
      });

      // Keep focus on keyup
      input.addEventListener('keyup', (e) => {
        this.activeInput = e.target;
        e.target.focus();
        this.scrollIntoView(e.target);
      });
    });
  },

  // Scroll element into view
  scrollIntoView(element) {
    setTimeout(() => {
      const rect = element.getBoundingClientRect();
      if (rect.bottom > window.innerHeight - 300) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, 100);
  },

  // For search inputs specifically
  setupSearchInput(selector) {
    const searchInput = document.querySelector(selector);
    if (!searchInput) return;
    
    searchInput.addEventListener('focus', (e) => {
      e.target.setAttribute('autocomplete', 'off');
      e.target.setAttribute('spellcheck', 'false');
      this.scrollIntoView(e.target);
    });

    searchInput.addEventListener('input', (e) => {
      e.target.focus();
    });

    searchInput.addEventListener('touchstart', (e) => {
      e.target.focus();
    });
  },

  // Initialize on page load
  init() {
    this.setupInputHandlers();
    
    // Reinitialize when DOM changes
    const observer = new MutationObserver(() => {
      this.setupInputHandlers();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: false
    });
  }
};

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => InputFocusManager.init());
} else {
  InputFocusManager.init();
}

window.InputFocusManager = InputFocusManager;
