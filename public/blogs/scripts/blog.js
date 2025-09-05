// DevPy Blog JavaScript - Interactive Features and Functionality

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    console.log('DevPy Blog: DOM loaded, initializing app...');
    initializeApp();
});

// Initialize Application
function initializeApp() {
    console.log('DevPy Blog: Initializing application...');
    hideLoadingScreen();
    initializeNavigation();
    initializeScrollEffects();
    initializeBlogPosts();
    initializeLazyLoading();
    initializeAnimations();
    initializeTheme();
    initializeHeroSlider();
    initializeSearch();
    initializeAdminUpdates();
    console.log('DevPy Blog: Application initialized successfully');
}

// Loading Screen
function hideLoadingScreen() {
    setTimeout(() => {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.classList.add('hidden');
            setTimeout(() => {
                loading.style.display = 'none';
            }, 300);
        }
    }, 500);
}

// Navigation Functions
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.getElementById('navMenu');
    
    // Scroll effect for navbar - Light theme like main website
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.backdropFilter = 'blur(20px)';
            navbar.style.borderBottom = '1.5px solid rgba(148, 163, 184, 0.2)';
            navbar.style.boxShadow = '0 2px 20px rgba(100, 116, 139, 0.12)';
        } else {
            navbar.style.background = 'rgba(0, 0, 0, 0.04)';
            navbar.style.backdropFilter = 'blur(20px)';
            navbar.style.borderBottom = '1px solid rgba(0, 0, 0, 0.08)';
            navbar.style.boxShadow = 'none';
        }
    });
    
    // Mobile menu toggle
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        console.log('Mobile menu button listener attached'); // Debug log
    } else {
        console.log('Mobile menu button or nav menu not found'); // Debug log
    }
    
    // Close mobile menu when clicking on links
    closeMobileMenuOnLinkClick();
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && navMenu && navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenuIcon = document.getElementById('mobileMenuIcon');
    
    if (navMenu && mobileMenuBtn) {
        navMenu.classList.toggle('active');
        const isActive = navMenu.classList.contains('active');
        
        // Update button aria-expanded
        mobileMenuBtn.setAttribute('aria-expanded', isActive);
        
        // Update icon with smooth rotation
        if (mobileMenuIcon) {
            mobileMenuIcon.style.transform = isActive ? 'rotate(90deg)' : 'rotate(0deg)';
            mobileMenuIcon.className = isActive ? 'fas fa-times' : 'fas fa-bars';
        }
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isActive ? 'hidden' : '';
        
        // Add backdrop blur effect
        if (isActive) {
            document.body.style.backdropFilter = 'blur(5px)';
            document.body.classList.add('mobile-menu-open');
        } else {
            document.body.style.backdropFilter = '';
            document.body.classList.remove('mobile-menu-open');
        }
        
        console.log('Mobile menu toggled:', isActive); // Debug log
    } else {
        console.log('Mobile menu elements not found'); // Debug log
    }
}

// Close mobile menu when clicking on menu links
function closeMobileMenuOnLinkClick() {
    const navLinks = document.querySelectorAll('.nav-menu .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const navMenu = document.getElementById('navMenu');
            if (navMenu && navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });
}

// Scroll Effects
function initializeScrollEffects() {
    initializeBackToTop();
    initializeScrollReveal();
}

function initializeBackToTop() {
    const backToTopBtn = document.getElementById('scrollTop');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Scroll Reveal Animation
function initializeScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Add animation styles to elements
    const animatedElements = document.querySelectorAll(
        '.post-card, .category-card, .feature-card, .section-header'
    );
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

// Newsletter Form
function initializeNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
}

