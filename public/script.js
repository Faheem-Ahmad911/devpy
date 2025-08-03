// Initialize variables and state
let currentPage = 'home';
let mobileMenuOpen = false;
let isDarkMode = true; // Default to dark mode

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen after a short delay
    setTimeout(() => {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.classList.add('hidden');
        }
    }, 1000);

    // Initialize AOS animations
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }

    // Initialize scroll events
    initScrollEvents();
    
    // Initialize form submission
    initFormSubmission();
    
    // Initialize form validation
    initFormValidation();
    
    // Animate statistics counters
    animateCounters();
    
    // Set initial theme
    updateThemeIcon();
    
    // Initialize mobile touch events
    initMobileEvents();
    
    // Initialize navigation highlighting
    initNavigation();
});

/**
 * Navigation Functions
 */

// Initialize navigation highlighting based on current page
function initNavigation() {
    // Get current page from URL or default to index
    const currentPath = window.location.pathname;
    let currentPageFromPath = 'home';
    
    if (currentPath.includes('about')) currentPageFromPath = 'about';
    else if (currentPath.includes('services')) currentPageFromPath = 'services';
    else if (currentPath.includes('contact')) currentPageFromPath = 'contact';
    
    // Update navigation active state
    updateNavigation(currentPageFromPath);
}

// Update navigation active state
function updateNavigation(page) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Find and activate the corresponding nav link
    const activeLink = document.querySelector(`[data-page="${page}"]`);
    if (activeLink && activeLink.classList.contains('nav-link')) {
        activeLink.classList.add('active');
    }
    
    currentPage = page;
}

// Toggle mobile navigation menu
function toggleMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    const mobileMenuIcon = document.getElementById('mobileMenuIcon');
    
    if (!navMenu || !mobileMenuIcon) return;
    
    mobileMenuOpen = !mobileMenuOpen;
    
    // Toggle menu visibility
    navMenu.classList.toggle('active');
    
    // Change hamburger to X icon and vice versa
    if (mobileMenuOpen) {
        mobileMenuIcon.className = 'fas fa-times';
    } else {
        mobileMenuIcon.className = 'fas fa-bars';
    }
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    // Only check when the mobile menu is open
    if (!mobileMenuOpen) return;
    
    const navMenu = document.getElementById('navMenu');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    if (!navMenu || !mobileMenuBtn) return;
    
    // Check if the click is outside both the navigation menu and the menu button
    if (!navMenu.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
        toggleMobileMenu();
    }
});

/**
 * Theme Toggle Functions
 */

// Toggle between light and dark themes
function toggleTheme() {
    isDarkMode = !isDarkMode;
    
    if (isDarkMode) {
        // Dark theme colors
        document.documentElement.style.setProperty('--bg-primary', '#050810');
        document.documentElement.style.setProperty('--bg-secondary', '#0f1419');
        document.documentElement.style.setProperty('--bg-tertiary', '#1a1f2e');
        document.documentElement.style.setProperty('--text-primary', '#ffffff');
        document.documentElement.style.setProperty('--text-secondary', '#9ca3af');
        document.documentElement.style.setProperty('--text-muted', '#6b7280');
        document.documentElement.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.08)');
        document.documentElement.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.04)');
    } else {
        // Light theme colors
        document.documentElement.style.setProperty('--bg-primary', '#ffffff');
        document.documentElement.style.setProperty('--bg-secondary', '#f8fafc');
        document.documentElement.style.setProperty('--bg-tertiary', '#e2e8f0');
        document.documentElement.style.setProperty('--text-primary', '#1a202c');
        document.documentElement.style.setProperty('--text-secondary', '#4a5568');
        document.documentElement.style.setProperty('--text-muted', '#718096');
        document.documentElement.style.setProperty('--glass-border', '#2196F3');
        document.documentElement.style.setProperty('--glass-bg', 'rgba(33, 150, 243, 0.05)');
    }
    
    updateThemeIcon();
    
    // Store theme preference in localStorage
    try {
        localStorage.setItem('devpy-theme', isDarkMode ? 'dark' : 'light');
    } catch (e) {
        // localStorage not available, continue without storing
    }
}

