/* ==========================================
   PINK SALT PAGE - JAVASCRIPT
   Scroll Animations & Interactions
   ========================================== */

(function() {
    'use strict';
    
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => Array.from(document.querySelectorAll(sel));
    
    // ============= THEME TOGGLE =============
    const themeToggle = $('#themeToggle');
    const html = document.documentElement;
    
    const currentTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', currentTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const theme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            html.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        });
    }
    
    // ============= CURRENT YEAR =============
    const yearEl = $('#yearPink');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
    
    // ============= NAVIGATION SCROLL =============
    const nav = $('#nav');
    
    function handleScroll() {
        const scrolled = window.pageYOffset || document.documentElement.scrollTop;
        
        if (nav) {
            if (scrolled > 20) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
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
            
            history.pushState(null, '', href);
        });
    });
    
    // ============= SCROLL REVEAL ANIMATIONS =============
    const reveals = $$('.reveal-up, .reveal-slide-right, .reveal-slide-left, .reveal-scale, .reveal-fade');
    
    if ('IntersectionObserver' in window && reveals.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });
        
        reveals.forEach(el => observer.observe(el));
    } else {
        reveals.forEach(el => el.classList.add('visible'));
    }
    
    // ============= RFQ FORM =============
    const rfqForm = $('#rfqFormPink');
    
    if (rfqForm) {
        rfqForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(rfqForm);
            const product = (formData.get('product') || '').trim();
            const qty = (formData.get('qty') || '').trim();
            const dest = (formData.get('dest') || '').trim();
            const msg = (formData.get('msg') || '').trim();
            
            const subject = encodeURIComponent(`Pink Salt RFQ: ${product}`);
            
            const bodyLines = [
                'HIMALAYAN PINK SALT - REQUEST FOR QUOTE',
                '',
                `Product: ${product}`,
                `Quantity: ${qty}`,
                `Destination: ${dest}`,
                '',
                'Additional Details:',
                msg || '-',
                '',
                'Sent via VIMAR Pink Salt website',
                'popularcommodities@gmail.com'
            ];
            
            const body = encodeURIComponent(bodyLines.join('\n'));
            
            window.location.href = `mailto:popularcommodities@gmail.com?subject=${subject}&body=${body}`;
        });
    }
    
    // ============= PARALLAX HERO IMAGE =============
    const heroImage = $('.hero-image');
    let parallaxTicking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        
        if (heroImage && scrolled < 1000) {
            const offset = scrolled * 0.3;
            heroImage.style.transform = `translateY(${offset}px)`;
        }
        
        parallaxTicking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!parallaxTicking) {
            window.requestAnimationFrame(updateParallax);
            parallaxTicking = true;
        }
    }, { passive: true });
    
    // ============= ACCESSIBILITY =============
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
    
    
    // ============= RESPONSIVE SAFETY (NO SIDEWAYS / NO STUCK OVERFLOW) =============
    function handleResize() {
        // If we exit mobile breakpoint, ensure body scrolling is restored and nav is closed
        if (window.innerWidth > 768 && mobileNav && mobileNav.classList.contains('active')) {
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
            if (navToggle) {
                const spans = navToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = '';
                    span.style.opacity = '1';
                });
            }
        }
    }
    window.addEventListener('resize', handleResize, { passive: true });
    handleResize();


// ============= CONSOLE MESSAGE =============
    console.log('%c✨ VIMAR Himalayan Pink Salt', 'color: #EC4899; font-size: 24px; font-weight: bold;');
    console.log('%c🎨 Premium Design with Creative Animations', 'color: #14B8A6; font-size: 14px;');
    console.log('%c💎 Exceptional Quality  •  Perfect Presentation', 'color: #2C6287; font-size: 14px;');
    
})();
