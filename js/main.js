// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, TextPlugin);

// Fix viewport height on mobile devices
function setVhProperty() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Set initial viewport height
setVhProperty();

// Update viewport height on resize/orientation change
window.addEventListener('resize', setVhProperty);
window.addEventListener('orientationchange', () => {
    setTimeout(setVhProperty, 100);
});

// Disable auto-refresh and scroll restoration
ScrollTrigger.config({
    autoRefreshEvents: "none"
});

// Prevent any automatic scrolling and keep page at top
window.addEventListener('beforeunload', function() {
    window.scrollTo(0, 0);
});

// Prevent scroll restoration
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Force page to top and prevent any scroll triggers from firing initially
    window.scrollTo(0, 0);
    
    // Delay initialization to ensure page is stable
    setTimeout(() => {
        initApp();
        // Refresh ScrollTrigger after initialization
        ScrollTrigger.refresh();
    }, 100);
});

function initApp() {
    // Initialize all components
    initBlobCursor(); // Replace initCursor with blob cursor
    initNavigation();
    initScrollAnimations();
    initSmoothScroll();
    initParticles();
    initLoadingAnimation();
    initHoverEffects();
    initActiveSection();
    initMobileMenu();
    initGlitchEffect(); // Add glitch effect
}

// === BLOB CURSOR FOLLOWER ===
function initBlobCursor() {
    // Check if device supports hover (not a touch device)
    const isTouchDevice = window.matchMedia("(hover: none)").matches;
    if (isTouchDevice) {
        console.log('Touch device detected, skipping blob cursor');
        // Show default cursor on touch devices
        const defaultCursor = document.querySelector('.cursor');
        const defaultFollower = document.querySelector('.cursor-follower');
        if (defaultCursor) defaultCursor.style.display = 'block';
        if (defaultFollower) defaultFollower.style.display = 'block';
        return;
    }

    // Variables for smooth animation
    var mouse = { x: -1000, y: -1000 }; // Start off-screen
    var pos = { x: -1000, y: -1000 }; // Start off-screen
    var ratio = 0.65; // Controls how closely the blob follows the cursor (0-1)
    
    var blob = document.getElementById("blob");
    var magicCursor = document.getElementById("cursor-follower");

    if (!blob || !magicCursor) {
        console.log('Blob elements not found');
        return;
    }

    console.log('Initializing blob cursor...');

    // Set initial position off-screen
    blob.style.left = '-1000px';
    blob.style.top = '-1000px';

    // Track mouse movement
    document.addEventListener("mousemove", mouseMove);

    function updatePosition() {
        // Smoothly interpolate blob position towards mouse position
        pos.x += (mouse.x - pos.x) * ratio;
        pos.y += (mouse.y - pos.y) * ratio;
        blob.style.left = `${pos.x}px`;
        blob.style.top = `${pos.y}px`;
    }

    function mouseMove(e) {
        // Use clientX/clientY for viewport-relative positioning
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        
        // Show the blob after first mouse movement
        if (blob.style.opacity === '0' || blob.style.opacity === '') {
            blob.style.opacity = '0.15';
        }
    }

    // Animation loop using requestAnimationFrame for smooth performance
    function animate() {
        updatePosition();
        requestAnimationFrame(animate);
    }
    animate();

    // Add hover effects for elements with data-cursor-hover attribute
    let interactiveElements = document.querySelectorAll("[data-cursor-hover]");
    console.log('Found interactive elements:', interactiveElements.length);
    
    interactiveElements.forEach(function (element) {
        element.addEventListener("mouseenter", function (e) {
            // Increase blob intensity and add extra glow on hover (more subtle)
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
            // Reset blob to normal state when leaving (subtle default)
            blob.style.opacity = '0.15';
            blob.style.filter = 'blur(120px) brightness(0.9)';
            blob.style.boxShadow = `
                0 0 80px rgba(245, 158, 11, 0.2),
                0 0 150px rgba(249, 115, 22, 0.15),
                0 0 220px rgba(234, 88, 12, 0.1)
            `;
            blob.style.transition = 'all 0.3s ease';
            
            // Reset parallax transform if element has parallax
            if (element && element.hasAttribute("data-cursor-parallax")) {
                element.style.transform = 'scale(1) translate(0px, 0px)';
                element.style.transition = 'transform 0.3s ease';
            }
        });

        // Add parallax movement effect
        element.addEventListener("mousemove", function (e) {
            if (element && element.hasAttribute("data-cursor-parallax")) {
                var boundingRect = element.getBoundingClientRect();
                var relX = e.clientX - boundingRect.left;
                var relY = e.clientY - boundingRect.top;
                
                var movement = 8; // Adjust this value to control movement intensity
                var x = ((relX - boundingRect.width / 2) / boundingRect.width) * movement;
                var y = ((relY - boundingRect.height / 2) / boundingRect.height) * movement;
                
                element.style.transform = `translate(${x}px, ${y}px)`;
                element.style.transition = 'transform 0.1s ease';
            }
        });
    });

    // Activate the cursor follower
    magicCursor.classList.add("active");
    console.log('Blob cursor initialized successfully');
}

