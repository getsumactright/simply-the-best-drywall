/* Simply The Best Drywall: site behaviour. No dependencies.
 *
 * Header     [data-top]        turns solid once the page scrolls.
 * Switcher   [data-chips]      crossfades the hero texture and updates its caption.
 * Compare    [data-compare]    before/after slider driven by a native range input.
 * Reveal     [data-reveal]     adds .is-in as an element enters the viewport.
 * Loops      video[data-loop]  plays only while on screen.
 * Form       form[data-form]   posts JSON to its data-endpoint; with no endpoint set,
 *                              falls back to a pre-filled text message to Ray.
 *
 * Everything respects prefers-reduced-motion.
 */
(function () {
  const root = document.documentElement;
  root.classList.add('js');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Header ---------- */
  function initHeader() {
    const top = document.querySelector('[data-top]');
    if (!top) return;
    const solid = () => top.classList.toggle('is-solid', scrollY > 8);
    addEventListener('scroll', solid, { passive: true });
    solid();
  }

  /* ---------- Texture switcher ---------- */
  const TEXTURES = {
    knockdown: ['Knockdown', 'Splatter flattened with a knife before it dries.'],
    orange: ['Orange peel', 'Fine, even spray, like the skin of an orange.'],
    skip: ['Skip trowel', 'Hand-made crescents from a curved trowel.'],
    imperfect: ['Imperfect smooth', 'Troweled by hand. Ray’s bathroom retexture.'],
    smooth: ['Smooth', 'A skim coat sanded flat. Nothing to hide a patch.'],
    popcorn: ['Popcorn', 'The old acoustic ceiling Ray scrapes off and resprays.']
  };

  function initSwitcher() {
    const imgs = document.querySelectorAll('[data-media] img');
    const now = document.querySelector('[data-now]');
    if (!imgs.length || !now) return;
    document.querySelectorAll('[data-chips] input').forEach(input => {
      input.addEventListener('change', () => {
        const img = [...imgs].find(i => i.dataset.tex === input.value);
        if (img && img.loading === 'lazy') img.loading = 'eager';
        imgs.forEach(i => i.classList.toggle('is-on', i === img));
        const [name, line] = TEXTURES[input.value];
        now.querySelector('b').textContent = name;
        now.querySelector('span').textContent = line;
      });
    });
  }

  /* ---------- Compare ---------- */
  function initCompare() {
    document.querySelectorAll('[data-compare]').forEach(fig => {
      const input = fig.querySelector('input[type="range"]');
      const set = v => {
        fig.style.setProperty('--pos', v + '%');
        input.setAttribute('aria-valuetext', `${Math.round(v)}% before`);
      };
      set(input.value);
      input.addEventListener('input', () => { fig.dataset.touched = '1'; set(input.value); });

      if (reduce.matches || !('IntersectionObserver' in window)) return;
      const io = new IntersectionObserver(entries => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        const start = performance.now(), from = Number(input.value);
        const hint = t => {
          if (fig.dataset.touched) return;
          const k = Math.min((t - start) / 2200, 1);
          const v = from + Math.sin(k * Math.PI * 2) * 18 * (1 - k);
          input.value = v;
          set(v);
          if (k < 1) requestAnimationFrame(hint);
        };
        setTimeout(() => requestAnimationFrame(hint), 500);
      }, { threshold: 0.7 });
      io.observe(fig);
    });
  }

  /* ---------- Reveal ---------- */
  function initReveal() {
    const els = document.querySelectorAll('[data-reveal]');
    if (reduce.matches || !('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    els.forEach(el => io.observe(el));
  }

  /* ---------- Loops: play only while on screen; never under reduced motion ---------- */
  function initVideo() {
    document.querySelectorAll('video[data-loop]').forEach(v => {
      if (reduce.matches) { v.pause(); v.controls = true; return; }
      const io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      }, { threshold: 0.25 });
      io.observe(v);
    });
  }

  /* ---------- Contact form ---------- */
  const TEXT_NUMBER = '+19162891026';

  function initForm() {
    const form = document.querySelector('form[data-form]');
    if (!form) return;
    const status = form.querySelector('[data-form-status]');
    const button = form.querySelector('button[type="submit"]');
    const say = (msg, isError) => {
      status.textContent = msg;
      status.classList.toggle('is-error', !!isError);
    };

    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (!form.reportValidity()) return;

      const data = Object.fromEntries(new FormData(form));
      if (data.company) return; // honeypot: bots fill it, people never see it

      const endpoint = form.dataset.endpoint;
      if (!endpoint) {
        // No form service connected yet: hand the details to the phone's Messages app.
        const body = `Hi Ray, this is ${data.first} ${data.last} (${data.phone}). ${data.details}`;
        say('Opening your Messages app so you can send this to Ray…');
        location.href = `sms:${TEXT_NUMBER}?&body=${encodeURIComponent(body)}`;
        return;
      }

      button.disabled = true;
      say('Sending…');
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error(String(res.status));
        form.reset();
        say('Sent. Ray will get back to you.');
      } catch (err) {
        say('That didn’t send. Please call or text Ray at (916) 289-1026.', true);
      } finally {
        button.disabled = false;
      }
    });
  }

  function init() { initHeader(); initSwitcher(); initCompare(); initReveal(); initVideo(); initForm(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