async function handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const emailInput = form.querySelector('#newsletter-email');
    const consentCheckbox = form.querySelector('#newsletter-consent');
    const submitBtn = form.querySelector('.newsletter-btn');
    
    // Validation
    if (!emailInput.value || !isValidEmail(emailInput.value)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    if (!consentCheckbox.checked) {
        showNotification('Please agree to receive newsletters', 'error');
        return;
    }
    
    // Show loading state
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
    submitBtn.disabled = true;
    
    try {
        // Simulate API call (replace with actual newsletter service)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Success
        showNotification('Successfully subscribed to our newsletter!', 'success');
        form.reset();
        
        // Track subscription (if analytics available)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'newsletter_subscribe', {
                email: emailInput.value
            });
        }
        
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        showNotification('Something went wrong. Please try again.', 'error');
    } finally {
        // Reset button
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 400px;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

function getNotificationColor(type) {
    switch (type) {
        case 'success': return 'linear-gradient(135deg, #4caf50, #45a049)';
        case 'error': return 'linear-gradient(135deg, #f44336, #da190b)';
        case 'warning': return 'linear-gradient(135deg, #ff9800, #f57c00)';
        default: return 'linear-gradient(135deg, #2196f3, #1976d2)';
    }
}

// Lazy Loading for Images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    image.src = image.src || image.dataset.src;
                    image.classList.remove('lazy');
                    imageObserver.unobserve(image);
                }
            });
        });
        
        images.forEach(image => imageObserver.observe(image));
    } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(image => {
            image.src = image.src || image.dataset.src;
        });
    }
}

// Animation Utilities
function initializeAnimations() {
    // Stagger animation for cards
    const cardGroups = [
        document.querySelectorAll('.feature-card'),
        document.querySelectorAll('.category-card'),
        document.querySelectorAll('.post-card')
    ];
    
    cardGroups.forEach(cards => {
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
    });
    
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }
}

// Theme Initialization - Light Theme Only
function initializeTheme() {
    console.log('DevPy Blog: Initializing light theme...');
    
    // Always apply light theme
    applyTheme('light');
    console.log('Light theme applied');
}

function applyTheme(theme) {
    // Force light theme only
    document.documentElement.setAttribute('data-theme', 'light');
    
    // Store light theme preference
    localStorage.setItem('devpy-blog-theme', 'light');
    
    // Dispatch custom event for theme change
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: 'light' } }));
}

function handleSystemThemeChange(e) {
    // System theme changes are ignored - always use light theme
    console.log('System theme change detected but ignored - using light theme only');
}

// Search Functionality (if needed)
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performSearch(e.target.value);
            }, 300);
        });
    }
}

function performSearch(query) {
    if (query.length < 2) return;
    
    // Implement search logic here
    // This could connect to a search API or filter existing content
    console.log('Searching for:', query);
}

// Reading Time Calculator
function calculateReadingTime(text) {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const readingTime = Math.ceil(words / wordsPerMinute);
    return readingTime;
}

// Social Sharing
function shareArticle(url, title, platform) {
    const shareUrls = {
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`
    };
    
    if (shareUrls[platform]) {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
}

// Performance Monitoring
function initializePerformanceMonitoring() {
    // Log Core Web Vitals
    if ('web-vitals' in window) {
        // This would require the web-vitals library
        // getCLS(console.log);
        // getFID(console.log);
        // getLCP(console.log);
    }
    
    // Log page load time
    window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Page load time: ${loadTime}ms`);
        
        // Send to analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_load_time', {
                value: loadTime,
                custom_parameter: 'blog_homepage'
            });
        }
    });
}

// Error Handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    
    // Send error to monitoring service if available
    if (typeof gtag !== 'undefined') {
        gtag('event', 'javascript_error', {
            error_message: e.error.message,
            error_filename: e.filename,
            error_lineno: e.lineno
        });
    }
});

