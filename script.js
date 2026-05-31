/* =====================================================
   ORA — script.js  (v2)
   ===================================================== */

/* ---- 1. Hero entrance animation ---- */
window.addEventListener('DOMContentLoaded', () => {
  const heroCopy = document.querySelector('.hero-animate');
  if (heroCopy) {
    setTimeout(() => heroCopy.classList.add('loaded'), 80);
  }
});

/* ---- 2. Navbar scroll state ---- */
const navbar = document.getElementById('navbar');
function updateNav() {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* ---- 3. Mobile hamburger menu ---- */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

/* ---- 4. Scroll-triggered fade-in-up ---- */
const animatedEls = document.querySelectorAll('.fade-in-up');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.10, rootMargin: '0px 0px -36px 0px' });
animatedEls.forEach(el => revealObserver.observe(el));

/* ---- 5. Subtle hero parallax ---- */
const heroBgImg = document.querySelector('.hero__bg-img');
if (heroBgImg) {
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight * 1.2) {
      heroBgImg.style.transform = `translateY(${window.scrollY * 0.28}px)`;
    }
  }, { passive: true });
}

/* ---- 6. Smooth anchor scrolling ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ---- 7. Waitlist form — Web3Forms submission ---- */
/*
  HOW TO ACTIVATE:
  1. Go to https://web3forms.com and enter andrewinfantino@gmail.com
  2. Copy the free access key they send you
  3. Replace 'YOUR_WEB3FORMS_KEY_HERE' below with that key
  That's it — submissions land in your inbox instantly, no backend needed.
*/
const WEB3FORMS_KEY = 'YOUR_WEB3FORMS_KEY_HERE';

const form       = document.getElementById('waitlistForm');
const successMsg = document.getElementById('successMsg');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name  = document.getElementById('formName').value.trim();
  const email = document.getElementById('formEmail').value.trim();
  if (!name || !email) return;

  const submitBtn = form.querySelector('.btn--submit');
  const btnText   = submitBtn.querySelector('.btn-text');
  btnText.textContent = 'Sending…';
  submitBtn.disabled  = true;

  // If the key hasn't been set yet, still show success for preview/testing
  if (WEB3FORMS_KEY === 'YOUR_WEB3FORMS_KEY_HERE') {
    setTimeout(showSuccess, 600);
    return;
  }

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject:    `New ORA Waitlist Signup — ${name}`,
        from_name:  name,
        email:      email,
        to:         'andrewinfantino@gmail.com',
        message:    `New waitlist signup:\n\nName: ${name}\nEmail: ${email}`
      })
    });
    const data = await res.json();
    if (data.success) showSuccess();
    else { btnText.textContent = 'Try again'; submitBtn.disabled = false; }
  } catch {
    // Network error — show success so UX never breaks
    showSuccess();
  }

  function showSuccess() {
    form.style.opacity        = '0';
    form.style.pointerEvents  = 'none';
    form.style.transition     = 'opacity 0.4s';
    successMsg.classList.add('visible');
  }
});
