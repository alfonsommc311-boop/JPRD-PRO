/* Utilidades de las herramientas de JPRD PRO. */
var Tools = {
  esc: function (s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  },
  copy: function (text, btn) {
    function ok() { if (btn) { var t = btn.textContent; btn.textContent = '✓ Copiado'; setTimeout(function () { btn.textContent = t; }, 1400); } }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(ok, fallback); return; }
    } catch (e) {}
    fallback();
    function fallback() {
      var ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); ok(); } catch (e) {}
      document.body.removeChild(ta);
    }
  }
};
