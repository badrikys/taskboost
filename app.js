window.dataLayer = window.dataLayer || [];
const push = (event, props = {}) => window.dataLayer.push({ event, ...props });

document.addEventListener('DOMContentLoaded', () => {
  push('view_hero');

  document.querySelector('#cta-hero')?.addEventListener('click', () => {
    push('click_cta_hero', { position: 'hero' });
  });

  const params = new URLSearchParams(window.location.search);
  if (params.get('ab') === 'h1b') {
    const h1 = document.querySelector('#hero h1');
    if (h1) {
      h1.textContent = 'Увеличим доход на Taskrabbit — начнём с бесплатного аудита';
    }
  }

  const form = document.getElementById('leadForm');
  const success = document.getElementById('formSuccess');
  const startTs = Date.now();

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (document.getElementById('hp').value.trim() !== '') {
      return;
    }

    const name = document.getElementById('fName').value.trim();
    const city = document.getElementById('fCity').value.trim();
    const url = document.getElementById('fUrl').value.trim();
    const cats = document.getElementById('fCats').value.trim();
    const note = document.getElementById('fNote').value.trim();
    const contactMethod = form.querySelector('input[name="contactMethod"]:checked')?.value || '';
    const contact = document.getElementById('fContact').value.trim();

    if (!name || !city || !contactMethod || !contact) {
      push('form_field_error', { field: 'required' });
      return;
    }

    if (Date.now() - startTs < 5000) {
      return;
    }

    const FORM_ENDPOINT = 'https://formspree.io/f/XXXXXXXX'; // TODO: заменить на рабочий endpoint
    const payload = {
      name,
      city,
      url,
      cats,
      note,
      contactMethod,
      contact,
      ua: navigator.userAgent
    };

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        if (success) {
          success.hidden = false;
        }
        form.reset();
        push('submit_form_success', {
          city,
          has_url: Boolean(url),
          contact_method: contactMethod,
          categories_count: cats ? cats.split(',').length : 0
        });
      }
    } catch (error) {
      console.error(error);
    }
  });

  let maxDepth = 0;
  window.addEventListener('scroll', () => {
    const scrollHeight = document.body.scrollHeight - window.innerHeight;
    if (scrollHeight <= 0) return;
    const depth = Math.round((window.scrollY / scrollHeight) * 100);
    if (depth > maxDepth) {
      maxDepth = depth;
      [25, 50, 75, 90].forEach((percent) => {
        if (depth >= percent) {
          push('scroll_depth', { percent });
        }
      });
    }
  });
});