// Update theme toggle icon
function updateThemeIcon() {
    const themeIcon = document.getElementById('themeIcon');
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (!themeIcon || !themeToggle) return;
    
    if (isDarkMode) {
        themeIcon.className = 'fas fa-sun';
        // In dark mode, use light color for the icon and add blue border
        themeToggle.style.color = '#ffffff';
        themeToggle.style.border = '2px solid #2196F3';
    } else {
        themeIcon.className = 'fas fa-moon';
        // In light mode, use the primary color (blue) for better visibility
        themeToggle.style.color = '#2196F3';
        themeToggle.style.border = '1px solid var(--glass-border)';
    }
}

/**
 * Scroll Event Handlers
 */

// Initialize scroll-related event listeners
function initScrollEvents() {
    window.addEventListener('scroll', handleScroll);
}

// Handle scroll events for navbar and scroll-to-top button
function handleScroll() {
    const navbar = document.getElementById('navbar');
    const scrollTop = document.getElementById('scrollTop');
    const scrollPosition = window.pageYOffset;

    // Add scrolled class to navbar for styling
    if (navbar) {
        if (scrollPosition > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Show/hide scroll to top button
    if (scrollTop) {
        if (scrollPosition > 300) {
            scrollTop.classList.add('visible');
        } else {
            scrollTop.classList.remove('visible');
        }
    }
}

// Smooth scroll to top of page
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

/**
 * Animation Functions
 */

// Animate counter numbers in statistics section
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    if (counters.length === 0) return;
    
    const observerOptions = {
        threshold: 0.7
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                const increment = target / 50; // Animation speed
                let current = 0;

                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        counter.textContent = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };

                updateCounter();
                observer.unobserve(counter); // Animate only once
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

/**
 * Form Handling
 */

// Initialize contact form submission
function initFormSubmission() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmission);
        
        // Prevent submission with Enter key if form is invalid
        contactForm.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                
                // If it's the submit button or last field, try to submit
                if (e.target.type === 'submit' || e.target === document.getElementById('message')) {
                    contactForm.dispatchEvent(new Event('submit'));
                } else {
                    // Move to next field
                    const formElements = Array.from(contactForm.elements);
                    const currentIndex = formElements.indexOf(e.target);
                    const nextElement = formElements[currentIndex + 1];
                    if (nextElement && nextElement.focus) {
                        nextElement.focus();
                    }
                }
            }
        });
    }
}

// Handle contact form submission
async function handleFormSubmission(e) {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
        showNotification('Please fill in all required fields correctly.', 'error');
        return;
    }
    
    // Get form data
    const formData = new FormData(e.target);
    const formObject = {};
    
    formData.forEach((value, key) => {
        formObject[key] = value.trim(); // Trim whitespace
    });

    // Check if all required fields have actual content (not just whitespace)
    if (!formObject.name || !formObject.email || !formObject.message) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }

    // Show loading state
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;

    try {
        // Check if Firebase is available
        if (typeof firebase !== 'undefined' && firebase.firestore) {
            const db = firebase.firestore();
            await db.collection("contacts").add({
                ...formObject,
                createdAt: new Date()
            });

            // Success state
            submitButton.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            submitButton.style.background = '#10b981';

            showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');

            e.target.reset();
            clearFormErrors(); // Clear any validation errors
        } else {
            // Fallback for when Firebase is not available
            showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
            submitButton.innerHTML = '<i class="fas fa-check"></i> Message Received!';
            submitButton.style.background = '#10b981';
            e.target.reset();
            clearFormErrors(); // Clear any validation errors
        }

    } catch (error) {
        console.error('Form submission error:', error);

        submitButton.innerHTML = '<i class="fas fa-times"></i> Failed to Send';
        submitButton.style.background = '#ef4444';

        showNotification('Failed to send message. Please try again.', 'error');
    }

    // Reset button after delay
    setTimeout(() => {
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        submitButton.style.background = '';
    }, 3000);
}

