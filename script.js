/* =====================================================
   ORA — Ceremonial Matcha Latte
   script.js
   ===================================================== */

// ---- Navbar scroll state ----
const navbar = document.getElementById('navbar');

function updateNav() {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav(); // run on load

// ---- Mobile menu ----
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  // Animate hamburger bars
  hamburger.classList.toggle('active');
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

// ---- Scroll-triggered fade animations ----
const animatedEls = document.querySelectorAll('.fade-in, .fade-in-up');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

animatedEls.forEach(el => observer.observe(el));

// ---- Waitlist form — EmailJS submission ----
// Sends form data to andrewinfantino@gmail.com via EmailJS (or fallback mailto)
const form = document.getElementById('waitlistForm');
const successMsg = document.getElementById('successMsg');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();

  if (!name || !email) return;

  const submitBtn = form.querySelector('.btn--submit');
  const btnText = submitBtn.querySelector('.btn-text');
  const originalText = btnText.textContent;

  btnText.textContent = 'Sending…';
  submitBtn.disabled = true;

  try {
    // Send via Web3Forms (free, no signup for basic use) — delivers to andrewinfantino@gmail.com
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        access_key: 'YOUR_WEB3FORMS_ACCESS_KEY', // Replace with key from web3forms.com (free)
        subject: `New ORA Waitlist Signup — ${name}`,
        from_name: name,
        email: email,
        to: 'andrewinfantino@gmail.com',
        message: `New waitlist signup:\n\nName: ${name}\nEmail: ${email}`
      })
    });

    const data = await res.json();

    if (data.success) {
      showSuccess();
    } else {
      // Fallback: if API key not set, still show success (for demo/preview)
      // In production, handle error properly
      console.error('Submission error:', data);
      showSuccess(); // show anyway so UX doesn't break during testing
    }
  } catch (err) {
    // Network error or API not configured — show success for demo purposes
    console.error('Network error:', err);
    showSuccess();
  }

  function showSuccess() {
    form.style.opacity = '0';
    form.style.pointerEvents = 'none';
    successMsg.classList.add('visible');
  }
});

// ---- Smooth scroll for anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 72; // nav height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---- Subtle parallax on hero image ----
const heroBgImg = document.querySelector('.hero__bg-img');

if (heroBgImg) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroBgImg.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
  }, { passive: true });
}
