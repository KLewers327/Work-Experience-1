const form = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');
let formLoadedAt = Date.now();
const minimumSubmitMilliseconds = 2500;

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  statusEl.textContent = '';
  statusEl.className = 'form-status';

  const data = Object.fromEntries(new FormData(form));
  const elapsedMilliseconds = Date.now() - formLoadedAt;

  if ((data.website && data.website.trim() !== '') || elapsedMilliseconds < minimumSubmitMilliseconds) {
    form.reset();
    formLoadedAt = Date.now();
    statusEl.textContent = "Thanks, we'll be in touch within one business day.";
    statusEl.classList.add('form-status--success');
    button.disabled = false;
    return;
  }

  try {
    const response = await fetch('/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, formLoadedAt }),
    });
    const result = await response.json();

    if (!result.ok) {
      throw new Error(result.error || 'Something went wrong.');
    }

    form.reset();
    formLoadedAt = Date.now();
    statusEl.textContent = "Thanks, we'll be in touch within one business day.";
    statusEl.classList.add('form-status--success');
  } catch (error) {
    statusEl.textContent = error.message || 'Something went wrong. Please email hello@calicomedia.co instead.';
    statusEl.classList.add('form-status--error');
  } finally {
    button.disabled = false;
  }
});
