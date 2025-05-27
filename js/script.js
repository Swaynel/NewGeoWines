document.addEventListener('DOMContentLoaded', () => {
  // Nav elements
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('#navLinks'); // Updated to use ID

  // Testimonial elements
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const cardsWrapper = document.querySelector('.testimonial-cards-wrapper');
  const prevBtn = document.querySelector('.arrow-prev');
  const nextBtn = document.querySelector('.arrow-next');
  const indicatorsContainer = document.querySelector('.testimonial-indicators');

  let currentPosition = 0;
  let cardWidth = 0;
  const cardCount = testimonialCards.length;
  let autoSlideInterval;

  // Update card width based on screen size (desktop only)
  const updateCardWidth = () => {
    if (window.innerWidth <= 768) {
      cardsWrapper.style.transform = 'translateX(0px)';
      cardsWrapper.style.transition = 'none';
      return false;
    }

    cardWidth = 380 + 30;
    const maxPosition = cardCount * cardWidth;
    cardsWrapper.style.width = `${(cardCount * 2) * cardWidth}px`;
    return true;
  };

  // Infinite loop setup for testimonials (desktop only)
  const setupInfiniteLoop = () => {
    testimonialCards.forEach(card => {
      const clone = card.cloneNode(true);
      cardsWrapper.appendChild(clone);
    });
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    console.log('Hamburger clicked'); // Debug log
    if (!hamburger || !navLinks) {
      console.error('Hamburger or navLinks not found');
      return;
    }
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    console.log('isExpanded:', isExpanded); // Debug log
    hamburger.setAttribute('aria-expanded', !isExpanded);
    hamburger.classList.toggle('active', !isExpanded);
    navLinks.classList.toggle('show', !isExpanded);
    console.log('navLinks classList:', navLinks.classList); // Debug log
    if (window.innerWidth > 768) {
      isExpanded ? startAutoSlide() : pauseAutoSlide();
    }
  };

  // Close menu when clicking outside
  const closeMenuOnClickOutside = (event) => {
    if (!hamburger || !navLinks) return;
    const isClickInsideHamburger = event.target.closest('.hamburger');
    const isClickInsideNavLinks = event.target.closest('.nav-links');
    if (!isClickInsideHamburger && !isClickInsideNavLinks) {
      console.log('Clicked outside, closing menu'); // Debug log
      navLinks.classList.remove('show');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      if (window.innerWidth > 768) {
        startAutoSlide();
      }
    }
  };

  // Create indicators for testimonials (desktop only)
  const createIndicators = () => {
    indicatorsContainer.innerHTML = '';
    if (window.innerWidth <= 768) return;
    for (let i = 0; i < cardCount; i++) {
      const indicator = document.createElement('div');
      indicator.classList.add('testimonial-indicator');
      if (i === 0) indicator.classList.add('active');
      indicator.addEventListener('click', () => goToPosition(i));
      indicatorsContainer.appendChild(indicator);
    }
  };

  // Update active indicator (desktop only)
  const updateIndicators = () => {
    if (window.innerWidth <= 768) return;
    const indicators = document.querySelectorAll('.testimonial-indicator');
    const activeIndex = Math.round((currentPosition % (cardCount * cardWidth)) / cardWidth) % cardCount;
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === activeIndex);
    });
  };

  // Go to specific testimonial (desktop only)
  const goToPosition = (index) => {
    if (window.innerWidth <= 768) return;
    currentPosition = index * cardWidth;
    const maxPosition = cardCount * cardWidth;
    if (currentPosition >= maxPosition) {
      currentPosition = currentPosition % maxPosition;
      cardsWrapper.style.transition = 'none';
      cardsWrapper.style.transform = `translateX(-${currentPosition}px)`;
      void cardsWrapper.offsetWidth;
      cardsWrapper.style.transition = 'transform 0.8s ease';
    }
    cardsWrapper.style.transform = `translateX(-${currentPosition}px)`;
    updateIndicators();
  };

  // Slide to next testimonial (desktop only)
  const nextPosition = () => {
    if (window.innerWidth <= 768) return;
    currentPosition += cardWidth;
    const maxPosition = cardCount * cardWidth;
    cardsWrapper.style.transition = 'transform 0.8s ease';
    cardsWrapper.style.transform = `translateX(-${currentPosition}px)`;
    if (currentPosition >= maxPosition) {
      setTimeout(() => {
        currentPosition = 0;
        cardsWrapper.style.transition = 'none';
        cardsWrapper.style.transform = `translateX(-${currentPosition}px)`;
        void cardsWrapper.offsetWidth;
        cardsWrapper.style.transition = 'transform 0.8s ease';
      }, 800);
    }
    updateIndicators();
  };

  // Slide to previous testimonial (desktop only)
  const prevPosition = () => {
    if (window.innerWidth <= 768) return;
    currentPosition -= cardWidth;
    cardsWrapper.style.transition = 'transform 0.8s ease';
    cardsWrapper.style.transform = `translateX(-${currentPosition}px)`;
    if (currentPosition < 0) {
      setTimeout(() => {
        currentPosition = (cardCount * cardWidth) - cardWidth;
        cardsWrapper.style.transition = 'none';
        cardsWrapper.style.transform = `translateX(-${currentPosition}px)`;
        void cardsWrapper.offsetWidth;
        cardsWrapper.style.transition = 'transform 0.8s ease';
      }, 800);
    }
    updateIndicators();
  };

  // Start auto-sliding (desktop only)
  const startAutoSlide = () => {
    if (window.innerWidth <= 768 || cardCount <= 1) return;
    autoSlideInterval = setInterval(nextPosition, 8000);
  };

  // Pause auto-sliding
  const pauseAutoSlide = () => {
    clearInterval(autoSlideInterval);
  };

  // Reset auto-slide on interaction (desktop only)
  const resetAutoSlide = () => {
    if (window.innerWidth <= 768) return;
    pauseAutoSlide();
    startAutoSlide();
  };

  // Smooth scrolling for anchor links
  const setupSmoothScrolling = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        if (anchor.hash) {
          e.preventDefault();
          const target = document.querySelector(anchor.hash);
          if (target) {
            const offset = window.innerWidth <= 480 ? 50 : window.innerWidth <= 576 ? 60 : window.innerWidth <= 768 ? 70 : 100;
            window.scrollTo({
              top: target.offsetTop - offset,
              behavior: 'smooth'
            });
            if (window.innerWidth <= 768 && navLinks.classList.contains('show')) {
              navLinks.classList.remove('show');
              hamburger.classList.remove('active');
              hamburger.setAttribute('aria-expanded', 'false');
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
    } else {
      console.error('Hamburger button not found in the DOM');
    }
    document.addEventListener('click', closeMenuOnClickOutside);

    // Smooth scrolling
    setupSmoothScrolling();

    // Form handling
    const contactForm = document.querySelector('form');
    if (contactForm) {
      contactForm.addEventListener('submit', handleFormSubmit);
    }

    // Testimonial carousel (desktop only)
    if (cardCount > 0) {
      setupInfiniteLoop();
      createIndicators();

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          prevPosition();
          resetAutoSlide();
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          nextPosition();
          resetAutoSlide();
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
        goToPosition(Math.round(currentPosition / cardWidth));
        startAutoSlide();
      } else {
        pauseAutoSlide();
      }
      if (window.innerWidth > 768) {
        if (navLinks) {
          navLinks.classList.remove('show');
        }
        if (hamburger) {
          hamburger.classList.remove('active');
          hamburger.setAttribute('aria-expanded', 'false');
        }
      }
    });

    // Initial layout update
    updateCardWidth();
    createIndicators();
  };

  init();
});