// Service Worker Registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Hero Image Slider
function initializeHeroSlider() {
    const slides = document.querySelectorAll('.hero-image-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    let sliderInterval;
    
    // Function to show specific slide
    function showSlide(index) {
        // Remove active classes from all slides and indicators
        slides.forEach(slide => {
            slide.classList.remove('active', 'prev');
        });
        indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // Add prev class to current slide before changing
        if (slides[currentSlide]) {
            slides[currentSlide].classList.add('prev');
        }
        
        // Update current slide index
        currentSlide = index;
        
        // Add active class to new slide and indicator
        if (slides[currentSlide]) {
            slides[currentSlide].classList.add('active');
        }
        if (indicators[currentSlide]) {
            indicators[currentSlide].classList.add('active');
        }
    }
    
    // Function to go to next slide
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    }
    
    // Function to start auto-sliding
    function startAutoSlide() {
        sliderInterval = setInterval(nextSlide, 3000); // 3 seconds interval (1 sec gap + 2 sec display)
    }
    
    // Function to stop auto-sliding
    function stopAutoSlide() {
        if (sliderInterval) {
            clearInterval(sliderInterval);
        }
    }
    
    // Add click event listeners to indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            stopAutoSlide();
            showSlide(index);
            // Restart auto-slide after user interaction
            setTimeout(startAutoSlide, 1000);
        });
    });
    
    // Pause on hover
    const sliderContainer = document.querySelector('.hero-image-slider');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', stopAutoSlide);
        sliderContainer.addEventListener('mouseleave', startAutoSlide);
    }
    
    // Initialize first slide and start auto-sliding
    showSlide(0);
    startAutoSlide();
    
    // Handle visibility change (pause when tab is not active)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoSlide();
        } else {
            startAutoSlide();
        }
    });
}

// Initialize performance monitoring
initializePerformanceMonitoring();

// Blog Posts Management
let currentPage = 1;
let currentCategory = 'all';
let currentSearch = '';
const postsPerPage = 6;

// Initialize Admin Updates Listener
function initializeAdminUpdates() {
    // Listen for blog updates from admin panel
    window.addEventListener('blogUpdated', (event) => {
        console.log('Blog updated from admin panel:', event.detail);
        loadBlogPosts(); // Refresh the blog posts
    });
    
    // Listen for localStorage changes (cross-tab updates)
    window.addEventListener('storage', (e) => {
        if (e.key === 'devpy_blog_posts' || e.key === 'blog_last_update') {
            console.log('Blog storage updated in another tab, refreshing...');
            loadBlogPosts();
        }
    });
    
    // Check for updates when the page becomes visible (tab switching)
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            checkForBlogUpdates();
        }
    });
    
    // Check for updates periodically
    setInterval(checkForBlogUpdates, 30000); // Check every 30 seconds
}

function checkForBlogUpdates() {
    const lastUpdateTime = localStorage.getItem('blog_last_update');
    const lastCheckTime = sessionStorage.getItem('blog_last_check');
    
    if (lastUpdateTime && lastUpdateTime !== lastCheckTime) {
        console.log('Blog updates detected, refreshing posts...');
        loadBlogPosts();
        sessionStorage.setItem('blog_last_check', lastUpdateTime);
    }
}

// Initialize Blog Posts
function initializeBlogPosts() {
    console.log('Initializing blog posts...');
    loadBlogPosts();
    
    // Setup filter handlers
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
            currentCategory = e.target.value;
            currentPage = 1;
            loadBlogPosts();
        });
    }
    
    // Setup pagination handlers
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                loadBlogPosts();
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentPage++;
            loadBlogPosts();
        });
    }
}

// Initialize Search
function initializeSearch() {
    const searchInput = document.getElementById('blogSearch');
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                currentSearch = e.target.value;
                currentPage = 1;
                loadBlogPosts();
            }, 300);
        });
    }
}

