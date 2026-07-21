/* NovaThread Portfolio Website Interaction Script */

document.addEventListener('DOMContentLoaded', () => {
  
  // --- Header Scroll Effect ---
  const header = document.querySelector('header');
  const scrollThreshold = 50;

  function handleScroll() {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Run once on load

  // --- Mobile Navigation Menu Toggle ---
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
      
      // Accessibility
      const isExpanded = hamburger.classList.contains('active');
      hamburger.setAttribute('aria-expanded', isExpanded.toString());
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- Active Nav Link on Scroll & Smooth Scroll ---
  const sections = document.querySelectorAll('section[id]');
  const pathName = window.location.pathname;
  
  function highlightNavOnScroll() {
    const scrollPosition = window.scrollY + 120; // offset for fixed header

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"], .nav-link[href="index.html#${sectionId}"]`);

      if (activeLink && scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
      }
    });
  }

  // Active state for sub-pages
  if (pathName.includes('services.html')) {
    navLinks.forEach(link => link.classList.remove('active'));
    const serviceLink = document.querySelector('.nav-link[href="services.html"]');
    if (serviceLink) serviceLink.classList.add('active');
  } else if (pathName.includes('about.html')) {
    navLinks.forEach(link => link.classList.remove('active'));
    const aboutLink = document.querySelector('.nav-link[href="about.html"]');
    if (aboutLink) aboutLink.classList.add('active');
  } else {
    window.addEventListener('scroll', highlightNavOnScroll);
  }

  // Handle cross-page deep linking scroll offset on load
  if (window.location.hash) {
    const hash = window.location.hash;
    // Delay slightly to allow layout calculations
    setTimeout(() => {
      const targetElement = document.querySelector(hash);
      if (targetElement) {
        const offsetPosition = targetElement.offsetTop - 90; // offset for fixed header
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 200);
  }

  // --- Portfolio Filtering ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from other buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
          item.classList.remove('hide');
          // Simple visual fade in
          item.style.opacity = '0';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.classList.add('hide');
        }
      });
    });
  });

  // --- Floating Form Labels Focus/Blur & Dynamic Filling Check ---
  const formInputs = document.querySelectorAll('.form-input');

  formInputs.forEach(input => {
    // Check initial state
    if (input.value.trim() !== '') {
      input.parentElement.classList.add('filled');
    }

    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });

    input.addEventListener('blur', () => {
      input.parentElement.classList.remove('focused');
      if (input.value.trim() !== '') {
        input.parentElement.classList.add('filled');
      } else {
        input.parentElement.classList.remove('filled');
      }
    });
  });

  // --- Contact Form Submission Interaction (Static/Frontend-only) ---
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      // Disable inputs and button during simulation
      submitBtn.innerHTML = 'Sending message...';
      submitBtn.disabled = true;
      formInputs.forEach(input => input.disabled = true);

      // Simulate network request delay (1.5 seconds)
      setTimeout(() => {
        formStatus.textContent = 'Thank you! Your message has been sent successfully. We will get back to you soon.';
        formStatus.className = 'form-status success';
        
        // Reset form
        contactForm.reset();
        formInputs.forEach(input => {
          input.disabled = false;
          input.parentElement.classList.remove('filled');
          input.parentElement.classList.remove('focused');
        });
        
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        // Hide success message after 5 seconds
        setTimeout(() => {
          formStatus.style.display = 'none';
        }, 5000);

      }, 1500);
    });
  }

  // --- Newsletter Form Submission (Static/Frontend-only) ---
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      const btn = newsletterForm.querySelector('button');
      
      if (input.value.trim() === '') return;

      const originalBtnHtml = btn.innerHTML;
      btn.innerHTML = 'Subscribed!';
      btn.style.backgroundColor = '#10b981';
      input.disabled = true;
      btn.disabled = true;

      setTimeout(() => {
        input.value = '';
        input.disabled = false;
        btn.disabled = false;
        btn.innerHTML = originalBtnHtml;
        btn.style.backgroundColor = '';
      }, 3000);
    });
  }

  // --- Scroll Reveal Animations using Intersection Observer ---
  const revealElements = document.querySelectorAll('.service-card, .portfolio-item, .process-step, .contact-info, .contact-form-container, .detail-card');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    // Initial style setup before observer runs
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    revealObserver.observe(el);
  });
});