// Navigation functionality
function initNavigation() {
    const nav = document.querySelector('.nav');
    
    // Hide/show navigation on scroll
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // Scrolling down
            gsap.to(nav, {
                y: -100,
                duration: 0.3,
                ease: "power2.out"
            });
        } else {
            // Scrolling up
            gsap.to(nav, {
                y: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        }
        
        lastScrollY = currentScrollY;
    });
}

// Scroll-triggered animations
function initScrollAnimations() {
    // Ensure left column is always visible, fixed, and non-scrollable
    gsap.set('.left-column', {
        position: 'fixed',
        top: 0,
        left: '50%',
        transform: 'translateX(-100%)',
        opacity: 1,
        visibility: 'visible',
        zIndex: 9999
    });

    // Prevent scroll events on left column (simplified to preserve content)
    const leftColumn = document.querySelector('.left-column');
    if (leftColumn) {
        // Only prevent wheel scrolling to keep content visible
        leftColumn.addEventListener('wheel', (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, { passive: false });
        
        leftColumn.addEventListener('touchmove', (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, { passive: false });
    }

    // Animate sections on scroll
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
    
    // Animate experience items
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
    
    // Animate project items
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
    
    // Animate skill tags
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
                delay: index * 0.01,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: tag,
                    start: "top 90%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });
    
    // Parallax effect for hero section - DISABLED for fixed left column
    // gsap.to('.hero-content', {
    //     y: -50,
    //     scrollTrigger: {
    //         trigger: '.hero',
    //         start: "top top",
    //         end: "bottom top",
    //         scrub: 1
    //     }
    // });
}

// Smooth scroll for navigation links
function initSmoothScroll() {
    // This function is now handled in initActiveSection for better integration
    console.log('Smooth scroll integrated with navigation');
}

// Floating particles background
function initParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    document.body.appendChild(particlesContainer);
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position and animation
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
    
    // Create particles periodically
    setInterval(createParticle, 500);
}

// Loading animation
function initLoadingAnimation() {
    const tl = gsap.timeline();
    
    // Animate hero elements
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
    
    // Typewriter effect for hero title
    gsap.to('.hero-title', {
        duration: 2,
        text: "Full-Stack Developer",
        ease: "none",
        delay: 1
    });
}

// Hover effects
function initHoverEffects() {
    // Experience items hover
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
    
    // Project items hover
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
    
    // Skill tags hover
    document.querySelectorAll('.skill-tag').forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            gsap.to(tag, {
                scale: 1.1,
                duration: 0.2,
                ease: "power2.out"
            });
        });
        
        tag.addEventListener('mouseleave', () => {
            gsap.to(tag, {
                scale: 1,
                duration: 0.2,
                ease: "power2.out"
            });
        });
    });
    
    // Social links hover
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

