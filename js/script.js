document.addEventListener('DOMContentLoaded', initPortfolio);

function initPortfolio() {
    const progressBar = document.getElementById('scroll-progress');
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    const nav = document.getElementById('mainNav');
    const backTop = document.getElementById('back-to-top');
    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    window.addEventListener('scroll', () => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.width = maxScroll > 0 ? `${window.scrollY / maxScroll * 100}%` : '0%';
        nav.classList.toggle('nav-scrolled', window.scrollY > 40);
        backTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    document.addEventListener('mousemove', event => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    function animateCursor() {
        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
        ringX += (mouseX - ringX) * .13;
        ringY += (mouseY - ringY) * .13;
        ring.style.left = `${ringX}px`;
        ring.style.top = `${ringY}px`;
        requestAnimationFrame(animateCursor);
    }

    animateCursor();
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', event => {
            const selector = link.getAttribute('href');

            if (selector === '#') {
                event.preventDefault();
                return;
            }

            const target = document.querySelector(selector);

            if (!target) {
                return;
            }

            event.preventDefault();
            window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        });
    });

    initNavigation();
    initThemeToggle();
    initTyping();
    initRevealAnimations();
    initSkillBars();
    initStats();
}

function initThemeToggle() {
    const toggles = document.querySelectorAll('[data-theme-toggle]');

    if (!toggles.length) {
        return;
    }

    let lastToggleTime = 0;

    function updateToggle(isDark) {
        toggles.forEach(toggle => {
            const icon = toggle.querySelector('i');
            toggle.setAttribute('aria-pressed', String(isDark));
            toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');

            if (icon) {
                icon.className = isDark ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill';
            }
        });
    }

    function switchTheme(event) {
        const toggle = event.target.closest('[data-theme-toggle]');

        if (!toggle) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        const now = Date.now();

        if (now - lastToggleTime < 250) {
            return;
        }

        lastToggleTime = now;
        const isDark = document.documentElement.classList.toggle('dark-mode');

        try {
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        } catch (error) {
            // Theme still changes even if the browser blocks storage.
        }

        updateToggle(isDark);
    }

    updateToggle(document.documentElement.classList.contains('dark-mode'));
    document.addEventListener('click', switchTheme, true);
    document.addEventListener('touchend', switchTheme, true);
}

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            }

            navLinks.forEach(link => link.classList.remove('active'));
            const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);

            if (activeLink) {
                activeLink.classList.add('active');
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px' });

    document.querySelectorAll('section[id]').forEach(section => observer.observe(section));
}

function initTyping() {
    const typedText = document.getElementById('typed-text');

    if (!typedText) {
        return;
    }

    const roles = ['Front-End Developer', 'UI/UX Enthusiast', '3D Designer', 'BSIT Student'];
    let roleIndex = 0;
    let characterIndex = 0;
    let deleting = false;

    function typeLoop() {
        const role = roles[roleIndex];

        if (!deleting) {
            typedText.textContent = role.slice(0, ++characterIndex);

            if (characterIndex === role.length) {
                deleting = true;
                setTimeout(typeLoop, 1800);
                return;
            }
        } else {
            typedText.textContent = role.slice(0, --characterIndex);

            if (characterIndex === 0) {
                deleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
            }
        }

        setTimeout(typeLoop, deleting ? 55 : 85);
    }

    typeLoop();
}

function initRevealAnimations() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.07 });

    document.querySelectorAll('.reveal, .skill-card, .project-card, .edu-card, .proj-edu-card, .testi-card, .service-card')
        .forEach(element => observer.observe(element));

    document.querySelectorAll('.hero-text-col .reveal, .hero-img-col .reveal').forEach((element, index) => {
        setTimeout(() => element.classList.add('revealed'), 80 + index * 110);
    });
}

function initSkillBars() {
    const skillBars = document.querySelector('.skill-bar-wrap');

    if (!skillBars) {
        return;
    }

    new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
                    bar.style.width = `${bar.dataset.width}%`;
                });
            }
        });
    }, { threshold: 0.3 }).observe(skillBars);
}

function initStats() {
    const stats = document.querySelector('.stats-strip');

    if (!stats) {
        return;
    }

    new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.querySelectorAll('.big-num[data-count]').forEach(element => {
                const target = Number(element.dataset.count);
                const suffix = element.dataset.suffix || '+';
                const step = Math.max(1, Math.ceil(target / 40));
                let current = 0;
                const timer = setInterval(() => {
                    current = Math.min(current + step, target);
                    element.textContent = `${current}${suffix}`;

                    if (current >= target) {
                        clearInterval(timer);
                    }
                }, 38);
            });
        });
    }, { threshold: 0.5 }).observe(stats);
}
