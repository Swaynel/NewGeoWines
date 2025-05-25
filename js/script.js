document.addEventListener('DOMContentLoaded', () => {
  // Nav elements - keeping selectors same as CSS
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  
  // Testimonial elements - matching CSS classes
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const cardsWrapper = document.querySelector('.testimonial-cards-wrapper');
  const prevBtn = document.querySelector('.arrow-prev');
  const nextBtn = document.querySelector('.arrow-next');
  const indicatorsContainer = document.querySelector('.testimonial-indicators');
  
  let currentPosition = 0;
  let cardWidth = 410; // Card width (380px) + gap (30px) on desktop
  const cardCount = testimonialCards.length;
  let maxPosition = cardCount * cardWidth;
  let autoSlideInterval;

  // Adjust card width based on screen size
  const updateCardWidth = () => {
    if (window.innerWidth <= 480) {
      cardWidth = 270; // Matches 240px card + 30px gap at 480px
    } else if (window.innerWidth <= 576) {
      cardWidth = 300; // Matches 270px card + 30px gap at 576px
    } else if (window.innerWidth <= 768) {
      cardWidth = 330; // Matches 300px card + 30px gap at 768px
    } else {
      cardWidth = 410; // Desktop default
    }
    maxPosition = cardCount * cardWidth;
    cardsWrapper.style.width = `${(cardCount * 2) * cardWidth}px`; // Update for clones
  };

  // Infinite loop setup for testimonials
  const setupInfiniteLoop = () => {
    testimonialCards.forEach(card => {
      const clone = card.cloneNode(true);
      cardsWrapper.appendChild(clone);
    });
    updateCardWidth();
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    navLinks.classList.toggle('show', !isExpanded);
    hamburger.classList.toggle('active', !isExpanded);
    hamburger.setAttribute('aria-expanded', !isExpanded);
    isExpanded ? startAutoSlide() : pauseAutoSlide();
  };
  
  // Close menu when clicking outside
  const closeMenuOnClickOutside = (event) => {
    if (!event.target.closest('.navbar') || event.target.closest('.nav-links a')) {
      navLinks.classList.remove('show');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      startAutoSlide();
    }
  };

  // Create indicators for testimonials
  const createIndicators = () => {
    indicatorsContainer.innerHTML = '';
    for (let i = 0; i < cardCount; i++) {
      const indicator = document.createElement('div');
      indicator.classList.add('testimonial-indicator');
      if (i === 0) indicator.classList.add('active');
      indicator.addEventListener('click', () => goToPosition(i));
      indicatorsContainer.appendChild(indicator);
    }
  };

  // Update active indicator
  const updateIndicators = () => {
    const indicators = document.querySelectorAll('.testimonial-indicator');
    const activeIndex = Math.round((currentPosition % maxPosition) / cardWidth) % cardCount;
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === activeIndex);
    });
  };

  // Go to specific testimonial
  const goToPosition = (index) => {
    currentPosition = index * cardWidth;
    if (currentPosition >= maxPosition) {
      currentPosition = currentPosition % maxPosition;
      cardsWrapper.style.transition = 'none';
      cardsWrapper.style.transform = `translateX(-${currentPosition}px)`;
      void cardsWrapper.offsetWidth; // Trigger reflow
      cardsWrapper.style.transition = 'transform 0.8s ease';
    }
    cardsWrapper.style.transform = `translateX(-${currentPosition}px)`;
    updateIndicators();
  };

  // Slide to next testimonial
  const nextPosition = () => {
    currentPosition += cardWidth;
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

  // Slide to previous testimonial
  const prevPosition = () => {
    currentPosition -= cardWidth;
    cardsWrapper.style.transition = 'transform 0.8s ease';
    cardsWrapper.style.transform = `translateX(-${currentPosition}px)`;
    if (currentPosition < 0) {
      setTimeout(() => {
        currentPosition = maxPosition - cardWidth;
        cardsWrapper.style.transition = 'none';
        cardsWrapper.style.transform = `translateX(-${currentPosition}px)`;
        void cardsWrapper.offsetWidth;
        cardsWrapper.style.transition = 'transform 0.8s ease';
      }, 800);
    }
    updateIndicators();
  };

  // Start auto-sliding
  const startAutoSlide = () => {
    if (cardCount > 1) {
      autoSlideInterval = setInterval(nextPosition, 8000);
    }
  };

  // Pause auto-sliding
  const pauseAutoSlide = () => {
    clearInterval(autoSlideInterval);
  };

  // Reset auto-slide on interaction
  const resetAutoSlide = () => {
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
      hamburger.addEventListener('click', toggleMenu);
    }
    document.addEventListener('click', closeMenuOnClickOutside);
    
    // Smooth scrolling
    setupSmoothScrolling();
    
    // Form handling
    const contactForm = document.querySelector('form');
    if (contactForm) {
      contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Testimonial carousel
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
      
      startAutoSlide();
    }
    
    // Update card width on resize
    window.addEventListener('resize', () => {
      updateCardWidth();
      if (window.innerWidth > 768) {
        navLinks.classList.remove('show');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  };

  init();
});