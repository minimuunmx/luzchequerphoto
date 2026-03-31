// ============================================
// Luz Chequer Photo — Site JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // ── Language Toggle ───────────────────────
    let currentLang = 'en';
    const langToggle = document.getElementById('langToggle');

    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'nl' : 'en';
        updateLanguage();
    });

    function updateLanguage() {
        // Update all elements with data-en / data-nl attributes
        document.querySelectorAll('[data-en]').forEach(el => {
            const text = el.getAttribute(`data-${currentLang}`);
            if (text) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = text;
                } else {
                    el.innerHTML = text;
                }
            }
        });

        // Update lang toggle button
        langToggle.textContent = currentLang === 'en' ? 'EN' : 'NL';

        document.documentElement.lang = currentLang;
    }

    // ── Mobile Menu ───────────────────────────
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('open');
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('open');
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // ── Navbar scroll effect ──────────────────
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        navbar.classList.toggle('scrolled', scrollY > 50);
        lastScroll = scrollY;
    });

    // ── Active nav link on scroll ─────────────
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -70% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));

    // ── Home Tabs (Family / Brands) ─────────
    const tabFamily = document.getElementById('tabFamily');
    const tabBrands = document.getElementById('tabBrands');
    const contentFamily = document.getElementById('contentFamily');
    const contentBrands = document.getElementById('contentBrands');
    const heroImg = document.getElementById('heroImg');

    const tabSlider = document.getElementById('tabSlider');

    if (tabFamily && tabBrands) {
        function switchTab(tab) {
            const isFamily = tab === 'family';
            tabFamily.classList.toggle('active', isFamily);
            tabBrands.classList.toggle('active', !isFamily);

            // Slide the pill
            if (tabSlider) {
                tabSlider.classList.toggle('right', !isFamily);
            }

            // Swap hero image
            if (heroImg) {
                const newSrc = isFamily ? heroImg.dataset.family : heroImg.dataset.brands;
                heroImg.style.opacity = '0';
                setTimeout(() => {
                    heroImg.src = newSrc;
                    heroImg.style.opacity = '1';
                }, 350);
            }

            // Switch content panels
            const current = isFamily ? contentBrands : contentFamily;
            const next = isFamily ? contentFamily : contentBrands;

            // Reset grid items in outgoing tab
            current.querySelectorAll('.home-tabs__grid-item').forEach(item => {
                item.classList.remove('visible');
            });
            current.classList.remove('active');

            // Show new content after hero starts appearing
            setTimeout(() => {
                next.classList.add('active');
                // Re-observe new grid items for scroll reveal
                next.querySelectorAll('.home-tabs__grid-item').forEach(item => {
                    item.classList.remove('visible');
                    gridObserver.observe(item);
                });
            }, 200);
        }

        tabFamily.addEventListener('click', () => switchTab('family'));
        tabBrands.addEventListener('click', () => switchTab('brands'));
    }

    // ── Grid items scroll reveal ─────────────
    const gridObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Stagger each item
                const items = [...entry.target.parentElement.children];
                const idx = items.indexOf(entry.target);
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, idx * 100);
                gridObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.home-tabs__grid-item').forEach(item => {
        gridObserver.observe(item);
    });

    // ── Portfolio Filter (subpages) ──────────
    const tabBtns = document.querySelectorAll('.tab-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            portfolioItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    // ── Scroll Animations ─────────────────────
    const fadeElements = document.querySelectorAll(
        '.service-card, .about-grid, .contact-grid, .portfolio-header, blockquote'
    );

    fadeElements.forEach(el => el.classList.add('fade-in'));

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    fadeElements.forEach(el => fadeObserver.observe(el));


    // ── Contact Form (Netlify Forms) ─────────
    const contactForm = document.getElementById('contactForm');
    if (contactForm) contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('.submit-btn');
        const originalText = btn.textContent;
        const formData = new FormData(contactForm);

        fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(formData).toString()
        }).then(() => {
            btn.textContent = currentLang === 'nl' ? 'Verzonden!' : 'Sent!';
            btn.style.background = '#5F929F';
            btn.style.color = '#F7F3EE';
            contactForm.reset();
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.style.color = '';
            }, 3000);
        }).catch(() => {
            btn.textContent = currentLang === 'nl' ? 'Fout, probeer opnieuw' : 'Error, try again';
            btn.style.background = '#c0392b';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.style.color = '';
            }, 3000);
        });
    });

    // ── Smooth scroll for anchor links ────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const y = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        });
    });

    // ── Re-init after dynamic content loads ──
    document.addEventListener('content-loaded', () => {
        // Re-observe grid items on homepage
        document.querySelectorAll('.home-tabs__grid-item').forEach(item => {
            gridObserver.observe(item);
        });

        // Re-observe fade-in elements
        document.querySelectorAll('.about-grid, .contact-grid, blockquote').forEach(el => {
            el.classList.add('fade-in');
            fadeObserver.observe(el);
        });

        // Update language to current selection
        updateLanguage();
    });

    // ── Lightbox with event delegation ───────
    document.addEventListener('click', (e) => {
        const item = e.target.closest('.portfolio-item');
        if (!item) return;
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightboxImg');
        if (!lightbox || !lightboxImg) return;

        const img = item.querySelector('img');
        if (!img) return;

        const allItems = [...document.querySelectorAll('.portfolio-item')];
        let lightboxIndex = allItems.indexOf(item);

        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';

        function closeLB() {
            lightbox.classList.remove('open');
            document.body.style.overflow = '';
            cleanup();
        }

        function navLB(dir) {
            lightboxIndex = (lightboxIndex + dir + allItems.length) % allItems.length;
            const nextImg = allItems[lightboxIndex].querySelector('img');
            lightboxImg.style.opacity = '0';
            setTimeout(() => {
                lightboxImg.src = nextImg.src;
                lightboxImg.style.opacity = '1';
            }, 150);
        }

        const onClose = () => closeLB();
        const onPrev = () => navLB(-1);
        const onNext = () => navLB(1);
        const onBg = (e) => { if (e.target === lightbox) closeLB(); };
        const onKey = (e) => {
            if (e.key === 'Escape') closeLB();
            if (e.key === 'ArrowLeft') navLB(-1);
            if (e.key === 'ArrowRight') navLB(1);
        };

        const closeBtn = document.getElementById('lightboxClose');
        const prevBtn = document.getElementById('lightboxPrev');
        const nextBtn = document.getElementById('lightboxNext');

        closeBtn.addEventListener('click', onClose);
        prevBtn.addEventListener('click', onPrev);
        nextBtn.addEventListener('click', onNext);
        lightbox.addEventListener('click', onBg);
        document.addEventListener('keydown', onKey);

        function cleanup() {
            closeBtn.removeEventListener('click', onClose);
            prevBtn.removeEventListener('click', onPrev);
            nextBtn.removeEventListener('click', onNext);
            lightbox.removeEventListener('click', onBg);
            document.removeEventListener('keydown', onKey);
        }
    });
});
