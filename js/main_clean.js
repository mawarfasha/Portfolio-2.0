// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    createGlassPanels();
    initNavigation();
    initScrollAnimations();
    initMobileMenu();
}

// ===== GLASS PANELS =====
function createGlassPanels() {
    // Remove any existing glass containers
    const existingGlass = document.querySelectorAll('.glass-container');
    existingGlass.forEach(container => container.remove());
    
    // Create glass container
    const glassContainer = document.createElement('div');
    glassContainer.className = 'glass-container';
    
    // Create ONE single glass panel covering the entire viewport
    const singlePanel = document.createElement('div');
    singlePanel.className = 'glass-panel';
    
    // Add panel to container
    glassContainer.appendChild(singlePanel);
    document.body.appendChild(glassContainer);
    
    console.log("Single unified glass panel created");
    
    // No need for positioning - CSS handles it with fixed positioning
}

// ===== NAVIGATION =====
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const rightPanel = document.querySelector('.right-panel');
    
    // Smooth scroll within the right panel
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection && rightPanel) {
                // Calculate the position relative to the right panel
                const rightPanelRect = rightPanel.getBoundingClientRect();
                const targetRect = targetSection.getBoundingClientRect();
                const scrollTop = rightPanel.scrollTop;
                const targetPosition = targetRect.top - rightPanelRect.top + scrollTop;
                
                // Smooth scroll within the right panel
                rightPanel.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active state
                updateActiveNav(link);
            }
        });
    });
    
    // Update active navigation on scroll within right panel
    function updateActiveNav(activeLink = null) {
        if (activeLink) {
            navLinks.forEach(link => link.classList.remove('active'));
            activeLink.classList.add('active');
        } else {
            // Auto-detect based on scroll position within right panel
            if (!rightPanel) return;
            
            let current = '';
            const rightPanelRect = rightPanel.getBoundingClientRect();
            const scrollTop = rightPanel.scrollTop;
            
            sections.forEach(section => {
                const sectionRect = section.getBoundingClientRect();
                const sectionTop = sectionRect.top - rightPanelRect.top + scrollTop;
                
                if (sectionTop <= rightPanel.scrollTop + 100) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }
    }
    
    // Update active nav on scroll within right panel
    if (rightPanel) {
        rightPanel.addEventListener('scroll', () => updateActiveNav());
    }
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    // Animate sections on scroll
    gsap.utils.toArray('.section').forEach((section, i) => {
        gsap.fromTo(section, 
            {
                opacity: 0,
                y: 50
            }, 
            {
                opacity: 1,
                y: 0,
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
    
    // Animate timeline items
    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
        gsap.fromTo(item,
            {
                opacity: 0,
                x: -30
            },
            {
                opacity: 1,
                x: 0,
                duration: 0.6,
                delay: i * 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: item,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });
    
    // Animate project cards
    gsap.utils.toArray('.project-card').forEach((card, i) => {
        gsap.fromTo(card,
            {
                opacity: 0,
                y: 30
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                delay: i * 0.15,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });
    
    // Parallax effect for hero elements
    if (window.innerWidth > 768) {
        gsap.to(".hero", {
            y: -50,
            ease: "none",
            scrollTrigger: {
                trigger: ".right-column",
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    }
}

// ===== MOBILE MENU =====
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!hamburger || !navMenu) return;
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// ===== UTILITY FUNCTIONS =====

// Smooth scroll for any element
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Debounce function for performance
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

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== PERFORMANCE OPTIMIZATIONS =====

// Optimize scroll events
const optimizedScrollHandler = throttle(() => {
    // Handle scroll events here
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Optimize resize events
const optimizedResizeHandler = debounce(() => {
    ScrollTrigger.refresh();
}, 250);

window.addEventListener('resize', optimizedResizeHandler);

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    ScrollTrigger.killAll();
});
