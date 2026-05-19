(() => {
  const STORAGE_KEY = 'musso_cookie_consent_v1';
  const ACCEPTED = 'accepted';
  const REJECTED = 'rejected';

  const getConsent = () => {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === ACCEPTED || v === REJECTED ? v : null;
  };

  const setConsent = (value) => {
    localStorage.setItem(STORAGE_KEY, value);
    window.dispatchEvent(new CustomEvent('musso-cookie-consent', { detail: { consent: value } }));
    applyThirdParty(value);
    hideBanner();
  };

  const applyThirdParty = (consent) => {
    const shouldLoad = consent === ACCEPTED;

    const placeholders = Array.from(document.querySelectorAll('[data-cookie-placeholder]'));
    placeholders.forEach(el => {
      el.classList.toggle('hidden', shouldLoad);
    });

    const contents = Array.from(document.querySelectorAll('[data-cookie-content]'));
    contents.forEach(el => {
      el.classList.toggle('hidden', !shouldLoad);
    });

    if (!shouldLoad) return;

    Array.from(document.querySelectorAll('iframe[data-cookie-src]')).forEach(iframe => {
      const src = iframe.getAttribute('data-cookie-src');
      if (!src) return;
      if (iframe.getAttribute('src') === src) return;
      iframe.setAttribute('src', src);
    });

    Array.from(document.querySelectorAll('[data-cookie-script-src]')).forEach(host => {
      const src = host.getAttribute('data-cookie-script-src');
      if (!src) return;
      if (document.querySelector(`script[src="${src}"]`)) return;
      const script = document.createElement('script');
      script.async = true;
      script.src = src;
      document.body.appendChild(script);
    });
  };

  const hideBanner = () => {
    const banner = document.getElementById('cookie-banner');
    if (banner) banner.remove();
  };

  const buildBanner = () => {
    const consent = getConsent();
    if (consent) {
      applyThirdParty(consent);
      return;
    }

    const banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.className = 'fixed inset-x-0 top-0 z-[60] p-4 sm:p-6';
    banner.innerHTML = `
      <div class="max-w-5xl mx-auto bg-anthracite text-white rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        <div class="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <div class="flex-1">
            <div class="text-xs tracking-[0.25em] uppercase text-white/70">Cookie</div>
            <div class="mt-2 text-lg font-extrabold tracking-tight">Preferenze privacy</div>
            <div class="mt-2 text-sm text-white/80 leading-relaxed font-light">
              Usiamo solo cookie tecnici. Contenuti esterni (Google Maps) vengono caricati solo con il tuo consenso.
              <a href="privacy.html" class="underline text-white/90 hover:text-white">Privacy Policy</a>
              &bull;
              <a href="cookie.html" class="underline text-white/90 hover:text-white">Cookie Policy</a>
            </div>
          </div>
          <div class="flex flex-col sm:flex-row gap-3">
            <button type="button" data-cookie-action="reject" class="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 font-semibold">Rifiuta</button>
            <button type="button" data-cookie-action="accept" class="px-5 py-3 rounded-xl bg-construction-red hover:bg-construction-red-light font-semibold">Accetta</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(banner);
    banner.querySelector('[data-cookie-action="accept"]').addEventListener('click', () => setConsent(ACCEPTED));
    banner.querySelector('[data-cookie-action="reject"]').addEventListener('click', () => setConsent(REJECTED));
  };

  document.addEventListener('DOMContentLoaded', () => {
    buildBanner();
    applyThirdParty(getConsent());
  });

  window.mussoCookie = {
    get: getConsent,
    accept: () => setConsent(ACCEPTED),
    reject: () => setConsent(REJECTED)
  };
})();
