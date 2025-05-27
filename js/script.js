document.addEventListener('DOMContentLoaded', () => {
  // Nav elements
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('#navLinks');

  // Testimonial elements
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const cardsWrapper = document.querySelector('.testimonial-cards-wrapper');
  const prevBtn = document.querySelector('.arrow-prev');
  const nextBtn = document.querySelector('.arrow-next');
  const indicatorsContainer = document.querySelector('.testimonial-indicators');
  let currentIndex = 0;
  let autoSlideInterval;
  const cardCount = testimonialCards.length;

  // Update card width based on screen size (desktop only)
  const updateCardWidth = () => {
    if (window.innerWidth <= 768) {
      cardsWrapper.style.transform = 'translateX(0px)';
      cardsWrapper.style.transition = 'none';
      indicatorsContainer.style.display = 'none';
      return false;
    }
    indicatorsContainer.style.display = 'flex';
    return true;
  };

  // Create indicators for testimonials (desktop only)
  const createIndicators = () => {
    indicatorsContainer.innerHTML = '';
    if (window.innerWidth <= 768) return;
    for (let i = 0; i < cardCount; i++) {
      const indicator = document.createElement('div');
      indicator.classList.add('testimonial-indicator');
      if (i === 0) indicator.classList.add('active');
      indicator.addEventListener('click', () => goToSlide(i));
      indicatorsContainer.appendChild(indicator);
    }
  };

  // Update active indicator (desktop only)
  const updateIndicators = () => {
    if (window.innerWidth <= 768) return;
    const indicators = document.querySelectorAll('.testimonial-indicator');
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentIndex);
    });
  };

  // Go to specific slide (desktop only)
  const goToSlide = (index) => {
    if (window.innerWidth <= 768) return;
    currentIndex = index;
    const cardWidth = testimonialCards[0].offsetWidth + 30; // Card width + gap
    cardsWrapper.style.transition = 'transform 0.8s ease';
    cardsWrapper.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    updateIndicators();
  };

  // Slide to next testimonial (desktop only)
  const nextSlide = () => {
    if (window.innerWidth <= 768) return;
    currentIndex = (currentIndex + 1) % cardCount;
    goToSlide(currentIndex);
  };

  // Slide to previous testimonial (desktop only)
  const prevSlide = () => {
    if (window.innerWidth <= 768) return;
    currentIndex = (currentIndex - 1 + cardCount) % cardCount;
    goToSlide(currentIndex);
  };

  // Start auto-sliding (desktop only)
  const startAutoSlide = () => {
    if (window.innerWidth <= 768 || cardCount <= 1) return;
    autoSlideInterval = setInterval(nextSlide, 8000);
  };

  // Pause auto-sliding
  const pauseAutoSlide = () => {
    clearInterval(autoSlideInterval);
  };

  // Toggle mobile menu
  const toggleMenu = (event) => {
    if (!hamburger || !navLinks) {
      console.error('Hamburger or navLinks not found');
      return;
    }
    event.stopPropagation(); // Prevent click from bubbling to document
    navLinks.classList.toggle('show');
    hamburger.classList.toggle('active');
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isExpanded);
    console.log('NavLinks show:', navLinks.classList.contains('show')); // Debug
  };

  // Close menu when clicking outside
  const closeMenuOnClickOutside = (event) => {
    if (!hamburger || !navLinks) return;
    const isClickInsideNavbar = event.target.closest('.navbar');
    if (!isClickInsideNavbar && navLinks.classList.contains('show')) {
      navLinks.classList.remove('show');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      console.log('Menu closed via outside click'); // Debug
    }
  };

  // Smooth scrolling for anchor links
  const setupSmoothScrolling = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        if (anchor.hash) {
          e.preventDefault();
          const target = document.querySelector(anchor.hash);
          if (target) {
            const offset = window.innerWidth <= 480 ? 50 : window.innerWidth <= 576 ? 60 : window.innerWidth <= 768 ? 70 : 90;
            window.scrollTo({
              top: target.offsetTop - offset,
              behavior: 'smooth'
            });
            if (window.innerWidth <= 768 && navLinks.classList.contains('show')) {
              toggleMenu(e);
            }
          }
        }
      });
    });
  };

  // Form submission handler
  const handleFormSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    console.log('Form submitted:', Object.fromEntries(formData));
    alert('Thank you for your message! We will get back to you soon.');
    form.reset();
  };

  // Initialize everything
  const init = () => {
    // Mobile menu setup
    if (hamburger) {
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.addEventListener('click', toggleMenu);
      document.addEventListener('click', closeMenuOnClickOutside);
    } else {
      console.error('Hamburger button not found in the DOM');
    }

    // Smooth scrolling
    setupSmoothScrolling();

    // Form handling
    const contactForm = document.querySelector('form');
    if (contactForm) {
      contactForm.addEventListener('submit', handleFormSubmit);
    }

    // Testimonial carousel (desktop only)
    if (cardCount > 0) {
      createIndicators();
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          prevSlide();
          pauseAutoSlide();
          startAutoSlide();
        });
      }
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          nextSlide();
          pauseAutoSlide();
          startAutoSlide();
        });
      }
      const container = document.querySelector('.testimonial-container');
      if (container) {
        container.addEventListener('mouseenter', pauseAutoSlide);
        container.addEventListener('mouseleave', startAutoSlide);
      }
      if (window.innerWidth > 768) {
        startAutoSlide();
      }
    }

    // Update layout on resize
    window.addEventListener('resize', () => {
      const isDesktopMode = updateCardWidth();
      createIndicators();
      if (isDesktopMode) {
        goToSlide(currentIndex);
        startAutoSlide();
      } else {
        pauseAutoSlide();
      }
      if (window.innerWidth > 768 && navLinks && hamburger) {
        navLinks.classList.remove('show');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });

    // Initial layout update
    updateCardWidth();
    createIndicators();
  };

  init();
});