// Load Blog Posts from API/Admin
async function loadBlogPosts() {
    console.log('LoadBlogPosts called - currentPage:', currentPage, 'currentCategory:', currentCategory, 'currentSearch:', currentSearch);
    
    const gridContainer = document.getElementById('blogPostsGrid');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const noPostsMessage = document.getElementById('noPostsMessage');
    const paginationContainer = document.getElementById('paginationContainer');
    
    if (!gridContainer) {
        console.error('Blog grid container not found!');
        return;
    }
    
    console.log('Grid container found, showing loading...');
    
    // Show loading
    if (loadingSpinner) loadingSpinner.style.display = 'flex';
    if (noPostsMessage) noPostsMessage.style.display = 'none';
    if (paginationContainer) paginationContainer.style.display = 'none';
    
    try {
        // Load posts from the consistent storage key
        const savedPosts = localStorage.getItem('devpy_blog_posts');
        let allPosts = [];
        
        console.log('Checking localStorage for saved posts...');
        
        if (savedPosts) {
            try {
                const adminPosts = JSON.parse(savedPosts);
                console.log('Raw admin posts from localStorage:', adminPosts);
                
                // Filter only published admin posts
                const publishedAdminPosts = adminPosts.filter(post => post.status === 'published');
                console.log('Published admin posts:', publishedAdminPosts);
                
                allPosts = publishedAdminPosts;
            } catch (error) {
                console.error('Error parsing admin posts:', error);
                allPosts = [];
            }
        }
        
        // Only use admin posts - no sample/default posts
        console.log('Using only admin posts:', allPosts.length);
        
        // Apply filters
        let filteredPosts = allPosts;
        
        if (currentCategory !== 'all') {
            filteredPosts = filteredPosts.filter(post => post.category === currentCategory);
            console.log(`Filtered by category ${currentCategory}:`, filteredPosts.length);
        }
        
        if (currentSearch) {
            filteredPosts = filteredPosts.filter(post => 
                post.title.toLowerCase().includes(currentSearch.toLowerCase()) ||
                post.excerpt.toLowerCase().includes(currentSearch.toLowerCase()) ||
                (post.tags && post.tags.some(tag => tag.toLowerCase().includes(currentSearch.toLowerCase())))
            );
            console.log(`Filtered by search "${currentSearch}":`, filteredPosts.length);
        }
        
        // Sort by date (newest first)
        filteredPosts.sort((a, b) => new Date(b.publishDate || b.date) - new Date(a.publishDate || a.date));
        
        // Paginate
        const startIndex = (currentPage - 1) * postsPerPage;
        const paginatedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);
        
        const response = {
            posts: paginatedPosts,
            totalPosts: filteredPosts.length,
            totalPages: Math.ceil(filteredPosts.length / postsPerPage),
            currentPage: currentPage
        };
        
        console.log('Final response:', response);
        
        const { posts, totalPages, currentPage: page } = response;
        
        // Hide loading
        if (loadingSpinner) loadingSpinner.style.display = 'none';
        
        if (posts.length === 0) {
            if (noPostsMessage) {
                noPostsMessage.style.display = 'block';
                const h3 = noPostsMessage.querySelector('h3');
                const p = noPostsMessage.querySelector('p');
                const icon = noPostsMessage.querySelector('i');
                
                // Check if we have any admin posts at all
                if (allPosts.length === 0) {
                    // No admin posts exist
                    if (icon) icon.className = 'fas fa-edit';
                    if (h3) h3.textContent = 'No blog posts available';
                    if (p) p.textContent = 'No blog posts have been published yet. Check back later for new content!';
                } else {
                    // Admin posts exist but filtered out
                    if (icon) icon.className = 'fas fa-search';
                    if (h3) h3.textContent = 'No posts found';
                    if (p) p.textContent = 'Try adjusting your search criteria or filters.';
                }
            }
            gridContainer.innerHTML = '';
            return;
        }
        
        // Render posts
        renderBlogPosts(posts);
        
        // Show and update pagination
        if (totalPages > 1 && paginationContainer) {
            paginationContainer.style.display = 'block';
            updatePagination(page, totalPages);
        }
        
    } catch (error) {
        console.error('Error loading blog posts:', error);
        if (loadingSpinner) loadingSpinner.style.display = 'none';
        if (noPostsMessage) {
            noPostsMessage.style.display = 'block';
            noPostsMessage.querySelector('h3').textContent = 'Error loading posts';
            noPostsMessage.querySelector('p').textContent = 'Please try again later.';
        }
    }
}

