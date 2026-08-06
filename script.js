// ---------- mobile nav toggle ----------
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => navLinks.classList.remove('open'))
  );
}

// ---------- scroll progress bar ----------
const scrollProgress = document.getElementById('scrollProgress');
function updateScrollProgress() {
  if (!scrollProgress) return;
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = pct + '%';
}
window.addEventListener('scroll', () => requestAnimationFrame(updateScrollProgress));
updateScrollProgress();

// ---------- scroll reveal ----------
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in'));
}

// ---------- experience accordion ----------
const accordionItems = document.querySelectorAll('.accordion-item');
function setPanelHeight(item, open) {
  const panel = item.querySelector('.accordion-panel');
  const header = item.querySelector('.accordion-header');
  if (open) {
    panel.style.maxHeight = panel.scrollHeight + 'px';
    header.setAttribute('aria-expanded', 'true');
  } else {
    panel.style.maxHeight = '0px';
    header.setAttribute('aria-expanded', 'false');
  }
}
accordionItems.forEach(item => {
  const header = item.querySelector('.accordion-header');
  header.addEventListener('click', () => {
    const willOpen = !item.classList.contains('open');
    // single-open accordion: close all others first
    accordionItems.forEach(other => {
      other.classList.remove('open');
      setPanelHeight(other, false);
    });
    if (willOpen) {
      item.classList.add('open');
      setPanelHeight(item, true);
    }
  });
});
// initialise open state (first item starts expanded, matches .open class in HTML)
window.addEventListener('load', () => {
  accordionItems.forEach(item => {
    setPanelHeight(item, item.classList.contains('open'));
  });
});
// keep expanded panel height correct on resize
window.addEventListener('resize', () => {
  accordionItems.forEach(item => {
    if (item.classList.contains('open')) setPanelHeight(item, true);
  });
});

// ---------- project filter ----------
const filterPills = document.querySelectorAll('.filter-pill');
const projectCards = document.querySelectorAll('.project-card');
filterPills.forEach(pill => {
  pill.addEventListener('click', () => {
    filterPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    const filter = pill.dataset.filter;
    projectCards.forEach(card => {
      const cats = (card.dataset.category || '').split(' ');
      const show = filter === 'all' || cats.includes(filter);
      card.classList.toggle('is-hidden', !show);
    });
  });
});

// ---------- project chart gallery lightbox ----------
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCap = document.getElementById('lightbox-cap');
if (lightbox && lightboxImg) {
  document.querySelectorAll('.gallery-thumb').forEach(btn => {
    btn.addEventListener('click', () => {
      lightboxImg.src = btn.dataset.full;
      lightboxImg.alt = btn.dataset.cap || '';
      if (lightboxCap) lightboxCap.textContent = btn.dataset.cap || '';
      lightbox.classList.add('open');
    });
  });
  lightbox.addEventListener('click', () => lightbox.classList.remove('open'));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') lightbox.classList.remove('open');
  });
}

// ---------- contact form (Formspree) ----------
const contactForm = document.getElementById('contactForm');
const contactNote = document.getElementById('contactNote');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const action = contactForm.getAttribute('action') || '';

    if (!action || action.includes('YOUR_FORM_ID')) {
      if (contactNote) contactNote.textContent = 'Contact form is not connected yet - add your Formspree form ID in index.html.';
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalLabel = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
      const response = await fetch(action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        contactForm.reset();
        if (contactNote) contactNote.textContent = "Thanks - your message was sent. I'll get back to you soon.";
      } else {
        if (contactNote) contactNote.textContent = 'Something went wrong sending that. Please try emailing directly instead.';
      }
    } catch (err) {
      if (contactNote) contactNote.textContent = 'Something went wrong sending that. Please try emailing directly instead.';
    } finally {
      submitBtn.textContent = originalLabel;
      submitBtn.disabled = false;
    }
  });
}
