// ============================================
// Content Loader - Fetches JSON from Decap CMS
// and injects into the DOM
// ============================================

(async function () {
    // Determine which page we're on
    const path = window.location.pathname;
    let pageType = 'homepage';
    if (path.includes('families')) pageType = 'families';
    else if (path.includes('brands')) pageType = 'brands';

    // Fetch content files in parallel
    const contentFiles = ['/content/shared.json'];
    if (pageType === 'homepage') contentFiles.push('/content/homepage.json');
    else if (pageType === 'families') contentFiles.push('/content/families.json');
    else if (pageType === 'brands') contentFiles.push('/content/brands.json');

    let shared, pageData;
    try {
        const results = await Promise.all(contentFiles.map(f => fetch(f).then(r => r.json())));
        shared = results[0];
        pageData = results[1];
    } catch (e) {
        // JSON not available - fall back to hardcoded HTML
        console.log('Content loader: using fallback HTML content');
        return;
    }

    // Helper: set bilingual text on an element
    function setText(el, en, nl) {
        if (!el) return;
        el.setAttribute('data-en', en);
        el.setAttribute('data-nl', nl);
        // Set visible text to current language
        const lang = document.documentElement.lang || 'en';
        el.textContent = lang === 'nl' ? nl : en;
    }

    // Helper: set image src
    function setImg(el, src, alt) {
        if (!el) return;
        el.src = src;
        if (alt) el.alt = alt;
    }

    // Helper: build gallery HTML
    function buildGallery(container, images, itemClass) {
        if (!container || !images) return;
        container.innerHTML = '';
        images.forEach(img => {
            const div = document.createElement('div');
            div.className = itemClass || 'portfolio-item';
            const imgEl = document.createElement('img');
            imgEl.src = img.image;
            imgEl.alt = img.alt || '';
            imgEl.loading = 'lazy';
            div.appendChild(imgEl);
            container.appendChild(div);
        });
    }

    // ── Apply shared content ─────────────────
    if (shared) {
        const about = shared.about;
        if (about) {
            const aboutImg = document.querySelector('.about-image img');
            if (aboutImg) setImg(aboutImg, about.image, 'Luz Chequer');
            setText(document.querySelector('.about-content .section-label'), about.label_en, about.label_nl);
            setText(document.querySelector('.about-content h2'), about.heading_en, about.heading_nl);
        }

        const contact = shared.contact;
        if (contact) {
            setText(document.querySelector('.contact-info .section-label'), contact.label_en, contact.label_nl);
            setText(document.querySelector('.contact-info h2'), contact.heading_en, contact.heading_nl);
            setText(document.querySelector('.contact-info > p'), contact.description_en, contact.description_nl);

            // Update contact links
            const emailLink = document.querySelector('.contact-link[href^="mailto:"]');
            if (emailLink) {
                emailLink.href = 'mailto:' + contact.email;
                const textNode = emailLink.lastChild;
                if (textNode) textNode.textContent = '\n                        ' + contact.email + '\n                    ';
            }
            const phoneLink = document.querySelector('.contact-link[href^="tel:"]');
            if (phoneLink) {
                phoneLink.href = 'tel:' + contact.phone.replace(/\s/g, '');
                const textNode = phoneLink.lastChild;
                if (textNode) textNode.textContent = '\n                        ' + contact.phone + '\n                    ';
            }
        }
    }

    // ── Apply page-specific content ──────────
    if (pageType === 'homepage' && pageData) {
        // Hero images
        const heroImg = document.getElementById('heroImg');
        if (heroImg && pageData.hero) {
            heroImg.dataset.family = pageData.hero.family_image;
            heroImg.dataset.brands = pageData.hero.brands_image;
            heroImg.src = pageData.hero.family_image;
        }

        // Family tab
        const ft = pageData.family_tab;
        if (ft) {
            setText(document.querySelector('#contentFamily h2'), ft.heading_en, ft.heading_nl);
            setText(document.querySelector('#contentFamily > p'), ft.description_en, ft.description_nl);
            setText(document.querySelector('#contentFamily .home-tabs__cta'), ft.cta_en, ft.cta_nl);
            const familyGrid = document.querySelector('#contentFamily .home-tabs__grid');
            if (familyGrid && ft.grid_images) {
                buildGallery(familyGrid, ft.grid_images, 'home-tabs__grid-item');
            }
        }

        // Brands tab
        const bt = pageData.brands_tab;
        if (bt) {
            setText(document.querySelector('#contentBrands h2'), bt.heading_en, bt.heading_nl);
            setText(document.querySelector('#contentBrands > p'), bt.description_en, bt.description_nl);
            setText(document.querySelector('#contentBrands .home-tabs__cta'), bt.cta_en, bt.cta_nl);
            const brandsGrid = document.querySelector('#contentBrands .home-tabs__grid');
            if (brandsGrid && bt.grid_images) {
                buildGallery(brandsGrid, bt.grid_images, 'home-tabs__grid-item');
            }
        }

        // About paragraphs (homepage-specific)
        if (pageData.about && pageData.about.paragraphs) {
            const aboutContent = document.querySelector('.about-content');
            if (aboutContent) {
                const existingPs = aboutContent.querySelectorAll('p');
                existingPs.forEach(p => p.remove());
                pageData.about.paragraphs.forEach(para => {
                    const p = document.createElement('p');
                    setText(p, para.en, para.nl);
                    aboutContent.appendChild(p);
                });
            }
        }

    } else if ((pageType === 'families' || pageType === 'brands') && pageData) {
        // Subpage hero
        const heroImg = document.querySelector('.page-hero img');
        if (heroImg) setImg(heroImg, pageData.hero_image);
        setText(document.querySelector('.page-hero-content h1'), pageData.title_en, pageData.title_nl);
        setText(document.querySelector('.page-hero-content p'), pageData.hero_description_en, pageData.hero_description_nl);

        // Intro
        setText(document.querySelector('.page-intro h2'), pageData.intro_heading_en, pageData.intro_heading_nl);
        setText(document.querySelector('.page-intro p'), pageData.intro_text_en, pageData.intro_text_nl);

        // Gallery
        const grid = document.getElementById('portfolioGrid');
        if (grid && pageData.gallery_images) {
            buildGallery(grid, pageData.gallery_images, 'portfolio-item');
        }

        // Quote
        const quoteP = document.querySelector('blockquote p');
        if (quoteP && pageData.quote_en) {
            setText(quoteP, pageData.quote_en, pageData.quote_nl);
        }

        // About paragraphs (page-specific)
        if (pageData.about_paragraphs) {
            const aboutContent = document.querySelector('.about-content');
            if (aboutContent) {
                const existingPs = aboutContent.querySelectorAll('p');
                existingPs.forEach(p => p.remove());
                pageData.about_paragraphs.forEach(para => {
                    const p = document.createElement('p');
                    setText(p, para.en, para.nl);
                    aboutContent.appendChild(p);
                });
            }
        }
    }

    // Notify script.js that content is ready
    document.dispatchEvent(new CustomEvent('content-loaded'));
})();