// Form validation functions
function validateForm() {
    let isValid = true;
    
    // Clear previous errors
    clearFormErrors();
    
    // Validate name
    const name = document.getElementById('name');
    const nameValue = name.value.trim();
    if (!nameValue) {
        showFieldError('nameError', 'Name is required');
        name.classList.add('error');
        isValid = false;
    } else if (nameValue.length < 2) {
        showFieldError('nameError', 'Name must be at least 2 characters');
        name.classList.add('error');
        isValid = false;
    } else {
        name.classList.remove('error');
        name.classList.add('success');
    }
    
    // Validate email
    const email = document.getElementById('email');
    const emailValue = email.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValue) {
        showFieldError('emailError', 'Email is required');
        email.classList.add('error');
        isValid = false;
    } else if (!emailRegex.test(emailValue)) {
        showFieldError('emailError', 'Please enter a valid email address');
        email.classList.add('error');
        isValid = false;
    } else {
        email.classList.remove('error');
        email.classList.add('success');
    }
    
    // Validate message
    const message = document.getElementById('message');
    const messageValue = message.value.trim();
    if (!messageValue) {
        showFieldError('messageError', 'Message is required');
        message.classList.add('error');
        isValid = false;
    } else if (messageValue.length < 10) {
        showFieldError('messageError', 'Message must be at least 10 characters');
        message.classList.add('error');
        isValid = false;
    } else {
        message.classList.remove('error');
        message.classList.add('success');
    }
    
    return isValid;
}

function showFieldError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearFormErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => {
        error.textContent = '';
        error.style.display = 'none';
    });
    
    const formControls = document.querySelectorAll('.form-control');
    formControls.forEach(control => {
        control.classList.remove('error', 'success');
    });
}

// Add real-time validation
function initFormValidation() {
    const formFields = ['name', 'email', 'message'];
    
    formFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('blur', function() {
                validateSingleField(fieldId);
            });
            
            field.addEventListener('input', function() {
                // Clear error state when user starts typing
                if (field.classList.contains('error')) {
                    field.classList.remove('error');
                    const errorElement = document.getElementById(fieldId + 'Error');
                    if (errorElement) {
                        errorElement.style.display = 'none';
                    }
                }
            });
        }
    });
}

function validateSingleField(fieldId) {
    const field = document.getElementById(fieldId);
    const value = field.value.trim();
    let isValid = true;
    
    switch(fieldId) {
        case 'name':
            if (!value) {
                showFieldError('nameError', 'Name is required');
                field.classList.add('error');
                isValid = false;
            } else if (value.length < 2) {
                showFieldError('nameError', 'Name must be at least 2 characters');
                field.classList.add('error');
                isValid = false;
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) {
                showFieldError('emailError', 'Email is required');
                field.classList.add('error');
                isValid = false;
            } else if (!emailRegex.test(value)) {
                showFieldError('emailError', 'Please enter a valid email address');
                field.classList.add('error');
                isValid = false;
            }
            break;
            
        case 'message':
            if (!value) {
                showFieldError('messageError', 'Message is required');
                field.classList.add('error');
                isValid = false;
            } else if (value.length < 10) {
                showFieldError('messageError', 'Message must be at least 10 characters');
                field.classList.add('error');
                isValid = false;
            }
            break;
    }
    
    if (isValid) {
        field.classList.remove('error');
        field.classList.add('success');
    }
    
    return isValid;
}

/**
 * Utility Functions
 */

