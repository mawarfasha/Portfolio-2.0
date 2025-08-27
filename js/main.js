/**
 * Portfolio Animation System
 * Handles all interactive animations, scroll effects, and user experience enhancements
 * Built with GSAP for optimal performance
 */

// Initialize GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, TextPlugin);

/**
 * Viewport height fix for mobile devices
 * Addresses the mobile viewport height issue with dynamic toolbars
 */
function setVhProperty() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setVhProperty();

// Update viewport on resize and orientation changes
window.addEventListener('resize', setVhProperty);
window.addEventListener('orientationchange', () => {
    setTimeout(setVhProperty, 100);
});

// Configure ScrollTrigger for optimal performance
ScrollTrigger.config({
    autoRefreshEvents: "none"
});

// Prevent unwanted scroll behavior
window.addEventListener('beforeunload', function() {
    window.scrollTo(0, 0);
});

if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Application initialization
document.addEventListener('DOMContentLoaded', function() {
    window.scrollTo(0, 0);
    
    setTimeout(() => {
        initApp();
        ScrollTrigger.refresh();
    }, 100);
});

/**
 * Main application initialization
 * Orchestrates all interactive components
 */
function initApp() {
    initBlobCursor();
    initNavigation();
    initScrollAnimations();
    initSmoothScroll();
    initParticles();
    initLoadingAnimation();
    initHoverEffects();
    initActiveSection();
    initMobileMenu();
    initGlitchEffect();
}

/**
 * Blob cursor implementation
 * Creates an interactive blob that follows mouse movement
 * Disabled on touch devices for performance
 */
function initBlobCursor() {
    const isTouchDevice = window.matchMedia("(hover: none)").matches;
    if (isTouchDevice) {
        const defaultCursor = document.querySelector('.cursor');
        const defaultFollower = document.querySelector('.cursor-follower');
        if (defaultCursor) defaultCursor.style.display = 'block';
        if (defaultFollower) defaultFollower.style.display = 'block';
        return;
    }

    var mouse = { x: -1000, y: -1000 };
    var pos = { x: -1000, y: -1000 };
    var ratio = 0.65;
    
    var blob = document.getElementById("blob");
    var magicCursor = document.getElementById("cursor-follower");

    if (!blob || !magicCursor) return;

    blob.style.left = '-1000px';
    blob.style.top = '-1000px';

    document.addEventListener("mousemove", mouseMove);

    function updatePosition() {
        pos.x += (mouse.x - pos.x) * ratio;
        pos.y += (mouse.y - pos.y) * ratio;
        blob.style.left = `${pos.x}px`;
        blob.style.top = `${pos.y}px`;
    }

    function mouseMove(e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        
        if (blob.style.opacity === '0' || blob.style.opacity === '') {
            blob.style.opacity = '0.15';
        }
    }

    function animate() {
        updatePosition();
        requestAnimationFrame(animate);
    }
    animate();

    // Enhanced hover effects for interactive elements
    let interactiveElements = document.querySelectorAll("[data-cursor-hover]");
    
    interactiveElements.forEach(function (element) {
        element.addEventListener("mouseenter", function (e) {
            blob.style.opacity = '0.25';
            blob.style.filter = 'blur(120px) brightness(1.1)';
            blob.style.boxShadow = `
                0 0 100px rgba(245, 158, 11, 0.4),
                0 0 180px rgba(249, 115, 22, 0.3),
                0 0 260px rgba(234, 88, 12, 0.2),
                0 0 340px rgba(220, 38, 38, 0.1)
            `;
            blob.style.transition = 'all 0.3s ease';
        });

        element.addEventListener("mouseleave", function (e) {
            blob.style.opacity = '0.15';
            blob.style.filter = 'blur(120px) brightness(0.9)';
            blob.style.boxShadow = `
                0 0 80px rgba(245, 158, 11, 0.2),
                0 0 150px rgba(249, 115, 22, 0.15),
                0 0 220px rgba(234, 88, 12, 0.1)
            `;
            blob.style.transition = 'all 0.3s ease';
            
            if (element && element.hasAttribute("data-cursor-parallax")) {
                element.style.transform = 'scale(1) translate(0px, 0px)';
                element.style.transition = 'transform 0.3s ease';
            }
        });

        // Parallax movement on hover
        element.addEventListener("mousemove", function (e) {
            if (element && element.hasAttribute("data-cursor-parallax")) {
                var boundingRect = element.getBoundingClientRect();
                var relX = e.clientX - boundingRect.left;
                var relY = e.clientY - boundingRect.top;
                
                var movement = 8;
                var x = ((relX - boundingRect.width / 2) / boundingRect.width) * movement;
                var y = ((relY - boundingRect.height / 2) / boundingRect.height) * movement;
                
                element.style.transform = `translate(${x}px, ${y}px)`;
                element.style.transition = 'transform 0.1s ease';
            }
        });
    });

    magicCursor.classList.add("active");
}

