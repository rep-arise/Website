/**
 * Rep Arise Animations
 * This file handles all animations and interactive elements for the website
 */

(() => {
    // DOM helper functions
    const $ = selector => document.querySelector(selector);
    const $$ = selector => document.querySelectorAll(selector);
    const createElement = (tag, className) => {
        const el = document.createElement(tag);
        if (className) el.className = className;
        return el;
    };

    // Animation utilities
    const animate = {
        fadeInUp: (element, delay = 0, duration = 400) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                element.style.transition = `all ${duration}ms ease`;
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, delay);
        },

        stagger: (elements, callback, baseDelay = 100) => {
            elements.forEach((el, i) => callback(el, baseDelay + (i * baseDelay)));
        }
    };

    // Navigation functionality
    const nav = {
        init() {
            this.initActiveMenuItem();
            this.initHeaderScroll();
            this.initMenuAnimations();
            this.initMobileMenu();
        },

        initActiveMenuItem() {
    const currentLocation = window.location.pathname;
            $$('.nav-menu a').forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentLocation.endsWith(linkPath) || 
            (linkPath === 'index.html' && (currentLocation === '/' || currentLocation.endsWith('/')))) {
            link.classList.add('active');
        }
    });
        },

        initHeaderScroll() {
            const header = $('header');
            if (!header) return;

            let lastScroll = window.scrollY;
            const scrollThreshold = 50;

            window.addEventListener('scroll', () => {
                const currentScroll = window.scrollY;
                if (Math.abs(currentScroll - lastScroll) > 5) {
                    header.classList.toggle('scrolled', currentScroll > scrollThreshold);
                    lastScroll = currentScroll;
                }
            }, { passive: true });
        },

        initMenuAnimations() {
            // Animate menu items
            animate.stagger($$('.nav-menu a'), (item, delay) => {
                animate.fadeInUp(item, delay);
            });

            // Animate nav icons
            animate.stagger($$('.nav-icons a'), (icon, delay) => {
                animate.fadeInUp(icon, delay + 400);
            });
        },

        initMobileMenu() {
            const menuToggle = $('.menu-toggle');
            const navMenu = $('.nav-menu');
            let navOverlay = $('.nav-overlay');

            if (!navOverlay) {
                navOverlay = createElement('div', 'nav-overlay');
                document.body.appendChild(navOverlay);
            }

            if (menuToggle && navMenu) {
                const toggleMenu = (active) => {
                    menuToggle.classList.toggle('active', active);
                    navMenu.classList.toggle('active', active);
                    navOverlay.classList.toggle('active', active);
                    document.body.style.overflow = active ? 'hidden' : '';

                    const icon = menuToggle.querySelector('i');
                    if (icon) {
                        icon.className = `fas fa-${active ? 'times' : 'bars'}`;
                    }
                };

                menuToggle.addEventListener('click', () => toggleMenu(!navMenu.classList.contains('active')));
                navOverlay.addEventListener('click', () => toggleMenu(false));
                navMenu.querySelectorAll('a').forEach(item => item.addEventListener('click', () => toggleMenu(false)));
            }
        }
    };

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', () => nav.init());
})();

// Footer animations
document.addEventListener('DOMContentLoaded', function() {
    // Intersection Observer for footer animations
    const footerSections = document.querySelectorAll('.footer-about-us, .footer-links, .footer-contact, .footer-bottom');
    
    const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                footerObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });
    
    footerSections.forEach(section => {
        footerObserver.observe(section);
    });
    
    // Add hover effect to footer links
    const footerLinks = document.querySelectorAll('.footer-links a, .footer-contact a');
    footerLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
            this.style.transform = 'translateX(5px)';
            this.style.color = 'var(--primary-light)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transition = 'all 0.3s ease';
            this.style.transform = 'translateX(0)';
            this.style.color = '';
        });
    });
    
    // Add subtle animation to footer background
    const footer = document.querySelector('footer');
    if (footer) {
        let mouseX = 0;
        let mouseY = 0;
        
        document.addEventListener('mousemove', function(e) {
            mouseX = e.clientX / window.innerWidth;
            mouseY = e.clientY / window.innerHeight;
            
            if (isElementInViewport(footer)) {
                footer.style.setProperty('--mouse-x', mouseX);
                footer.style.setProperty('--mouse-y', mouseY);
            }
        });
    }
    
    // Helper function to check if element is in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0 &&
            rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
            rect.right >= 0
        );
    }
}); 