/**
 * Input Focus Manager
 *
 * Prevents the native keyboard from dismissing when:
 *  - the user taps a button (non-input element) while an input is focused
 *  - icon search or other UI elements steal focus
 *
 * Strategy:
 *  - Mark amount/PIN inputs that SHOULD suppress the native keyboard with
 *    data-custom-keyboard="true". Those are handled by numeric-keypad.js.
 *  - All other <input> and <textarea> elements should keep the keyboard open
 *    normally — we do NOT intercept their focus/blur.
 *  - We only call blur() on an input when the user taps completely outside
 *    any focusable element (i.e. they tap the page background), which is
 *    the standard browser behavior anyway.
 */
(function () {
  'use strict';

  // Track which input currently has focus
  let _activeInput = null;

  document.addEventListener('focusin', function (e) {
    const el = e.target;
    if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) {
      _activeInput = el;
    }
  }, true);

  document.addEventListener('focusout', function (e) {
    // Small delay so we can check where focus went
    setTimeout(function () {
      const nowFocused = document.activeElement;
      if (!nowFocused || (nowFocused.tagName !== 'INPUT' && nowFocused.tagName !== 'TEXTAREA')) {
        _activeInput = null;
      }
    }, 100);
  }, true);

  /**
   * Call this on any button that should NOT steal focus away from a text input.
   * For example, a search icon button beside a text field.
   */
  window.preventFocusLoss = function (buttonEl, callback) {
    if (!buttonEl) return;
    // Use pointerdown (fires before blur) to record the active input, then
    // after the click restore focus to it so the keyboard stays open.
    buttonEl.addEventListener('pointerdown', function (e) {
      // Don't prevent default — we still want the click to fire.
      // Just capture the currently focused input.
      var saved = _activeInput;
      // After the button click (in the next microtask), restore focus.
      Promise.resolve().then(function () {
        if (callback) callback();
        // Restore focus to the input so keyboard doesn't close.
        if (saved && document.body.contains(saved)) {
          saved.focus({ preventScroll: true });
        }
      });
    });
  };

  window.InputFocusManager = {
    getActive: function () { return _activeInput; },
  };
})();
