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
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        
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
    
    if (mapEl && window.L) {
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
                { name: 'Nairobi, Kenya', lat: -1.2921, lon: 36.8219, type: 'primary' },
                // Kenya - Regional Network
                { name: 'Mombasa, Kenya', lat: -4.0435, lon: 39.6682, type: 'kenya' },
                { name: 'Kisumu, Kenya', lat: -0.0917, lon: 34.7680, type: 'kenya' },
                { name: 'Eldoret, Kenya', lat: 0.5143, lon: 35.2698, type: 'kenya' },
                { name: 'Nakuru, Kenya', lat: -0.3031, lon: 36.0800, type: 'kenya' },
                { name: 'Machakos, Kenya', lat: -1.5177, lon: 37.2634, type: 'kenya' },
                // Other Countries - Regional Hubs
                { name: 'Kampala, Uganda', lat: 0.3476, lon: 32.5825, type: 'regional' },
                { name: 'Dar es Salaam, Tanzania', lat: -6.7924, lon: 39.2083, type: 'regional' },
                { name: 'Dodoma, Tanzania', lat: -6.1630, lon: 35.7516, type: 'regional' },
                { name: 'Kigali, Rwanda', lat: -1.9441, lon: 30.0619, type: 'regional' },
                { name: 'Bujumbura, Burundi', lat: -3.3614, lon: 29.3599, type: 'regional' },
                { name: 'Addis Ababa, Ethiopia', lat: 9.0320, lon: 38.7469, type: 'regional' }
            ];
            
            // Custom marker icons (location pins)
            const createMarkerIcon = (color) => L.divIcon({
                className: 'custom-marker',
                html: `<div style="position: relative;">
                    <svg width="32" height="42" viewBox="0 0 32 42" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3))">
                        <path d="M16 0C7.2 0 0 7.2 0 16c0 11.4 14.9 25.5 15.5 26 0.3 0.3 0.7 0.4 1 0.4s0.7-0.1 1-0.4c0.6-0.6 15.5-14.6 15.5-26C32 7.2 24.8 0 16 0z" fill="${color}"/>
                        <circle cx="16" cy="16" r="6" fill="white"/>
                    </svg>
                </div>`,
                iconSize: [32, 42],
                iconAnchor: [16, 42],
                popupAnchor: [0, -42]
            });
            
            const iconPrimary = createMarkerIcon('#EC4899'); // Pink for primary
            const iconRegional = createMarkerIcon('#3B82F6'); // Blue for regional
            const iconKenya = createMarkerIcon('#10B981'); // Green for Kenya network
            
            // Add markers for all cities
            cities.forEach(city => {
                let icon;
                if (city.type === 'primary') icon = iconPrimary;
                else if (city.type === 'kenya') icon = iconKenya;
                else icon = iconRegional;
                
                L.marker([city.lat, city.lon], { icon })
                    .addTo(map)
                    .bindPopup(`<div style="font-weight: 700; color: #0F172A; font-size: 14px;">${city.name}</div>`);
            });
            
            // Add routes from Nairobi to all other cities
            const nairobi = cities[0];
            cities.slice(1).forEach(city => {
                L.polyline(
                    [[nairobi.lat, nairobi.lon], [city.lat, city.lon]],
                    {
                        color: '#39d98a',
                        weight: 2,
                        opacity: 0.6,
                        dashArray: '8 12'
                    }
                ).addTo(map);
            });
            
            // Fit bounds to show all markers
            const bounds = L.latLngBounds(cities.map(c => [c.lat, c.lon]));
            map.fitBounds(bounds.pad(0.15));
            
            // Enable scroll zoom on click
            mapEl.addEventListener('click', () => {
                map.scrollWheelZoom.enable();
            }, { once: true });
            
            // Handle resize
            window.addEventListener('resize', () => {
                map.invalidateSize();
            });
            
        } catch (error) {
            console.error('Map initialization error:', error);
            mapEl.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#64748B;font-weight:600;">Map loading...</div>';
        }
    }
    
    // ============= RFQ FORM =============
    const rfqForm = $('#rfqForm');
    
    if (rfqForm) {
        rfqForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(rfqForm);
            const product = (formData.get('product') || '').trim();
            const pack = (formData.get('pack') || '').trim();
            const qty = (formData.get('qty') || '').trim();
            const dest = (formData.get('dest') || '').trim();
            const msg = (formData.get('msg') || '').trim();
            
            const subject = encodeURIComponent(`RFQ: ${product || 'Salt Products'}`);
            
            const bodyLines = [
                'REQUEST FOR QUOTE (RFQ)',
                '',
                `Product: ${product || '-'}`,
                `Pack size: ${pack || '-'}`,
                `Quantity: ${qty || '-'}`,
                `Destination: ${dest || '-'}`,
                '',
                'Additional notes:',
                msg || '-',
                '',
                'Sent via VIMAR website RFQ form',
                'popularcommodities@gmail.com'
            ];
            
            const body = encodeURIComponent(bodyLines.join('\n'));
            
            window.location.href = `mailto:popularcommodities@gmail.com?subject=${subject}&body=${body}`;
        });
    }
    
    // ============= QUALITY PROGRESS CIRCLE =============
    const progressBar = $('.progress-bar');
    if (progressBar) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate to 95%
                    const progress = 95;
                    const circumference = 2 * Math.PI * 90; // radius = 90
                    const offset = circumference - (progress / 100) * circumference;
                    progressBar.style.strokeDashoffset = offset;
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(progressBar);
    }
    
    // Add SVG gradient for progress circle
    const qualitySection = $('.quality-section');
    if (qualitySection && !$('#progressGradient')) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.style.position = 'absolute';
        svg.style.width = '0';
        svg.style.height = '0';
        svg.innerHTML = `
            <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#2C6287;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#14B8A6;stop-opacity:1" />
                </linearGradient>
            </defs>
        `;
        qualitySection.appendChild(svg);
    }
    
    // ============= ACCESSIBILITY =============
    document.addEventListener('keydown', (e) => {
        // ESC to close mobile menu
        if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
    
    // ============= PERFORMANCE OPTIMIZATIONS =============
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            handleScroll();
            if (mapEl && window.L && typeof map !== 'undefined') {
                map.invalidateSize();
            }
        }, 250);
    });
    
    // ============= CONSOLE MESSAGE =============
    console.log('%c✨ VIMAR Premium Website - FINAL VERSION', 'color: #2C6287; font-size: 20px; font-weight: bold;');
    console.log('%c🎬 Auto-switching slideshows active', 'color: #14B8A6; font-size: 14px;');
    console.log('%c💬 Conversational distribution design', 'color: #14B8A6; font-size: 14px;');
    console.log('%c🖼️ Story background with glassmorphism', 'color: #14B8A6; font-size: 14px;');
    console.log('%c✅ All features loaded successfully', 'color: #10B981; font-size: 14px; font-weight: bold;');
    
})();
