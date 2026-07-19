(() => {
  'use strict';
  const map = Array.isArray(window.LeadBoxQASelectorMap) ? window.LeadBoxQASelectorMap : [];
  const apply = () => {
    map.forEach(({ selector, qa }) => {
      if (!selector || !qa) return;
      document.querySelectorAll(selector).forEach(node => {
        if (!node.hasAttribute('data-qa')) node.setAttribute('data-qa', qa);
      });
    });
  };
  apply();
  new MutationObserver(apply).observe(document.documentElement, { childList: true, subtree: true });
})();
