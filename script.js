/* =====================================================
   ORA — script.js
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

/* ---- 7. Waitlist form — EmailJS (no account verification needed) ---- */
/* 
  SETUP (one time, 2 minutes):
  1. Go to emailjs.com and sign up free
  2. Add a new Email Service → connect your Gmail
  3. Create an Email Template with these variables: {{from_name}}, {{from_email}}, {{message}}
     Set "To Email" to andrewinfantino@gmail.com
  4. Replace the three values below with your IDs from the EmailJS dashboard
*/
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';

const form       = document.getElementById('waitlistForm');
const successMsg = document.getElementById('successMsg');

// Load EmailJS SDK
(function() {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
  script.onload = function() {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  };
  document.head.appendChild(script);
})();

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name  = document.getElementById('formName').value.trim();
  const email = document.getElementById('formEmail').value.trim();
  if (!name || !email) return;

  const submitBtn = form.querySelector('.btn--submit');
  const btnText   = submitBtn.querySelector('.btn-text');
  btnText.textContent = 'Sending…';
  submitBtn.disabled  = true;

  try {
    const result = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      from_name:  name,
      from_email: email,
      message:    'New ORA waitlist signup\n\nName: ' + name + '\nEmail: ' + email,
      to_email:   'andrewinfantino@gmail.com'
    });

    if (result.status === 200) {
      form.style.transition    = 'opacity 0.4s';
      form.style.opacity       = '0';
      form.style.pointerEvents = 'none';
      successMsg.classList.add('visible');
    } else {
      btnText.textContent = 'Try again';
      submitBtn.disabled  = false;
    }
  } catch (err) {
    btnText.textContent = 'Try again';
    submitBtn.disabled  = false;
  }
});