// Render Blog Posts
function renderBlogPosts(posts) {
    const gridContainer = document.getElementById('blogPostsGrid');
    if (!gridContainer) return;
    
    const postsHTML = posts.map(post => `
        <article class="blog-post-card" data-aos="fade-up" data-aos-delay="100">
            <div class="post-image">
                <img src="${getImageSrc(post.featuredImage || post.image || './images/posts/placeholder.jpg')}" 
                     alt="${post.title}" 
                     loading="lazy" 
                     onerror="this.src='./images/posts/placeholder.jpg'; this.classList.add('error-image');"
                     onload="this.classList.add('loaded-image');">
                <div class="post-category">${formatCategory(post.category)}</div>
            </div>
            <div class="post-content">
                <h3 class="post-title">
                    <a href="post.html?id=${post.id}">${post.title}</a>
                </h3>
                <p class="post-excerpt">${post.excerpt}</p>
                <div class="post-meta">
                    <div class="author-info">
                        <i class="fas fa-user"></i>
                        <span class="author-name">${(post.author && post.author.name) ? post.author.name : post.author || 'Unknown Author'}</span>
                    </div>
                    <div class="post-date">
                        <i class="fas fa-calendar"></i>
                        ${formatDate(post.publishDate || post.date)}
                    </div>
                    <div class="read-time">
                        <i class="fas fa-clock"></i>
                        ${calculateReadingTime(post.content)} min read
                    </div>
                </div>
                <div class="post-tags">
                    ${post.tags ? post.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
                </div>
            </div>
        </article>
    `).join('');
    
    gridContainer.innerHTML = postsHTML;
    
    // Handle image loading states
    const images = gridContainer.querySelectorAll('.post-image img');
    images.forEach(img => {
        // If image is already loaded (cached), show it immediately
        if (img.complete && img.naturalWidth > 0) {
            img.classList.add('loaded-image');
        }
    });
    
    // Reinitialize AOS for new elements
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}

// Format category name
function formatCategory(category) {
    const categories = {
        'web-development': 'Web Dev',
        'ai-ml': 'AI/ML',
        'cloud-devops': 'Cloud',
        'database': 'Database',
        'case-study': 'Case Study'
    };
    return categories[category] || category;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Calculate reading time
function calculateReadingTime(content) {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
}

// Get image source (handles localStorage stored images)
function getImageSrc(imagePath) {
    if (!imagePath) return './images/posts/placeholder.jpg';
    
    // Check if it's a localStorage stored image
    if (imagePath.startsWith('./images/post-images/')) {
        const fileName = imagePath.replace('./images/post-images/', '');
        const imageKey = `blog_image_${fileName}`;
        const storedImage = localStorage.getItem(imageKey);
        
        if (storedImage) {
            return storedImage; // Return the base64 data URL
        }
    }
    
    // Return the original path for regular images
    return imagePath;
}

// Update pagination
function updatePagination(page, totalPages) {
    const paginationNumbers = document.getElementById('paginationNumbers');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    
    if (!paginationNumbers) return;
    
    // Update button states
    if (prevBtn) {
        prevBtn.disabled = page <= 1;
        prevBtn.classList.toggle('disabled', page <= 1);
    }
    
    if (nextBtn) {
        nextBtn.disabled = page >= totalPages;
        nextBtn.classList.toggle('disabled', page >= totalPages);
    }
    
    // Generate page numbers
    let paginationHTML = '';
    const maxVisiblePages = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="pagination-number ${i === page ? 'active' : ''}" 
                    onclick="goToPage(${i})">
                ${i}
            </button>
        `;
    }
    
    paginationNumbers.innerHTML = paginationHTML;
}

// Go to specific page
function goToPage(page) {
    currentPage = page;
    loadBlogPosts();
    
    // Scroll to posts section
    const postsSection = document.getElementById('blog-posts');
    if (postsSection) {
        postsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Export functions for global access
window.toggleMobileMenu = toggleMobileMenu;
window.scrollToTop = scrollToTop;
window.shareArticle = shareArticle;
window.goToPage = goToPage;
