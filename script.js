/* ==========================================
   VIMAR PREMIUM - FINAL COMPLETE JAVASCRIPT
   Auto-Switching Slideshows + All Features
   ========================================== */

(function() {
    'use strict';
    
    // Helper functions
    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => Array.from(document.querySelectorAll(selector));
    
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
    window.addEventListener('load', () => {
        const loader = $('#loader');
        if (loader) {
            setTimeout(() => {
                loader.classList.add('hidden');
                setTimeout(() => {
                    loader.remove();
                    document.body.style.overflow = '';
                }, 500);
            }, 2200);
        }
    });
    
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
    
    function toggleMobileMenu() {
        if (!navToggle || !mobileNav) return;
        
        const isActive = mobileNav.classList.contains('active');
        mobileNav.classList.toggle('active');
        document.body.style.overflow = isActive ? '' : 'hidden';
        
        // Animate burger
        const spans = navToggle.querySelectorAll('span');
        if (!isActive) {
            spans[0].style.transform = 'rotate(45deg) translate(8px, 8px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(8px, -8px)';
        } else {
            spans.forEach(span => {
                span.style.transform = '';
                span.style.opacity = '1';
            });
        }
    }
    
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu on link click
    if (mobileNav) {
        $$('#mobileNav a').forEach(link => {
            link.addEventListener('click', () => {
                if (mobileNav.classList.contains('active')) {
                    toggleMobileMenu();
                }
            });
        });
    }
    
    // ============= SMOOTH SCROLL =============
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
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
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -80px 0px'
        });
        
        reveals.forEach(el => observer.observe(el));
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
        let slideInterval;
        let isAutoPlaying = true;
        
        // Create dots
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'slider-dot' + (index === 0 ? ' active' : '');
            dot.addEventListener('click', () => {
                stopAutoPlay();
                goToSlide(index);
                startAutoPlay();
            });
            dotsContainer.appendChild(dot);
        });
        
        const dots = product.querySelectorAll('.slider-dot');
        
        function goToSlide(index) {
            // Add fade-out class to current
            slides[currentSlide].classList.add('fade-out');
            dots[currentSlide].classList.remove('active');
            
            // Small delay for fade-out effect
            setTimeout(() => {
                slides[currentSlide].classList.remove('active', 'fade-out');
                currentSlide = index;
                slides[currentSlide].classList.add('active');
                dots[currentSlide].classList.add('active');
            }, 100);
        }
        
        function nextSlide() {
            goToSlide((currentSlide + 1) % slides.length);
        }
        
        function startAutoPlay() {
            if (!isAutoPlaying) return;
            slideInterval = setInterval(nextSlide, 4000); // 4 seconds per slide
        }
        
        function stopAutoPlay() {
            clearInterval(slideInterval);
        }
        
        // Start auto-play immediately
        startAutoPlay();
        
        // Pause on hover, resume on leave
        product.addEventListener('mouseenter', () => {
            isAutoPlaying = false;
            stopAutoPlay();
        });
        
        product.addEventListener('mouseleave', () => {
            isAutoPlaying = true;
            startAutoPlay();
        });
        
        // Stop when product card is out of view (performance optimization)
        if ('IntersectionObserver' in window) {
            const slideObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) {
                        isAutoPlaying = false;
                        stopAutoPlay();
                    } else {
                        isAutoPlaying = true;
                        startAutoPlay();
                    }
                });
            }, { threshold: 0.1 });
            
            slideObserver.observe(product);
        }
    });
    
    // ============= PRODUCT MODAL =============
    const modal = $('#productModal');
    const modalBackdrop = $('.modal-backdrop');
    const modalClose = $('#modalClose');
    const detailButtons = $$('.btn-details');
    
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
        $('#modalImg').src = data.image;
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
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
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
    
    // ============= LEAFLET MAP WITH ALL CITIES =============
    const mapEl = $('#map');

    function initLeafletMap() {
        if (!mapEl || !window.L) return;

        try {
            // Initialize map
            const map = L.map('map', {
                zoomControl: false,
                scrollWheelZoom: false,
                dragging: !('ontouchstart' in window),
                tap: true,
                doubleClickZoom: true
            }).setView([-1.5, 35.5], 5);

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

    function loadLeafletThenInit() {
        if (!mapEl) return;

        // If Leaflet is already present, init immediately
        if (window.L) {
            initLeafletMap();
            return;
        }

        // Dynamically load Leaflet as a fallback (covers blocked SRI / CDN hiccups)
        const s = document.createElement('script');
        s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        s.onload = initLeafletMap;
        s.onerror = () => {
            console.error('Leaflet script failed to load.');
            mapEl.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#64748B;font-weight:600;">Map failed to load (Leaflet unavailable).</div>';
        };
        document.head.appendChild(s);
    }

    loadLeafletThenInit();
})();