// Active section highlighting
function initActiveSection() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.hero-nav-link');
    
    if (sections.length === 0 || navLinks.length === 0) {
        console.log('Sections or nav links not found');
        return;
    }

    // Function to update active nav link
    function updateActiveNav(sectionId) {
        // Remove active class from all links
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current link
        const activeLink = document.querySelector(`.hero-nav-link[href="#${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
            console.log('Active section:', sectionId);
        }
    }

    // Set About as default and ensure it stays active until user scrolls significantly
    updateActiveNav('about');
    
    // Force About to be active multiple times to ensure it sticks
    setTimeout(() => {
        updateActiveNav('about');
        console.log('Ensuring About stays active (100ms)');
    }, 100);
    
    setTimeout(() => {
        updateActiveNav('about');
        console.log('Ensuring About stays active (500ms)');
    }, 500);
    
    setTimeout(() => {
        updateActiveNav('about');
        console.log('Ensuring About stays active (1000ms)');
    }, 1000);

    // Start a more responsive intersection observer with minimal delay
    setTimeout(() => {
        const observer = new IntersectionObserver((entries) => {
            let mostVisible = null;
            let highestRatio = 0;
            
            // Find the section with the highest visibility ratio
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > highestRatio) {
                    mostVisible = entry.target.id;
                    highestRatio = entry.intersectionRatio;
                }
            });
            
            // Update navigation if we found a visible section with at least 30% visibility
            if (mostVisible && highestRatio > 0.3) {
                updateActiveNav(mostVisible);
            }
        }, {
            threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7], // Multiple thresholds for better detection
            rootMargin: '-10% 0% -10% 0%' // Less restrictive margins
        });

        // Observe all sections
        sections.forEach(section => {
            observer.observe(section);
        });
    }, 200); // Reduced delay from 2000ms to 200ms

    // Add click handlers to navigation links for smooth scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            
            if (target) {
                // Update active state immediately when clicked
                updateActiveNav(targetId);
                
                // Smooth scroll to target with proper offset
                gsap.to(window, {
                    duration: 0.3,
                    scrollTo: {
                        y: target,
                        offsetY: 20 // Reduced offset since we removed top padding
                    },
                    ease: "power1.out"
                });
            }
        });
    });
}

// Mobile menu
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!hamburger || !navMenu) return;
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Animate hamburger
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
    
    // Close menu when clicking on links
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

// Utility functions
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

// Window resize handler
window.addEventListener('resize', debounce(() => {
    ScrollTrigger.refresh();
}, 100));

// Scroll to top functionality
function scrollToTop() {
    gsap.to(window, {
        duration: 0.5,
        scrollTo: { y: 0 },
        ease: "power2.out"
    });
}

// Add scroll to top button
function addScrollToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'scroll-to-top';
    button.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #64ffda;
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
    
    // Show/hide based on scroll position
    window.addEventListener('scroll', () => {
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

// Initialize scroll to top button
addScrollToTopButton();

// Performance optimization
function optimizePerformance() {
    // Reduce motion for users who prefer it
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.globalTimeline.timeScale(0.5);
        document.body.style.scrollBehavior = 'auto';
    }
    
    // Pause animations when tab is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            gsap.globalTimeline.pause();
        } else {
            gsap.globalTimeline.resume();
        }
    });
}

// Initialize performance optimizations
optimizePerformance();

// Console easter egg
console.log(`
🚀 Portfolio built with:
• HTML5 & CSS3
• Vanilla JavaScript
• GSAP (GreenSock Animation Platform)
• Love and attention to detail

// === GLITCH EFFECT FOR FICO PROJECT ===
function initGlitchEffect() {
    console.log('Initializing glitch effect...');
    
    const glitchContainer = document.querySelector('.glitch-container');
    const glitchImages = document.querySelectorAll('.glitch-image');
    
    console.log('Glitch container found:', glitchContainer);
    console.log('Glitch images found:', glitchImages.length);
    
    if (!glitchContainer || glitchImages.length === 0) {
        console.log('Glitch elements not found');
        return;
    }

    let currentIndex = 0;
    let isGlitching = false;

    // Simple function to switch between logos
    function switchLogo() {
        console.log('Switching logo from', currentIndex);
        
        // Remove active class from current image
        glitchImages[currentIndex].classList.remove('active');
        
        // Move to next image
        currentIndex = (currentIndex + 1) % glitchImages.length;
        
        // Add active class to new image
        glitchImages[currentIndex].classList.add('active');
        
        console.log('Switched to logo', currentIndex);
    }

    // Start with a simple test - switch every 2 seconds
    function startSimpleGlitch() {
        console.log('Starting glitch loop...');
        setInterval(() => {
            if (!isGlitching) {
                switchLogo();
            }
        }, 2000);
    }

    // Start the effect
    setTimeout(startSimpleGlitch, 1000);
    
    console.log('Glitch effect initialized');
}

Built by [Your Name]
GitHub: https://github.com/yourusername
`);

// Export functions for potential external use
window.portfolioApp = {
    scrollToTop,
    initApp
};
