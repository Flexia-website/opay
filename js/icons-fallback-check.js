// Ensure Icon function exists as fallback if icons.js didn't load
if (typeof Icon === 'undefined') {
  window.Icon = function(name, opts) {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + (opts && opts.size || 20) + '" height="' + (opts && opts.size || 20) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>';
  };
}