// Show notification messages
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
        ">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        </div>
    `;

    document.body.appendChild(notification);

    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Debounce function for performance optimization
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

// Optimized scroll handler
const optimizedScrollHandler = debounce(handleScroll, 10);

/**
 * Accessibility Enhancements
 */

// Handle keyboard navigation
document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape' && mobileMenuOpen) {
        toggleMobileMenu();
    }
    
    // Tab navigation enhancement
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

// Remove keyboard navigation class on mouse use
document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

/**
 * Performance Optimizations
 */

// Preload critical images
function preloadImages() {
    const criticalImages = [
        '/logo.png'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Lazy load non-critical content
function lazyLoadContent() {
    const lazyElements = document.querySelectorAll('[data-lazy]');
    
    if (lazyElements.length === 0) return;
    
    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const src = element.getAttribute('data-lazy');
                
                if (element.tagName === 'IMG') {
                    element.src = src;
                } else {
                    element.style.backgroundImage = `url(${src})`;
                }
                
                element.removeAttribute('data-lazy');
                lazyObserver.unobserve(element);
            }
        });
    });

    lazyElements.forEach(element => lazyObserver.observe(element));
}

/**
 * Error Handling
 */

// Global error handler
window.addEventListener('error', function(e) {
    console.error('DevPy Website Error:', e.error);
    // In production, you might want to send this to an error tracking service
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled Promise Rejection:', e.reason);
    e.preventDefault();
});

/**
 * Additional Interactive Features
 */

// Add smooth hover effects to service cards
document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Add typing animation effect to hero text
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation when hero section is visible
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const heroTitle = entry.target.querySelector('h1');
            if (heroTitle && !heroTitle.getAttribute('data-typed')) {
                heroTitle.setAttribute('data-typed', 'true');
                const originalText = heroTitle.textContent;
                typeWriter(heroTitle, originalText, 80);
            }
        }
    });
});

// Observe hero section
document.addEventListener('DOMContentLoaded', function() {
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroObserver.observe(heroSection);
    }
});

/**
 * SEO and Analytics Helpers
 */

// Update page title and meta description based on current page
function updatePageMeta(page) {
    const metaData = {
        home: {
            title: 'DevPy - Premium Tech Solutions & Development Services',
            description: 'Transform your ideas into powerful digital experiences with DevPy\'s cutting-edge development, innovative design, and scalable cloud solutions.'
        },
        about: {
            title: 'About DevPy - Our Mission, Vision & Technology Stack',
            description: 'Learn about DevPy\'s mission to deliver cutting-edge technology solutions and our experienced team of developers and designers.'
        },
        services: {
            title: 'DevPy Services - Web Development, Mobile Apps & Cloud Solutions',
            description: 'Comprehensive technology services including web development, mobile apps, cloud infrastructure, API development, and DevOps solutions.'
        },
        contact: {
            title: 'Contact DevPy - Get In Touch for Your Next Project',
            description: 'Ready to start your next project? Contact DevPy today to discuss how we can help bring your vision to life with our technology solutions.'
        }
    };

    const data = metaData[page];
    if (data) {
        document.title = data.title;
        
        // Update meta description
        let metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', data.description);
        }
    }
}

/**
 * Initialize everything when page loads
 */

// Main initialization function
function init() {
    preloadImages();
    lazyLoadContent();
    
    // Try to restore theme preference
    try {
        const savedTheme = localStorage.getItem('devpy-theme');
        if (savedTheme === 'light') {
            toggleTheme();
        }
    } catch (e) {
        // localStorage not available, use default
    }
    
    // Ensure theme icon colors are set correctly after initialization
    updateThemeIcon();
}

/**
 * Mobile-specific Event Handlers
 */

// Initialize mobile-specific events
function initMobileEvents() {
    // Add swipe functionality for mobile navigation
    const body = document.querySelector('body');
    
    // Variables to track touch events
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    
    // Track touch start position
    body.addEventListener('touchstart', function(event) {
        touchStartX = event.changedTouches[0].screenX;
        touchStartY = event.changedTouches[0].screenY;
    }, false);
    
    // Track touch end position and handle swipe
    body.addEventListener('touchend', function(event) {
        touchEndX = event.changedTouches[0].screenX;
        touchEndY = event.changedTouches[0].screenY;
        handleSwipe();
    }, false);
    
    // Process swipe gesture
    function handleSwipe() {
        // Calculate horizontal and vertical distance
        const horizontalDist = touchEndX - touchStartX;
        const verticalDist = Math.abs(touchEndY - touchStartY);
        
        // Only detect horizontal swipes when vertical movement is minimal
        if (Math.abs(horizontalDist) > 100 && verticalDist < 50) {
            // Right swipe (open menu)
            if (horizontalDist > 0 && !mobileMenuOpen) {
                toggleMobileMenu();
            }
            // Left swipe (close menu)
            else if (horizontalDist < 0 && mobileMenuOpen) {
                toggleMobileMenu();
            }
        }
    }
}

// Run initialization
document.addEventListener('DOMContentLoaded', init);

// Service Worker Registration for PWA (Progressive Web App)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed');
            });
    });
}

console.log('🚀 DevPy Website Loaded Successfully!');
console.log('💫 Built with modern web technologies');
console.log('🎨 Designed for optimal user experience');
console.log('⚡ Optimized for performance and accessibility');
