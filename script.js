// Register GSAP if available
if (typeof gsap !== 'undefined') {
    // Hero Animations
    const tl = gsap.timeline();
    
    // Animate lines of title
    const titleLines = document.querySelectorAll('.hero-title .line-inner');
    if(titleLines.length > 0) {
        tl.to(titleLines, {
            y: 0,
            duration: 1,
            stagger: 0.15,
            ease: "power4.out",
            delay: 0.2
        });
    }

    tl.to('.hero-desc', {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out"
    }, "-=0.6");

    tl.to('.btn-group', {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out"
    }, "-=0.6");
}

// Theme Toggle Logic
const themeToggleBtn = document.getElementById('theme-toggle');
const sunIcon = document.querySelector('.sun-icon');
const moonIcon = document.querySelector('.moon-icon');

const savedTheme = localStorage.getItem('theme');
const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (theme === 'light') {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    } else {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
    }
};

if (savedTheme) {
    setTheme(savedTheme);
} else if (systemPrefersLight) {
    setTheme('light');
} else {
    setTheme('dark');
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            setTheme('light');
        } else {
            setTheme('dark');
        }
    });
}

// Custom Cursor (Only active on desktop, CSS hides it on mobile)
const cursor = document.querySelector('.custom-cursor');
if (cursor && window.innerWidth >= 1024) {
    document.addEventListener('mousemove', (e) => {
        requestAnimationFrame(() => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
    });

    // Hover effect on links and buttons
    const interactiveElements = document.querySelectorAll('a, button, .process-step, .bento-card, .project-visual');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}

// Magnetic Buttons
const magneticElements = document.querySelectorAll('.magnetic-btn');
if (window.innerWidth >= 1024) {
    magneticElements.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = (e.clientX - rect.left) - rect.width / 2;
            const y = (e.clientY - rect.top) - rect.height / 2;
            
            // Adjust the multiplier to control the magnetic pull strength
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });
}

// Spotlight Hover Effect on Cards
const spotlightCards = document.querySelectorAll('.spotlight-card');
spotlightCards.forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// Navbar Scroll Effect
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Mobile Menu Overlay Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobCloseBtn = document.getElementById('mob-close-btn');
const mobileOverlay = document.getElementById('mobile-overlay');
const mobLinks = document.querySelectorAll('.mob-link');

const openMobileMenu = () => {
    if (mobileOverlay) {
        mobileOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
};

const closeMobileMenu = () => {
    if (mobileOverlay) {
        mobileOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }
};

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', openMobileMenu);
}

if (mobCloseBtn) {
    mobCloseBtn.addEventListener('click', closeMobileMenu);
}

mobLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

// Scroll Reveal Animation (Intersection Observer)
const reveals = document.querySelectorAll('.reveal');
const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
    });
}, revealOptions);

reveals.forEach(reveal => {
    revealOnScroll.observe(reveal);
});

// Skills Filter Tab Interactivity
const skillTabs = document.querySelectorAll('.skill-tab');
const skillCards = document.querySelectorAll('.skill-card');

if (skillTabs.length > 0) {
    skillTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            skillTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filter = tab.getAttribute('data-filter');

            skillCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || filter === category) {
                    card.style.display = 'inline-flex';
                    requestAnimationFrame(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    });
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        if (tab.getAttribute('data-filter') !== 'all' && card.getAttribute('data-category') !== tab.getAttribute('data-filter')) {
                            card.style.display = 'none';
                        }
                    }, 250);
                }
            });
        });
    });
}
