const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navAnchors = [...document.querySelectorAll('.nav-links a[href^="#"]')];

menuButton.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!expanded));
  menuButton.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  navLinks.classList.toggle('open', !expanded);
});
navAnchors.forEach(link => link.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  navLinks.classList.remove('open');
}));

const observedSections = [...document.querySelectorAll('main section[id]')];
if ('IntersectionObserver' in window) {
  const activeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navAnchors.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-30% 0px -60% 0px' });
  observedSections.forEach(section => activeObserver.observe(section));
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
  }), { threshold: .08 });
  document.querySelectorAll('.section-kicker,.about-grid,.service-row,.project-feature,.project-card,.skills-layout,.philosophy-grid,.contact-layout').forEach(el => {
    el.classList.add('reveal'); revealObserver.observe(el);
  });
}

document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', () => {
  const select = document.querySelector('#service');
  select.value = link.dataset.service;
}));

document.querySelector('.copy-button').addEventListener('click', async event => {
  const button = event.currentTarget;
  const username = button.dataset.copy;
  try {
    await navigator.clipboard.writeText(username);
    button.textContent = 'COPIED';
  } catch {
    const field = document.createElement('textarea');
    field.value = username;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed'; field.style.opacity = '0';
    document.body.append(field); field.select();
    const copied = document.execCommand('copy'); field.remove();
    button.textContent = copied ? 'COPIED' : username;
  }
  window.setTimeout(() => { button.textContent = 'COPY'; }, 1800);
});

const projectNotes = {
  'silent-scream': {
    title: 'Silent Scream',
    content: '<p>A 2D psychological horror game built around distorted memories, unsettling environments, mysterious entities, and the fragile boundary between dreams and reality.</p><p>The current direction includes side-perspective exploration, interactive objects, environmental storytelling, and audio-driven atmosphere. The Watcher is a mysterious entity associated with the first chapter.</p><p><strong>Status:</strong> Seif’s most developed current game project. It is still in development—not released or complete.</p>'
  },
  aeltrix: {
    title: 'Aeltrix Social',
    content: '<p>A social platform experiment focused on connecting people through profiles, messaging, friendships, and interactive features.</p><ul><li>Project direction includes accounts, profiles, search, online status, image sharing, and communication.</li><li>Technologies: JavaScript, GitHub Pages, and Supabase.</li><li>Status: an evolving project, not a finished commercial platform.</li></ul>'
  },
  bots: {
    title: 'Discord bots',
    content: '<p>An ongoing area of bot development experiments: useful commands, interactive components, automation, API integrations, and server utilities.</p><p>Built with JavaScript or Python depending on the project. No particular bot deployment or user metrics are claimed here.</p>'
  },
  python: {
    title: 'Python tools',
    content: '<p>Custom Python utilities and automation experiments intended to solve practical problems and simplify repetitive tasks.</p><p>Each tool starts from the task at hand; this portfolio does not imply a specific set of features or a packaged product.</p>'
  }
};
const dialog = document.querySelector('#project-dialog');
document.querySelectorAll('[data-modal]').forEach(button => button.addEventListener('click', () => {
  const note = projectNotes[button.dataset.modal];
  if (!note) return;
  document.querySelector('#dialog-title').textContent = note.title;
  document.querySelector('#dialog-content').innerHTML = note.content;
  dialog.showModal();
}));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
dialog.querySelector('.dialog-contact').addEventListener('click', () => dialog.close());

document.querySelector('#contact-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  const feedback = document.querySelector('#form-feedback');
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const subject = `Project enquiry${data.get('service') ? ` — ${data.get('service')}` : ''}`;
  const body = [
    `Name: ${data.get('name')}`,
    `Email: ${data.get('email')}`,
    `Service: ${data.get('service') || 'Not specified'}`,
    `Budget: ${data.get('budget') || 'Not specified'}`,
    '',
    'Project details:',
    data.get('message')
  ].join('\n');
  feedback.textContent = 'Your email app should open with a prepared draft. If it doesn’t, email seifpbg05@gmail.com directly.';
  window.location.href = `mailto:seifpbg05@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

document.querySelector('#year').textContent = new Date().getFullYear();
