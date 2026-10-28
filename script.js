/* ==========================================
   VIMAR PREMIUM - FINAL COMPLETE JAVASCRIPT
   Auto-Switching Slideshows + All Features
   ========================================== */

(function() {
    'use strict';
    
    // Helper functions
    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => Array.from(document.querySelectorAll(selector));

    const CONTACT_EMAIL = 'popularcommodities@gmail.com';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // ============= THEME TOGGLE =============
    const themeToggle = $('#themeToggle');
    const html = document.documentElement;
    
    // Check for saved theme preference or default to 'light'
    const currentTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', currentTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const theme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            html.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        });
    }
    
    // ============= LOADER =============
    // Previously this waited for window.load plus a flat 2200ms, so on a slow
    // mobile connection the splash could sit there for many seconds, and if
    // anything threw before it the page stayed covered for good.
    (function initLoader() {
        const loader = $('#loader');
        if (!loader) return;

        let done = false;
        const hide = () => {
            if (done) return;
            done = true;
            loader.classList.add('hidden');
            setTimeout(() => {
                loader.remove();
                document.body.style.overflow = '';
            }, 500);
        };

        if (document.readyState === 'complete') {
            setTimeout(hide, 400);
        } else {
            window.addEventListener('load', () => setTimeout(hide, 600));
        }

        // Failsafe: never let the splash trap the page.
        setTimeout(hide, 4000);
    })();
    
    // ============= CURRENT YEAR =============
    const yearEl = $('#year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
    
    // ============= NAVIGATION SCROLL =============
    const nav = $('#nav');
    const progressFill = $('.progress-fill');
    
    function handleScroll() {
        const scrolled = window.pageYOffset || document.documentElement.scrollTop;
        
        // Nav scrolled state
        if (nav) {
            if (scrolled > 20) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }
        
        // Progress bar
        if (progressFill) {
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = (scrolled / docHeight) * 100;
            progressFill.style.width = scrollPercent + '%';
        }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    // ============= MOBILE MENU =============
    const navToggle = $('#navToggle');
    const mobileNav = $('#mobileNav');
    
    function setBurger(open) {
        if (!navToggle) return;
        navToggle.classList.toggle('is-open', open);
        navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    function openMobileMenu() {
        if (!mobileNav) return;
        mobileNav.classList.add('active');
        document.body.style.overflow = 'hidden';
        setBurger(true);
    }

    function closeMobileMenu() {
        if (!mobileNav) return;
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
        setBurger(false);
    }

    function toggleMobileMenu() {
        if (!navToggle || !mobileNav) return;
        if (mobileNav.classList.contains('active')) closeMobileMenu();
        else openMobileMenu();
    }

    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileMenu);
        setBurger(false);
    }

    // Close mobile menu on link click
    if (mobileNav) {
        $$('#mobileNav a').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }

    // Close the mobile menu with Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('active')) {
            closeMobileMenu();
            if (navToggle) navToggle.focus();
        }
    });

    // ============= SMOOTH SCROLL =============
    $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            
            const target = $(href);
            if (!target) return;
            
            e.preventDefault();
            
            const navHeight = nav ? nav.offsetHeight : 0;
            const targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
            
            window.scrollTo({
                top: targetPos,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
            
            // Update URL
            history.pushState(null, '', href);
        });
    });
    
    // ============= PARALLAX EFFECT (Story Background) =============
    const aboutBg = $('.about-bg');
    const heroImage = $('.hero-image');
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;

        // Subtle parallax for hero background image
        if (heroImage && scrolled < 1200) {
            const heroOffset = scrolled * 0.25;
            heroImage.style.transform = `translateY(${heroOffset}px)`;
        }
        
        if (aboutBg && scrolled < 2000) {
            const offset = scrolled * 0.5;
            const img = aboutBg.querySelector('.about-img');
            if (img) {
                img.style.transform = `scale(1.1) translateY(${offset}px)`;
            }
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });
    
    // ============= SCROLL REVEAL ANIMATION =============
    const reveals = $$('.reveal');
    
    if ('IntersectionObserver' in window && reveals.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // A fast fling can carry an element past the viewport between
                // two observer samples, so it never reports as intersecting and
                // the content would stay at opacity:0 for good. Treat anything
                // already above the fold as revealed.
                if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -80px 0px'
        });

        reveals.forEach(el => observer.observe(el));

        // Belt and braces: anything scrolled past is shown regardless.
        const sweepReveals = () => {
            let remaining = 0;
            reveals.forEach(el => {
                if (el.classList.contains('visible')) return;
                if (el.getBoundingClientRect().top < window.innerHeight) {
                    el.classList.add('visible');
                    observer.unobserve(el);
                } else {
                    remaining++;
                }
            });
            if (remaining === 0) window.removeEventListener('scroll', onScrollSweep);
        };
        let sweepTimer = null;
        const onScrollSweep = () => {
            if (sweepTimer) return;
            sweepTimer = setTimeout(() => { sweepTimer = null; sweepReveals(); }, 200);
        };
        window.addEventListener('scroll', onScrollSweep, { passive: true });
    } else {
        // Fallback for older browsers
        reveals.forEach(el => el.classList.add('visible'));
    }
    
    // ============= PRODUCT SLIDESHOWS - AUTO-SWITCHING =============
    const products = $$('.product-card');
    
    products.forEach(product => {
        const slides = product.querySelectorAll('.slider-item');
        const dotsContainer = product.querySelector('.slider-dots');
        if (!dotsContainer || slides.length === 0) return;
        
        let currentSlide = 0;
        let slideInterval = null;
        let fadeTimer = null;
        let inView = true;
        let hovered = false;
        
        // Create dots as real buttons so they are focusable and announced
        // Not a tablist: that role promises role="tab" children wired to
        // tabpanels, and these only choose which photo of one product shows.
        dotsContainer.setAttribute('role', 'group');
        dotsContainer.setAttribute('aria-label', 'Product image');
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'slider-dot' + (index === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Show image ${index + 1} of ${slides.length}`);
            dot.setAttribute('aria-current', index === 0 ? 'true' : 'false');
            dot.addEventListener('click', () => {
                goToSlide(index);
                startAutoPlay();
            });
            dotsContainer.appendChild(dot);
        });
        
        const dots = product.querySelectorAll('.slider-dot');
        
        function goToSlide(index) {
            if (index === currentSlide) return;

            // A pending fade from a previous call would overwrite currentSlide
            // with a stale value, so settle it before starting a new one.
            if (fadeTimer) {
                clearTimeout(fadeTimer);
                fadeTimer = null;
                slides.forEach(s => s.classList.remove('fade-out'));
            }

            slides[currentSlide].classList.add('fade-out');
            dots[currentSlide].classList.remove('active');
            dots[currentSlide].setAttribute('aria-current', 'false');
            dots[index].setAttribute('aria-current', 'true');

            const from = currentSlide;
            currentSlide = index;

            fadeTimer = setTimeout(() => {
                slides[from].classList.remove('active', 'fade-out');
                slides[currentSlide].classList.add('active');
                dots[currentSlide].classList.add('active');
                fadeTimer = null;
            }, 100);
        }

        function nextSlide() {
            goToSlide((currentSlide + 1) % slides.length);
        }

        // Always clear first: hover-out and the IntersectionObserver could both
        // call this and stack intervals, making the slides accelerate.
        function startAutoPlay() {
            stopAutoPlay();
            if (!inView || hovered || prefersReducedMotion) return;
            if (slides.length < 2) return;
            slideInterval = setInterval(nextSlide, 4000);
        }

        function stopAutoPlay() {
            if (slideInterval) {
                clearInterval(slideInterval);
                slideInterval = null;
            }
        }
        
        // Start auto-play immediately
        startAutoPlay();
        
        // Pause on hover, resume on leave
        product.addEventListener('mouseenter', () => {
            hovered = true;
            stopAutoPlay();
        });

        product.addEventListener('mouseleave', () => {
            hovered = false;
            startAutoPlay();
        });

        // Stop when product card is out of view (performance optimization)
        if ('IntersectionObserver' in window) {
            const slideObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    inView = entry.isIntersecting;
                    if (inView) startAutoPlay();
                    else stopAutoPlay();
                });
            }, { threshold: 0.1 });

            slideObserver.observe(product);
        }

        // Don't keep timers running in a hidden tab
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) stopAutoPlay();
            else startAutoPlay();
        });
    });
    
    // ============= PRODUCT MODAL =============
    const modal = $('#productModal');
    const modalBackdrop = $('.modal-backdrop');
    const modalClose = $('#modalClose');
    const detailButtons = $$('.btn-details');
    let lastFocused = null;
    
    const productData = {
        fine: {
            title: 'Sea Salt Fine (Iodized)',
            image: 'assets/products/sea-salt-fine-iodized.jpg',
            desc: 'Premium fine-grain iodized sea salt, perfect for everyday cooking and table use. Fortified with iodine to meet nutritional standards and support consistent consumer-ready supply.',
            grade: 'Fine',
            grain: '0.1 - 0.5mm',
            iodized: 'Yes (30-40 ppm)',
            pack: '300g, 500g, 1kg, 5kg cartons, Bulk',
            shelf: '36 months',
            storage: 'Cool, dry place. Avoid moisture.',
            uses: [
                'Table salt and general seasoning',
                'Cooking and food preparation',
                'Baking applications',
                'Retail consumer packs',
                'Food service and hospitality'
            ]
        },
        powder: {
            title: 'Sea Salt Fine Powder',
            image: 'assets/products/sea-salt-fine-powder.jpg',
            desc: 'Ultra-fine powder salt for industrial and commercial baking applications requiring rapid dissolution and even distribution. Ideal for manufacturing workflows.',
            grade: 'Fine Powder',
            grain: '< 0.1mm (ultra-fine)',
            iodized: 'Optional',
            pack: '500g, 1kg, 10kg, 25kg bags, Bulk',
            shelf: '36 months',
            storage: 'Cool, dry place. Moisture-proof packaging.',
            uses: [
                'Commercial baking and pastries',
                'Industrial food processing',
                'Seasoning blends and mixes',
                'Dry cure applications',
                'Instant food preparations'
            ]
        },
        coarse: {
            title: 'Sea Salt Coarse',
            image: 'assets/products/sea-salt-coarse.jpg',
            desc: 'Large-grain coarse salt ideal for brining, curing, and processing applications where controlled seasoning and larger granules improve control and texture.',
            grade: 'Coarse',
            grain: '2 - 5mm',
            iodized: 'No',
            pack: '500g, 1kg, 5kg, 25kg bags, Bulk',
            shelf: '36 months',
            storage: 'Dry storage. Industrial-grade packaging.',
            uses: [
                'Meat and fish brining',
                'Food processing and preservation',
                'Large-scale cooking operations',
                'Grinder refills for restaurants',
                'Curing and pickling'
            ]
        },
        pink: {
            title: 'Himalayan Pink Salt',
            image: 'assets/products/himalayan-pink-salt.jpg',
            desc: 'Premium mineral-rich pink salt crystals sourced from ancient Himalayan deposits. Natural pink color from trace minerals including iron, magnesium, and calcium.',
            grade: 'Premium Crystals',
            grain: '1 - 3mm crystals',
            iodized: 'Natural (trace minerals)',
            pack: '300g, 500g, 1kg, Premium packaging',
            shelf: 'Indefinite (stable)',
            storage: 'Dry storage. Premium retail packaging.',
            uses: [
                'Gourmet cooking and finishing',
                'Premium table salt',
                'Specialty food preservation',
                'Health-conscious consumers',
                'Gift and premium retail markets'
            ]
        }
    };
    
    function openModal(productKey) {
        const data = productData[productKey];
        if (!data || !modal) return;
        
        // Populate modal
        const modalImg = $('#modalImg');
        modalImg.src = data.image;
        modalImg.alt = data.title;
        $('#modalTitle').textContent = data.title;
        $('#modalDesc').textContent = data.desc;
        $('#specGrade').textContent = data.grade;
        $('#specGrain').textContent = data.grain;
        $('#specIodized').textContent = data.iodized;
        $('#specPack').textContent = data.pack;
        $('#specShelf').textContent = data.shelf;
        $('#specStorage').textContent = data.storage;
        
        // Populate uses
        const usesList = $('#modalUsesList');
        usesList.innerHTML = '';
        data.uses.forEach(use => {
            const li = document.createElement('li');
            li.textContent = use;
            usesList.appendChild(li);
        });
        
        // Show modal
        lastFocused = document.activeElement;
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (modalClose) modalClose.focus();
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        // Send focus back where it came from instead of dropping it to <body>
        if (lastFocused && typeof lastFocused.focus === 'function') {
            lastFocused.focus();
            lastFocused = null;
        }
    }

    // Keep Tab inside the dialog while it is open
    function trapFocus(e) {
        if (e.key !== 'Tab' || !modal || !modal.classList.contains('active')) return;
        const focusables = Array.from(modal.querySelectorAll(
            'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
        )).filter(el => el.offsetParent !== null);
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }
    document.addEventListener('keydown', trapFocus);
    
    // Attach event listeners
    detailButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const productType = btn.dataset.product;
            openModal(productType);
        });
    });
    
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', closeModal);
    }
    
    // Close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Modal "Request Quote" button
    const btnQuote = $('#btnQuote');
    if (btnQuote) {
        btnQuote.addEventListener('click', (e) => {
            e.preventDefault();
            const productInput = $('#rfqProduct');
            const modalTitle = $('#modalTitle');
            if (productInput && modalTitle) {
                productInput.value = modalTitle.textContent;
            }
            closeModal();
            const rfqSection = $('#rfq');
            if (rfqSection) {
                const navHeight = nav ? nav.offsetHeight : 0;
                const y = rfqSection.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                window.scrollTo({ top: y, behavior: 'smooth' });
                setTimeout(() => productInput?.focus(), 600);
            }
        });
    }
    
    // ============= HERO PRODUCT STAGE =============
    // One cut-out holds the frame at a time; the set crossfades on a timer and
    // the tint behind it follows the active jar's label colour.
    (function heroStage() {
        const stage = $('#heroStage');
        if (!stage) return;

        const items = Array.from(stage.querySelectorAll('.stage-item'));
        const dotsWrap = $('#stageDots');
        const cap = $('#stageCap');
        if (items.length < 2 || !dotsWrap || !cap) return;

        const INTERVAL = 3000;
        let current = 0;
        let timer = null;
        let hovered = false;
        let inView = true;

        const dots = items.map((item, i) => {
            const b = document.createElement('button');
            b.type = 'button';
            // Plain buttons in a group, not tabs: role="tab" requires a
            // tablist parent and a tabpanel to control, and the hero stage
            // has neither.
            b.setAttribute('aria-label', item.dataset.name || `Product ${i + 1}`);
            b.setAttribute('aria-current', i === 0 ? 'true' : 'false');
            b.addEventListener('click', () => {
                show(i);
                restart();
            });
            dotsWrap.appendChild(b);
            return b;
        });

        function show(next) {
            if (next === current) return;
            const from = items[current];
            const to = items[next];

            from.classList.remove('is-active');
            from.classList.add('is-leaving');
            // Clear the leaving state once the transition has had time to run,
            // otherwise the class sticks and the jar re-enters from the wrong
            // place next time round.
            setTimeout(() => from.classList.remove('is-leaving'), 900);

            to.classList.add('is-active');

            dots[current].setAttribute('aria-current', 'false');
            dots[next].setAttribute('aria-current', 'true');

            const tint = to.dataset.tint;
            if (tint) stage.style.setProperty('--tint', tint);

            cap.innerHTML = '';
            const b = document.createElement('b');
            b.textContent = to.dataset.name || '';
            const s = document.createElement('span');
            // data-meta carries a &middot; which parses to the character here
            s.textContent = (to.dataset.meta || '').replace(/&middot;/g, '·');
            cap.appendChild(b);
            cap.appendChild(s);

            current = next;
        }

        function tick() {
            show((current + 1) % items.length);
        }

        function start() {
            stop();
            if (hovered || !inView) return;
            // Reduced motion still advances, it just does not animate: the CSS
            // collapses the transitions, so the product swaps without movement.
            // Stopping the timer outright left the hero looking broken for
            // anyone with "reduce motion" enabled in their OS.
            timer = setInterval(tick, INTERVAL);
        }

        function stop() {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
        }

        function restart() {
            stop();
            start();
        }

        stage.addEventListener('mouseenter', () => { hovered = true; stop(); });
        stage.addEventListener('mouseleave', () => { hovered = false; start(); });

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) stop();
            else start();
        });

        if ('IntersectionObserver' in window) {
            const obs = new IntersectionObserver((entries) => {
                entries.forEach(e => {
                    inView = e.isIntersecting;
                    if (inView) start();
                    else stop();
                });
            }, { threshold: 0.2 });
            obs.observe(stage);
        }

        // Seed the tint from the jar that starts active
        const first = items[0].dataset.tint;
        if (first) stage.style.setProperty('--tint', first);

        start();
    })();

    // ============= RFQ FORM =============
    // Without this the form had no handler, no action and no method, so
    // submitting it just reloaded the page and the enquiry was lost.
    const rfqForm = $('#rfqForm');

    if (rfqForm) {
        rfqForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(rfqForm);
            const get = (k) => (formData.get(k) || '').toString().trim();
            const product = get('product');
            const pack = get('pack');
            const qty = get('qty');
            const dest = get('dest');
            const msg = get('msg');

            const subject = encodeURIComponent(`RFQ: ${product || 'Sea salt enquiry'}`);

            const bodyLines = [
                'REQUEST FOR QUOTE',
                '',
                `Product: ${product || '-'}`,
                `Pack size: ${pack || '-'}`,
                `Quantity: ${qty || '-'}`,
                `Destination: ${dest || '-'}`,
                '',
                'Additional requirements:',
                msg || '-',
                '',
                'Sent via the VIMAR website'
            ];

            const body = encodeURIComponent(bodyLines.join('\n'));
            window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;

            const note = rfqForm.querySelector('.form-note');
            if (note) {
                note.textContent = 'Opening your email app… if nothing happens, email ' + CONTACT_EMAIL;
            }
        });
    }

    // ============= QUALITY PROGRESS RING =============
    // The ring is drawn with stroke-dashoffset; nothing was animating it, so
    // it sat permanently empty next to the "95%" label.
    const ring = $('.progress-ring-fill');
    if (ring) {
        const target = parseFloat(ring.dataset.progress || '0');
        const circumference = 2 * Math.PI * (parseFloat(ring.getAttribute('r')) || 90);
        ring.style.strokeDasharray = String(circumference);
        ring.style.strokeDashoffset = String(circumference);

        const fill = () => {
            ring.style.strokeDashoffset = String(circumference * (1 - target / 100));
        };

        if ('IntersectionObserver' in window) {
            const ringObs = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    // Same fast-scroll guard as the reveals above
                    if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
                        fill();
                        ringObs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.4 });
            ringObs.observe(ring);
        } else {
            fill();
        }
    }

    // ============= RESPONSIVE SAFETY =============
    // Opening the mobile menu sets body overflow:hidden. Crossing back above
    // the breakpoint (rotate / resize) left it stuck, freezing page scroll.
    function handleResize() {
        if (window.innerWidth > 768 && mobileNav && mobileNav.classList.contains('active')) {
            closeMobileMenu();
        }
    }
    window.addEventListener('resize', handleResize, { passive: true });
    handleResize();

    // ============= LEAFLET MAP WITH ALL CITIES =============
    const mapEl = $('#map');

    function initLeafletMap() {
        if (!mapEl || !window.L) return;

        try {
            const isTouch = window.matchMedia('(hover: none)').matches || 'ontouchstart' in window;

            // Initialize map. On touch the map starts locked so a swipe over it
            // scrolls the page instead of being swallowed; tapping unlocks it.
            // Previously dragging was simply off on every touch device, which
            // left the map completely unpannable on phones and tablets.
            const map = L.map('map', {
                zoomControl: false,
                scrollWheelZoom: false,
                dragging: !isTouch,
                tap: true,
                doubleClickZoom: true
            }).setView([-1.5, 35.5], 5);

            if (isTouch) {
                const unlock = document.createElement('button');
                unlock.type = 'button';
                unlock.className = 'map-unlock';
                unlock.innerHTML = '<span>Tap to explore the map</span>';
                unlock.addEventListener('click', () => {
                    map.dragging.enable();
                    unlock.remove();
                });
                mapEl.appendChild(unlock);
            }

            // Add zoom control
            L.control.zoom({ position: 'bottomright' }).addTo(map);

            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // All cities with coordinates
            const cities = [
                // Kenya - Primary Hub
                { name: 'Nairobi, Kenya', coords: [-1.2921, 36.8219], type: 'primary' },

                // Kenya Cities
                { name: 'Mombasa, Kenya', coords: [-4.0435, 39.6682], type: 'kenya' },
                { name: 'Kisumu, Kenya', coords: [-0.0917, 34.7680], type: 'kenya' },
                { name: 'Eldoret, Kenya', coords: [0.5143, 35.2698], type: 'kenya' },
                { name: 'Nakuru, Kenya', coords: [-0.3031, 36.0800], type: 'kenya' },
                { name: 'Machakos, Kenya', coords: [-1.5177, 37.2634], type: 'kenya' },

                // Regional Hubs
                { name: 'Kampala, Uganda', coords: [0.3476, 32.5825], type: 'regional' },
                { name: 'Dar es Salaam, Tanzania', coords: [-6.7924, 39.2083], type: 'regional' },
                { name: 'Dodoma, Tanzania', coords: [-6.1630, 35.7516], type: 'regional' },
                { name: 'Kigali, Rwanda', coords: [-1.9706, 30.1044], type: 'regional' },
                { name: 'Bujumbura, Burundi', coords: [-3.3614, 29.3599], type: 'regional' },
                { name: 'Addis Ababa, Ethiopia', coords: [8.9806, 38.7578], type: 'regional' }
            ];

            // Marker styles
            const markerStyles = {
                primary: { radius: 10, color: '#FFFFFF', weight: 2, fillColor: '#0B5ED7', fillOpacity: 0.95 },
                regional: { radius: 8, color: '#FFFFFF', weight: 2, fillColor: '#0EA5E9', fillOpacity: 0.9 },
                kenya: { radius: 7, color: '#FFFFFF', weight: 2, fillColor: '#2563EB', fillOpacity: 0.88 }
            };

            // Add markers
            cities.forEach(city => {
                const style = markerStyles[city.type] || markerStyles.regional;
                L.circleMarker(city.coords, style)
                    .addTo(map)
                    .bindPopup(`<b>${city.name}</b>`, { closeButton: true });
            });

            // Fit bounds to show all markers
            const bounds = L.latLngBounds(cities.map(c => c.coords));
            map.fitBounds(bounds.pad(0.2));

            // Leaflet sometimes needs a resize tick when the map is revealed/animated
            const refresh = () => { try { map.invalidateSize(); } catch(_) {} };
            setTimeout(refresh, 250);
            window.addEventListener('resize', refresh, { passive: true });

        } catch (error) {
            console.error('Map initialization error:', error);
            mapEl.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#64748B;font-weight:600;">Map failed to load. Please refresh.</div>';
        }
    }

    const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    const LEAFLET_JS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    let leafletRequested = false;

    function mapFailed(reason) {
        console.error(reason);
        mapEl.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#64748B;font-weight:600;">Map failed to load. Please refresh.</div>';
    }

    function loadLeafletThenInit() {
        if (!mapEl || leafletRequested) return;
        leafletRequested = true;

        // If Leaflet is already present, init immediately
        if (window.L) {
            initLeafletMap();
            return;
        }

        // The stylesheet used to sit in the <head>, where it blocked the first
        // render on a third-party connection for a section most visitors never
        // reach. Both files are fetched here instead, at the point of use.
        //
        // Wait for the CSS as well as the script: Leaflet measures the
        // container when L.map() runs, and an unstyled .leaflet-container has
        // no dimensions, which lands every tile in the wrong place.
        let pending = 2;
        const ready = () => { if (--pending === 0) initLeafletMap(); };

        const css = document.createElement('link');
        css.rel = 'stylesheet';
        css.href = LEAFLET_CSS;
        css.onload = ready;
        // A blocked stylesheet should not cost us the map entirely.
        css.onerror = ready;
        document.head.appendChild(css);

        const s = document.createElement('script');
        s.src = LEAFLET_JS;
        s.onload = ready;
        s.onerror = () => { pending = Infinity; mapFailed('Leaflet script failed to load.'); };
        document.head.appendChild(s);
    }

    // Roughly 190KB of CSS and JS for a section a long way down the page, so
    // it is fetched only once the map is close to being seen. The margin gives
    // it a head start, and the boundingClientRect check covers a fast fling
    // that carries the map past the viewport between two observer samples.
    if (mapEl) {
        if ('IntersectionObserver' in window) {
            const mapObserver = new IntersectionObserver((entries, obs) => {
                if (entries.some(e => e.isIntersecting || e.boundingClientRect.top < 0)) {
                    obs.disconnect();
                    loadLeafletThenInit();
                }
            }, { rootMargin: '500px 0px' });
            mapObserver.observe(mapEl);
        } else {
            loadLeafletThenInit();
        }
    }
})();
