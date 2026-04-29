document.addEventListener('DOMContentLoaded', () => {

  // 1. Particle Canvas Background (Hero)
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    const resize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.5;
        this.speedY = Math.random() * -0.5 - 0.1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
      }
      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        if (this.y < 0) {
          this.y = height;
          this.x = Math.random() * width;
        }
      }
      draw() {
        ctx.fillStyle = 'rgba(252, 223, 1, ' + this.opacity + ')';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      const particleCount = Math.floor(width / 20);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };
    initParticles();

    const animateParticles = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateParticles);
    };
    animateParticles();
  }

  // 2. Scroll Reveals (Staggered Animations)
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // 3. Counter Animation
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const targetNumber = parseInt(target.getAttribute('data-target'));
        const duration = 2000;
        let startTime = null;

        const easeOutQuart = (t) => 1 - (--t) * t * t * t;

        const updateCounter = (timestamp) => {
          if (!startTime) startTime = timestamp;
          const progress = timestamp - startTime;

          if (progress < duration) {
            const current = Math.floor(easeOutQuart(progress / duration) * targetNumber);
            target.innerText = current.toLocaleString('pt-BR');
            requestAnimationFrame(updateCounter);
          } else {
            target.innerText = targetNumber.toLocaleString('pt-BR');
          }
        };

        requestAnimationFrame(updateCounter);
        counterObserver.unobserve(target);
      }
    });
  });

  counters.forEach(counter => counterObserver.observe(counter));

  // 4. Parallax Effect on Mockups
  const mockups = document.querySelectorAll('.hero-img, .bonus-img');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    mockups.forEach(mockup => {
      const speed = 0.05;
      mockup.style.transform = 'translateY(' + (scrollY * speed) + 'px)';
    });
  });

  // 5. Timer
  const timerMins = document.getElementById('timer-minutes');
  const timerSecs = document.getElementById('timer-seconds');

  if (timerMins && timerSecs) {
    let endTime = localStorage.getItem('vslTimerEndV2');
    const duration = 15 * 60 * 1000;

    if (!endTime || new Date().getTime() > endTime) {
      endTime = new Date().getTime() + duration;
      localStorage.setItem('vslTimerEndV2', endTime);
    }

    const updateTimer = () => {
      const now = new Date().getTime();
      let distance = endTime - now;

      if (distance < 0) {
        endTime = new Date().getTime() + duration;
        localStorage.setItem('vslTimerEndV2', endTime);
        distance = duration;
      }

      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);

      timerMins.textContent = m.toString().padStart(2, '0');
      timerSecs.textContent = s.toString().padStart(2, '0');
    };

    updateTimer();
    setInterval(updateTimer, 1000);
  }

  // 6. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(faq => faq.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 7. Smooth Scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerOffset = 60;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    });
  });
});