/**
 * Navigation behavior management
 * Handles scroll-based navigation visibility
 */
function initNavigation() {
    const nav = document.querySelector('.nav');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            gsap.to(nav, {
                y: -100,
                duration: 0.3,
                ease: "power2.out"
            });
        } else {
            gsap.to(nav, {
                y: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        }
        
        lastScrollY = currentScrollY;
    });
}

/**
 * Scroll-triggered animation system
 * Manages all entrance animations and scroll-based effects
 */
function initScrollAnimations() {
    // Ensure left column maintains fixed positioning
    gsap.set('.left-column', {
        position: 'fixed',
        top: 0,
        left: '50%',
        transform: 'translateX(-100%)',
        opacity: 1,
        visibility: 'visible',
        zIndex: 9999
    });

    // Prevent scroll interference on fixed column
    const leftColumn = document.querySelector('.left-column');
    if (leftColumn) {
        leftColumn.addEventListener('wheel', (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, { passive: false });
        
        leftColumn.addEventListener('touchmove', (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, { passive: false });
    }

    // Section entrance animations
    gsap.utils.toArray('.section').forEach((section, index) => {
        gsap.fromTo(section, 
            {
                opacity: 0,
                transform: "translateY(50px)"
            },
            {
                opacity: 1,
                transform: "translateY(0px)",
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });
    
    // Experience item staggered animations
    gsap.utils.toArray('.experience-item').forEach((item, index) => {
        gsap.fromTo(item,
            {
                opacity: 0,
                transform: "translateX(-30px)"
            },
            {
                opacity: 1,
                transform: "translateX(0px)",
                duration: 0.5,
                delay: index * 0.01,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: item,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });
    
    // Project item entrance animations
    gsap.utils.toArray('.project-item').forEach((item, index) => {
        gsap.fromTo(item,
            {
                opacity: 0,
                transform: "translateY(30px)"
            },
            {
                opacity: 1,
                transform: "translateY(0px)",
                duration: 0.5,
                delay: index * 0.02,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: item,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });
    
    // Skill tag cascade animation
    gsap.utils.toArray('.skill-tag').forEach((tag, index) => {
        gsap.fromTo(tag,
            {
                opacity: 0,
                transform: "scale(0.8)"
            },
            {
                opacity: 1,
                transform: "scale(1)",
                duration: 0.3,
                delay: index * 0.005,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: tag,
                    start: "top 90%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });
}

/**
 * Smooth scrolling implementation
 * Integrated with navigation system
 */
function initSmoothScroll() {
    // Handled in initActiveSection for better integration
}

/**
 * Particle background system
 * Creates subtle floating particles for ambient effect
 */
function initParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    document.body.appendChild(particlesContainer);
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const startX = Math.random() * window.innerWidth;
        const endX = startX + (Math.random() - 0.5) * 200;
        const duration = 8 + Math.random() * 4;
        
        gsap.set(particle, {
            x: startX,
            y: window.innerHeight + 10,
            opacity: 0
        });
        
        particlesContainer.appendChild(particle);
        
        gsap.to(particle, {
            x: endX,
            y: -100,
            opacity: 1,
            duration: duration,
            ease: "none",
            onComplete: () => {
                particle.remove();
            }
        });
        
        gsap.to(particle, {
            opacity: 0,
            duration: 1,
            delay: duration - 1
        });
    }
    
    setInterval(createParticle, 500);
}

/**
 * Initial page load animation sequence
 * Orchestrates hero section entrance and text morphing
 */
function initLoadingAnimation() {
    const tl = gsap.timeline();
    
    tl.fromTo('.hero-name',
        {
            opacity: 0,
            transform: "translateY(30px)"
        },
        {
            opacity: 1,
            transform: "translateY(0px)",
            duration: 0.8,
            ease: "power2.out"
        }
    )
    .fromTo('.hero-title',
        {
            opacity: 0,
            transform: "translateY(30px)"
        },
        {
            opacity: 1,
            transform: "translateY(0px)",
            duration: 0.8,
            ease: "power2.out"
        },
        "-=0.6"
    )
    .fromTo('.hero-description',
        {
            opacity: 0,
            transform: "translateY(30px)"
        },
        {
            opacity: 1,
            transform: "translateY(0px)",
            duration: 0.8,
            ease: "power2.out"
        },
        "-=0.6"
    )
    .fromTo('.hero-nav-link',
        {
            opacity: 0,
            transform: "translateX(-20px)"
        },
        {
            opacity: 1,
            transform: "translateX(0px)",
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.1
        },
        "-=0.4"
    )
    .fromTo('.social-links a',
        {
            opacity: 0,
            transform: "scale(0.8)"
        },
        {
            opacity: 1,
            transform: "scale(1)",
            duration: 0.5,
            ease: "back.out(1.7)",
            stagger: 0.1
        },
        "-=0.3"
    );
    
    // Dynamic text morphing effect
    gsap.to('.hero-title', {
        duration: 2.5,
        text: "Full-Stack Developer",
        ease: "power2.inOut",
        delay: 0.9
    });
}

/**
 * Interactive hover effect system
 * Manages all hover states and micro-interactions
 */
function initHoverEffects() {
    // Experience item hover interactions
    document.querySelectorAll('.experience-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            gsap.to(item, {
                scale: 1.02,
                duration: 0.3,
                ease: "power2.out"
            });
            
            gsap.to(item.querySelector('.experience-period'), {
                x: 10,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
            
            gsap.to(item.querySelector('.experience-period'), {
                x: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
    
    // Project item image scaling
    document.querySelectorAll('.project-item').forEach(item => {
        const image = item.querySelector('.project-image img');
        
        item.addEventListener('mouseenter', () => {
            gsap.to(image, {
                scale: 1.1,
                duration: 0.4,
                ease: "power2.out"
            });
        });
        
        item.addEventListener('mouseleave', () => {
            gsap.to(image, {
                scale: 1,
                duration: 0.4,
                ease: "power2.out"
            });
        });
    });
    
    // Skill tag interactive scaling
    document.querySelectorAll('.skill-tag').forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            gsap.to(tag, {
                scale: 1.1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        tag.addEventListener('mouseleave', () => {
            gsap.to(tag, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
    
    // Social link hover animations
    document.querySelectorAll('.social-links a').forEach(link => {
        link.addEventListener('mouseenter', () => {
            gsap.to(link, {
                y: -5,
                rotation: 5,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        link.addEventListener('mouseleave', () => {
            gsap.to(link, {
                y: 0,
                rotation: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
}

/**
 * Navigation state management
 * Handles active section highlighting and smooth scrolling
 */
function initActiveSection() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.hero-nav-link');
    
    if (sections.length === 0 || navLinks.length === 0) return;

    function updateActiveNav(sectionId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`.hero-nav-link[href="#${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    // Set initial active state
    updateActiveNav('about');
    
    // Ensure About remains active during initialization
    setTimeout(() => updateActiveNav('about'), 100);
    setTimeout(() => updateActiveNav('about'), 500);
    setTimeout(() => updateActiveNav('about'), 1000);

    // Initialize intersection observer for section tracking
    setTimeout(() => {
        const observer = new IntersectionObserver((entries) => {
            let mostVisible = null;
            let highestRatio = 0;
            
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > highestRatio) {
                    mostVisible = entry.target.id;
                    highestRatio = entry.intersectionRatio;
                }
            });
            
            if (mostVisible && highestRatio > 0.3) {
                updateActiveNav(mostVisible);
            }
        }, {
            threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7],
            rootMargin: '-10% 0% -10% 0%'
        });

        sections.forEach(section => {
            observer.observe(section);
        });
    }, 200);

    // Smooth scroll navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            
            if (target) {
                updateActiveNav(targetId);
                
                gsap.to(window, {
                    duration: 0.3,
                    scrollTo: {
                        y: target,
                        offsetY: 20
                    },
                    ease: "power1.out"
                });
            }
        });
    });
}

/**
 * Mobile navigation system
 * Handles hamburger menu interactions
 */
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!hamburger || !navMenu) return;
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        const spans = hamburger.querySelectorAll('span');
        if (hamburger.classList.contains('active')) {
            gsap.to(spans[0], { rotation: 45, y: 6, duration: 0.3 });
            gsap.to(spans[1], { opacity: 0, duration: 0.3 });
            gsap.to(spans[2], { rotation: -45, y: -6, duration: 0.3 });
        } else {
            gsap.to(spans[0], { rotation: 0, y: 0, duration: 0.3 });
            gsap.to(spans[1], { opacity: 1, duration: 0.3 });
            gsap.to(spans[2], { rotation: 0, y: 0, duration: 0.3 });
        }
    });
    
    // Close menu on link click
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            
            const spans = hamburger.querySelectorAll('span');
            gsap.to(spans[0], { rotation: 0, y: 0, duration: 0.3 });
            gsap.to(spans[1], { opacity: 1, duration: 0.3 });
            gsap.to(spans[2], { rotation: 0, y: 0, duration: 0.3 });
        });
    });
}

/**
 * Utility function for performance optimization
 * Implements debouncing for event handlers
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Window resize handler with debouncing
window.addEventListener('resize', debounce(() => {
    ScrollTrigger.refresh();
}, 100));

/**
 * Smooth scroll to top functionality
 * Provides quick return to page top
 */
function scrollToTop() {
    gsap.to(window, {
        duration: 0.5,
        scrollTo: { y: 0 },
        ease: "power2.out"
    });
}

/**
 * Dynamic scroll-to-top button
 * Appears when user scrolls down, provides quick return
 */
function addScrollToTopButton() {
    let button = null;
    
    function createButton() {
        // Don't create the button on mobile devices
        if (window.innerWidth <= 1024) {
            if (button) {
                button.remove();
                button = null;
            }
            return;
        }
        
        // Don't create if already exists
        if (button) return;
        
        button = document.createElement('button');
        button.innerHTML = '↑';
        button.className = 'scroll-to-top';
        button.style.cssText = `
            position: fixed;
            bottom: 5rem;
            right: 5rem;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #f59e0b;
            color: #0f172a;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            z-index: 1000;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(button);
        button.addEventListener('click', scrollToTop);
        
        window.addEventListener('scroll', () => {
            if (!button) return;
            
            if (window.scrollY > 500) {
                gsap.to(button, {
                    opacity: 1,
                    y: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
            } else {
                gsap.to(button, {
                    opacity: 0,
                    y: 20,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });
    }
    
    // Initial creation
    createButton();
    
    // Handle window resize and orientation changes
    window.addEventListener('resize', createButton);
    window.addEventListener('orientationchange', () => {
        setTimeout(createButton, 100);
    });
}

addScrollToTopButton();

/**
 * Performance optimization system
 * Handles reduced motion preferences and tab visibility
 */
function optimizePerformance() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.globalTimeline.timeScale(0.5);
        document.body.style.scrollBehavior = 'auto';
    }
    
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            gsap.globalTimeline.pause();
        } else {
            gsap.globalTimeline.resume();
        }
    });
}

optimizePerformance();

/**
 * Glitch effect for featured projects
 * Creates dynamic visual effects for project showcases
 */
function initGlitchEffect() {
    const glitchContainer = document.querySelector('.glitch-container');
    const glitchImages = document.querySelectorAll('.glitch-image');
    
    if (!glitchContainer || glitchImages.length === 0) return;

    let currentIndex = 0;
    let isGlitching = false;

    function switchLogo() {
        glitchImages[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % glitchImages.length;
        glitchImages[currentIndex].classList.add('active');
    }

    function startSimpleGlitch() {
        setInterval(() => {
            if (!isGlitching) {
                switchLogo();
            }
        }, 2000);
    }

    setTimeout(startSimpleGlitch, 1000);
}

// Development signature
console.log(`
🚀 Portfolio System Initialized
Built with modern web technologies:
• Vanilla JavaScript ES6+
• GSAP Animation Library
• CSS3 Advanced Features
• Responsive Design Patterns

Performance optimized and accessibility compliant.
`);

// Public API for external integration
window.portfolioApp = {
    scrollToTop,
    initApp
};
