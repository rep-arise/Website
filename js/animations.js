/**
 * Rep Arise Animations
 * This file handles all animations and interactive elements for the website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Header scroll effect
    const header = document.querySelector('header');
    const navMenu = document.querySelectorAll('.nav-menu a');
    
    // Set active menu item based on current page
    const currentLocation = window.location.pathname;
    navMenu.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentLocation.endsWith(linkPath) || 
            (linkPath === 'index.html' && (currentLocation === '/' || currentLocation.endsWith('/')))) {
            link.classList.add('active');
        }
    });
    
    // Header scroll animation
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Add animation to nav menu items
    navMenu.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            item.style.transition = 'all 0.4s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 100 + (index * 100));
    });
    
    // Add animation to nav icons
    const navIcons = document.querySelectorAll('.nav-icons a');
    navIcons.forEach((icon, index) => {
        icon.style.opacity = '0';
        icon.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            icon.style.transition = 'all 0.4s ease';
            icon.style.opacity = '1';
            icon.style.transform = 'translateY(0)';
        }, 500 + (index * 100));
    });

    // Mobile menu toggle - Updated for enhanced mobile navigation
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenuList = document.querySelector('.nav-menu');
    const body = document.body;
    
    // Create nav overlay if it doesn't exist
    let navOverlay = document.querySelector('.nav-overlay');
    if (!navOverlay) {
        navOverlay = document.createElement('div');
        navOverlay.classList.add('nav-overlay');
        document.body.appendChild(navOverlay);
    }
    
    if (menuToggle && navMenuList) {
        menuToggle.addEventListener('click', function() {
            // Toggle active classes
            menuToggle.classList.toggle('active');
            navMenuList.classList.toggle('active');
            navOverlay.classList.toggle('active');
            
            // Prevent body scrolling when menu is open
            if (navMenuList.classList.contains('active')) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
            
            // Animate the hamburger icon
            const icon = this.querySelector('i');
            if (icon) {
                if (navMenuList.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
        
        // Close menu when clicking on a menu item
        const menuItems = navMenuList.querySelectorAll('a');
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                navMenuList.classList.remove('active');
                navOverlay.classList.remove('active');
                body.style.overflow = '';
                
                // Reset hamburger icon
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
        
        // Close menu when clicking on overlay
        navOverlay.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            navMenuList.classList.remove('active');
            navOverlay.classList.remove('active');
            body.style.overflow = '';
            
            // Reset hamburger icon
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Cart sidebar toggle
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const closeCart = document.querySelector('.close-cart');
    
    if (cartIcon && cartSidebar) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            cartSidebar.classList.add('active');
            navOverlay.classList.add('active');
        });
    }
    
    if (closeCart && cartSidebar) {
        closeCart.addEventListener('click', function() {
            cartSidebar.classList.remove('active');
            navOverlay.classList.remove('active');
        });
    }

    // Wishlist sidebar toggle
    const wishlistIcon = document.querySelector('.wishlist-icon');
    const wishlistSidebar = document.querySelector('.wishlist-sidebar');
    const closeWishlist = document.querySelector('.close-wishlist');
    
    if (wishlistIcon && wishlistSidebar) {
        wishlistIcon.addEventListener('click', function(e) {
            e.preventDefault();
            wishlistSidebar.classList.add('active');
            navOverlay.classList.add('active');
        });
    }
    
    if (closeWishlist && wishlistSidebar) {
        closeWishlist.addEventListener('click', function() {
            wishlistSidebar.classList.remove('active');
            navOverlay.classList.remove('active');
        });
    }

    // Close sidebars when clicking overlay
    navOverlay.addEventListener('click', function() {
        if (cartSidebar) cartSidebar.classList.remove('active');
        if (wishlistSidebar) wishlistSidebar.classList.remove('active');
        navOverlay.classList.remove('active');
        body.style.overflow = '';
    });

    // Enhanced scroll reveal animations
    const revealElements = document.querySelectorAll('.section-title, .section-subtitle, .service-item, .brand-item, .proof-item');
    
    const revealOnScroll = function() {
        const windowHeight = window.innerHeight;
        
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    };
    
    // Initial check on page load
    revealOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', revealOnScroll);

    // Animate social proof numbers when they come into view
    const proofItems = document.querySelectorAll('.proof-item');
    const proofNumbers = document.querySelectorAll('.proof-number');
    
    const animateNumbers = function() {
        proofItems.forEach(item => {
            const itemTop = item.getBoundingClientRect().top;
            const itemVisible = 150;
            
            if (itemTop < window.innerHeight - itemVisible) {
                item.classList.add('animated');
            }
        });
    };
    
    window.addEventListener('scroll', animateNumbers);
    
    // Floating animation for certain elements
    const floatElements = document.querySelectorAll('.hero .btn, .instagram-cta .btn');
    floatElements.forEach(element => {
        element.classList.add('animate-float');
    });

    // Enhanced hover effects for brand items
    const brandItems = document.querySelectorAll('.brand-item');
    brandItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.05)';
            this.style.boxShadow = '0 20px 40px rgba(123, 44, 191, 0.4)';
            this.style.borderColor = 'rgba(157, 78, 221, 0.3)';
            
            // Add glow effect on hover
            const brandImage = this.querySelector('.brand-image img');
            if (brandImage) {
                brandImage.style.transform = 'scale(1.1) rotateY(10deg)';
                brandImage.style.filter = 'drop-shadow(0 15px 20px rgba(123, 44, 191, 0.5))';
            }
            
            // Animate brand name underline
            const brandName = this.querySelector('.brand-name');
            if (brandName) {
                brandName.style.color = 'var(--primary-light)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
            this.style.borderColor = '';
            
            const brandImage = this.querySelector('.brand-image img');
            if (brandImage) {
                brandImage.style.transform = '';
                brandImage.style.filter = '';
            }
            
            const brandName = this.querySelector('.brand-name');
            if (brandName) {
                brandName.style.color = '';
            }
        });
    });

    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const x = e.clientX - e.target.getBoundingClientRect().left;
            const y = e.clientY - e.target.getBoundingClientRect().top;
            
            const ripple = document.createElement('span');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add animated shapes to hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        // Create circle shape
        const circleShape = document.createElement('div');
        circleShape.classList.add('hero-shape', 'circle');
        heroSection.appendChild(circleShape);
        
        // Create square shape
        const squareShape = document.createElement('div');
        squareShape.classList.add('hero-shape', 'square');
        heroSection.appendChild(squareShape);
    }
    
    // Add glowing orbs to CTA section
    const ctaSection = document.querySelector('.cta-section');
    if (ctaSection) {
        // Create three glowing orbs
        for (let i = 1; i <= 3; i++) {
            const glowOrb = document.createElement('div');
            glowOrb.classList.add('cta-glow');
            ctaSection.appendChild(glowOrb);
        }
    }
    
    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        
        if (heroSection) {
            heroSection.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
        }
    });
    
    // Enhanced hover effect for CTA button
    const ctaButton = document.querySelector('.cta-section .btn');
    if (ctaButton) {
        ctaButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.05)';
            this.style.boxShadow = '0 15px 35px rgba(123, 44, 191, 0.7)';
        });
        
        ctaButton.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    }
    
    // Add 3D tilt effect to brand items
    brandItems.forEach(item => {
        item.addEventListener('mousemove', function(e) {
            const itemRect = this.getBoundingClientRect();
            const x = e.clientX - itemRect.left;
            const y = e.clientY - itemRect.top;
            
            const xPercent = (x / itemRect.width - 0.5) * 20;
            const yPercent = (y / itemRect.height - 0.5) * 20;
            
            this.style.transform = `perspective(1000px) rotateX(${-yPercent}deg) rotateY(${xPercent}deg) translateY(-15px) scale(1.05)`;
            
            const brandImage = this.querySelector('.brand-image img');
            if (brandImage) {
                brandImage.style.transform = `rotateY(${xPercent * 1.5}deg) scale(1.1)`;
            }
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = '';
            
            const brandImage = this.querySelector('.brand-image img');
            if (brandImage) {
                brandImage.style.transform = '';
            }
        });
    });
    
    // Add scroll-triggered animations for section titles
    const sectionTitles = document.querySelectorAll('.section-title');
    const sectionSubtitles = document.querySelectorAll('.section-subtitle');
    
    const animateSections = function() {
        const windowHeight = window.innerHeight;
        
        sectionTitles.forEach(title => {
            const titleTop = title.getBoundingClientRect().top;
            if (titleTop < windowHeight - 100) {
                title.classList.add('active');
            }
        });
        
        sectionSubtitles.forEach(subtitle => {
            const subtitleTop = subtitle.getBoundingClientRect().top;
            if (subtitleTop < windowHeight - 100) {
                subtitle.classList.add('active');
            }
        });
    };
    
    // Initial check
    animateSections();
    
    // Check on scroll
    window.addEventListener('scroll', animateSections);
});

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