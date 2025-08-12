// Blog JavaScript - DevPy Blog Functionality with Fixed Mobile Navigation

// Sample blog posts data
const blogPosts = [
    {
        id: 1,
        title: "Getting Started with Modern Web Development",
        excerpt: "Learn the fundamentals of modern web development with the latest tools and frameworks.",
        category: "web-development",
        author: "DevPy Team",
        date: "2025-01-15",
        readTime: "5 min read",
        featured: true,
        image: "📚"
    },
    {
        id: 2,
        title: "Python Best Practices for 2025",
        excerpt: "Discover the latest Python best practices and coding standards to improve your development workflow.",
        category: "python",
        author: "DevPy Team",
        date: "2025-01-10",
        readTime: "8 min read",
        featured: true,
        image: "🐍"
    },
    {
        id: 3,
        title: "Introduction to Machine Learning with Python",
        excerpt: "A comprehensive guide to getting started with machine learning using Python and popular libraries.",
        category: "ai-ml",
        author: "DevPy Team",
        date: "2025-01-05",
        readTime: "12 min read",
        featured: true,
        image: "🤖"
    },
    {
        id: 4,
        title: "Cloud Computing Fundamentals",
        excerpt: "Understanding cloud computing concepts and how to leverage cloud services for your applications.",
        category: "cloud",
        author: "DevPy Team",
        date: "2025-01-01",
        readTime: "10 min read",
        featured: false,
        image: "☁️"
    },
    {
        id: 5,
        title: "Building Responsive Web Applications",
        excerpt: "Learn how to create responsive web applications that work seamlessly across all devices.",
        category: "web-development",
        author: "DevPy Team",
        date: "2024-12-28",
        readTime: "7 min read",
        featured: false,
        image: "📱"
    },
    {
        id: 6,
        title: "The Future of Artificial Intelligence",
        excerpt: "Exploring the latest trends and future possibilities in artificial intelligence and machine learning.",
        category: "ai-ml",
        author: "DevPy Team",
        date: "2024-12-25",
        readTime: "15 min read",
        featured: false,
        image: "🔮"
    }
];

// Initialize the blog
document.addEventListener('DOMContentLoaded', function() {
    loadFeaturedPosts();
    loadRecentPosts();
    updateCategoryCounts();
    initializeSearch();
    initializeNavigation();
    initializeNewsletter();
    initializeTheme();
    initializeHeroStyling();
    initializeMobileMenu();
    initializeSmoothScrolling();
    
    // Enhanced mobile initialization
    initializeMobileOptimizations();
});

// Load featured posts
function loadFeaturedPosts() {
    const featuredContainer = document.getElementById('featuredPosts');
    if (!featuredContainer) return;
    
    const featuredPosts = blogPosts.filter(post => post.featured);
    
    if (featuredPosts.length === 0) {
        featuredContainer.innerHTML = '<div class="loading"></div>';
        return;
    }
    
    featuredContainer.innerHTML = featuredPosts.map(post => createPostCard(post)).join('');
}

// Load recent posts
function loadRecentPosts() {
    const recentContainer = document.getElementById('recentPosts');
    if (!recentContainer) return;
    
    const recentPosts = blogPosts.filter(post => !post.featured).slice(0, 6);
    
    if (recentPosts.length === 0) {
        recentContainer.innerHTML = '<div class="loading"></div>';
        return;
    }
    
    recentContainer.innerHTML = recentPosts.map(post => createPostCard(post)).join('');
}

// Create post card HTML
function createPostCard(post) {
    const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    return `
        <article class="post-card fade-in-up" data-category="${post.category}">
            <div class="post-image">
                ${post.image}
            </div>
            <div class="post-content">
                <div class="post-meta">
                    <span class="post-category">${getCategoryName(post.category)}</span>
                    <span class="post-date">
                        <i class="fas fa-calendar"></i>
                        ${formattedDate}
                    </span>
                </div>
                <h3 class="post-title">${post.title}</h3>
                <p class="post-excerpt">${post.excerpt}</p>
                <div class="post-footer">
                    <a href="posts/post-${post.id}.html" class="read-more">
                        Read More <i class="fas fa-arrow-right"></i>
                    </a>
                    <div class="post-stats">
                        <span><i class="fas fa-clock"></i> ${post.readTime}</span>
                        <span><i class="fas fa-user"></i> ${post.author}</span>
                    </div>
                </div>
            </div>
        </article>
    `;
}

// Get category display name
function getCategoryName(category) {
    const categoryNames = {
        'web-development': 'Web Development',
        'ai-ml': 'AI & ML',
        'python': 'Python',
        'cloud': 'Cloud Computing',
        'tutorials': 'Tutorials',
        'tech-news': 'Tech News'
    };
    return categoryNames[category] || category;
}

// Update category post counts
function updateCategoryCounts() {
    const categories = document.querySelectorAll('.category-card');
    
    categories.forEach(categoryCard => {
        const categoryType = categoryCard.dataset.category;
        if (!categoryType) return;
        
        const count = blogPosts.filter(post => post.category === categoryType).length;
        const countElement = categoryCard.querySelector('.post-count');
        if (countElement) {
            countElement.textContent = `${count} post${count !== 1 ? 's' : ''}`;
        }
    });
}

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (!searchInput || !searchBtn) return;
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch();
        }
    });
    
    // Real-time search with improved debouncing
    searchInput.addEventListener('input', debounce(performSearch, 300));
    
    // Enhanced focus effects
    searchInput.addEventListener('focus', function() {
        this.style.transform = 'scale(1.02)';
        this.parentElement.style.borderColor = 'var(--primary)';
    });
    
    searchInput.addEventListener('blur', function() {
        this.style.transform = 'scale(1)';
        this.parentElement.style.borderColor = 'var(--glass-border)';
    });
}

// Enhanced search functionality
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    const query = searchInput.value.toLowerCase().trim();
    const featuredContainer = document.getElementById('featuredPosts');
    const recentContainer = document.getElementById('recentPosts');
    
    if (!featuredContainer || !recentContainer) return;
    
    if (query === '') {
        // Reset to original state
        loadFeaturedPosts();
        loadRecentPosts();
        return;
    }
    
    const filteredPosts = blogPosts.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query)
    );
    
    // Update featured posts
    const featuredFiltered = filteredPosts.filter(post => post.featured);
    if (featuredFiltered.length === 0) {
        featuredContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem; grid-column: 1 / -1;">
                <i class="fas fa-search" style="font-size: 2rem; color: var(--text-secondary); margin-bottom: 1rem;"></i>
                <p>No featured posts found for "${query}"</p>
            </div>
        `;
    } else {
        featuredContainer.innerHTML = featuredFiltered.map(post => createPostCard(post)).join('');
    }
    
    // Update recent posts
    const recentFiltered = filteredPosts.filter(post => !post.featured);
    if (recentFiltered.length === 0) {
        recentContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem; grid-column: 1 / -1;">
                <i class="fas fa-search" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 1rem;"></i>
                <h3>No posts found</h3>
                <p>Try searching with different keywords like "web", "python", "AI", etc.</p>
                <button onclick="clearSearch()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--primary); color: white; border: none; border-radius: 4px; cursor: pointer;">Clear Search</button>
            </div>
        `;
    } else {
        recentContainer.innerHTML = recentFiltered.map(post => createPostCard(post)).join('');
    }
    
    // Animate search results
    setTimeout(() => {
        document.querySelectorAll('.post-card').forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'all 0.3s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 50);
}

// Clear search function
function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
        performSearch();
    }
}

// Debounce function for search
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

// ENHANCED MOBILE MENU INITIALIZATION - FIXED FOR FULL WIDTH
function initializeMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;
    const featuredSection = document.querySelector('.featured-posts');
    
    if (!mobileMenuToggle || !navLinks) return;
    
    // Ensure mobile menu is properly hidden initially
    if (window.innerWidth <= 768) {
        navLinks.style.display = 'none';
        navLinks.classList.remove('active');
    }
    
    // Toggle mobile menu
    mobileMenuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const isActive = navLinks.classList.contains('active');
        
        if (isActive) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });
    
    // Close menu when clicking on navigation links
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                // Small delay to allow navigation to begin
                setTimeout(() => {
                    closeMobileMenu();
                }, 100);
            }
        });
    });
    
    // Close menu when clicking outside (improved)
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && 
            navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            !mobileMenuToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Handle window resize - improved
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (window.innerWidth > 768) {
                // Desktop view - reset mobile menu
                closeMobileMenu();
                navLinks.style.display = 'flex';
                navLinks.style.transform = 'none';
                navLinks.style.opacity = '1';
                body.classList.remove('menu-open');
            } else {
                // Mobile view - ensure proper mobile setup
                if (!navLinks.classList.contains('active')) {
                    navLinks.style.display = 'none';
                }
            }
        }, 250);
    });
    
    function openMobileMenu() {
        // Prevent body scroll
        body.classList.add('menu-open');
        
        // Show and animate menu
        navLinks.style.display = 'flex';
        navLinks.classList.add('active');
        mobileMenuToggle.classList.add('open');
        
        // Force reflow then animate
        navLinks.offsetHeight;
        
        // Adjust featured section if it exists
        if (featuredSection) {
            featuredSection.classList.add('nav-open');
        }
        
        // Update icon with smooth transition
        const icon = mobileMenuToggle.querySelector('i');
        if (icon) {
            icon.style.transition = 'transform 0.3s ease';
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        }
        
        // Add ARIA attributes for accessibility
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
        navLinks.setAttribute('aria-hidden', 'false');
        
        // Focus trap for accessibility
        const firstFocusableElement = navLinks.querySelector('a');
        if (firstFocusableElement) {
            firstFocusableElement.focus();
        }
    }
    
    function closeMobileMenu() {
        // Remove classes
        navLinks.classList.remove('active');
        mobileMenuToggle.classList.remove('open');
        body.classList.remove('menu-open');
        
        // Reset featured section if it exists
        if (featuredSection) {
            featuredSection.classList.remove('nav-open');
        }
        
        // Update icon
        const icon = mobileMenuToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
        
        // Hide menu after animation
        setTimeout(() => {
            if (!navLinks.classList.contains('active')) {
                navLinks.style.display = 'none';
            }
        }, 300);
        
        // Add ARIA attributes for accessibility
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        navLinks.setAttribute('aria-hidden', 'true');
        
        // Return focus to toggle button
        mobileMenuToggle.focus();
    }
}

// Initialize mobile-specific optimizations
function initializeMobileOptimizations() {
    // Prevent zoom on input focus for iOS
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="search"]');
    inputs.forEach(input => {
        input.style.fontSize = '16px'; // Prevents zoom on iOS
    });
    
    // Optimize touch events
    initializeTouchOptimizations();
    
    // Optimize scroll performance
    initializeScrollOptimizations();
    
    // Add mobile-specific event listeners
    initializeMobileEventListeners();
}

// Touch optimizations for mobile
function initializeTouchOptimizations() {
    const interactiveElements = document.querySelectorAll(
        '.post-card, .category-card, .btn, .mobile-menu-toggle, .theme-toggle'
    );
    
    interactiveElements.forEach(element => {
        // Add touch feedback
        element.addEventListener('touchstart', function(e) {
            if (!this.classList.contains('touching')) {
                this.classList.add('touching');
                this.style.transform = 'scale(0.98)';
                this.style.transition = 'transform 0.1s ease';
            }
        }, { passive: true });
        
        element.addEventListener('touchend', function(e) {
            this.classList.remove('touching');
            this.style.transform = 'scale(1)';
            this.style.transition = 'transform 0.3s ease';
        }, { passive: true });
        
        element.addEventListener('touchcancel', function(e) {
            this.classList.remove('touching');
            this.style.transform = 'scale(1)';
            this.style.transition = 'transform 0.3s ease';
        }, { passive: true });
    });
}

// Scroll optimizations
function initializeScrollOptimizations() {
    let isScrolling = false;
    let scrollTimeout;
    
    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            window.requestAnimationFrame(function() {
                updateScrollProgress();
                isScrolling = false;
            });
            isScrolling = true;
        }
        
        // Clear timeout and set a new one
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            // Scroll ended
        }, 150);
    }, { passive: true });
}

// Mobile-specific event listeners
function initializeMobileEventListeners() {
    // Handle orientation change
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            // Recalculate heights and positions
            const navLinks = document.querySelector('.nav-links');
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.style.maxHeight = `calc(100vh - ${document.querySelector('.blog-header').offsetHeight}px)`;
            }
        }, 500);
    });
    
    // Handle viewport changes (for mobile browsers with dynamic UI)
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    window.addEventListener('resize', () => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
}

// Initialize smooth scrolling for mobile navigation
function initializeSmoothScrolling() {
    // Handle smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerHeight = window.innerWidth <= 768 ? 60 : 70;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (window.innerWidth <= 768) {
                    const navLinks = document.querySelector('.nav-links');
                    if (navLinks && navLinks.classList.contains('active')) {
                        setTimeout(() => {
                            const mobileMenuToggle = document.getElementById('mobileMenuToggle');
                            if (mobileMenuToggle) {
                                const event = new Event('click');
                                mobileMenuToggle.dispatchEvent(event);
                            }
                        }, 100);
                    }
                }
            }
        });
    });
}

// Initialize theme functionality
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    if (!themeToggle) return;
    
    // Load saved theme preference
    const savedTheme = localStorage.getItem('devpy_blog_theme') || 'dark';
    setTheme(savedTheme);
    
    // Theme toggle event
    themeToggle.addEventListener('click', function(e) {
        e.preventDefault();
        const currentTheme = html.classList.contains('bright-mode') ? 'bright' : 'dark';
        const newTheme = currentTheme === 'dark' ? 'bright' : 'dark';
        
        setTheme(newTheme);
        localStorage.setItem('devpy_blog_theme', newTheme);
        
        // Add click animation
        this.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
    
    function setTheme(theme) {
        const icon = themeToggle.querySelector('i');
        
        if (theme === 'bright') {
            html.classList.add('bright-mode');
            if (icon) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
            themeToggle.title = 'Switch to dark mode';
        } else {
            html.classList.remove('bright-mode');
            if (icon) {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
            themeToggle.title = 'Switch to bright mode';
        }
    }
}

// Initialize hero section styling to match DevPy main website
function initializeHeroStyling() {
    const hero = document.getElementById('blogHero');
    
    if (!hero) return;
    
    // Apply DevPy main website colors
    hero.style.background = 'linear-gradient(135deg, #2196F3 0%, #1976D2 50%, #1565C0 100%)';
    hero.style.position = 'relative';
    hero.style.overflow = 'hidden';
    
    // Add animated background elements similar to main site
    const animatedBg = document.createElement('div');
    animatedBg.className = 'hero-animated-bg';
    animatedBg.innerHTML = `
        <div class="floating-element" style="top: 10%; left: 10%; animation-delay: 0s;"></div>
        <div class="floating-element" style="top: 20%; right: 15%; animation-delay: 2s;"></div>
        <div class="floating-element" style="bottom: 30%; left: 20%; animation-delay: 4s;"></div>
        <div class="floating-element" style="bottom: 20%; right: 10%; animation-delay: 6s;"></div>
    `;
    
    hero.appendChild(animatedBg);
    
    // Add dynamic styles
    if (!document.getElementById('heroStyles')) {
        const style = document.createElement('style');
        style.id = 'heroStyles';
        style.textContent = `
            .hero-animated-bg {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 1;
            }
            
            .floating-element {
                position: absolute;
                width: 60px;
                height: 60px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 50%;
                animation: float 8s ease-in-out infinite;
            }
            
            @keyframes float {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-20px) rotate(180deg); }
            }
            
            .blog-hero .hero-content {
                position: relative;
                z-index: 2;
            }
            
            .search-bar {
                position: relative;
                z-index: 3;
            }
            
            @media (max-width: 768px) {
                .floating-element {
                    width: 40px;
                    height: 40px;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
}

// Initialize navigation
function initializeNavigation() {
    // Category navigation
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.dataset.category;
            if (category) {
                filterPostsByCategory(category);
                
                // Add visual feedback
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            }
        });
        
        // Add hover effects for desktop
        if (window.innerWidth > 768) {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0 10px 30px rgba(33, 150, 243, 0.3)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '';
            });
        }
    });
    
    // Load more button
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMorePosts);
    }
    
    // Footer category links
    const footerCategoryLinks = document.querySelectorAll('a[data-category]');
    footerCategoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.dataset.category;
            if (category) {
                filterPostsByCategory(category);
            }
        });
    });
}

function filterPostsByCategory(category) {
    const filteredPosts = blogPosts.filter(post => post.category === category);
    const recentContainer = document.getElementById('recentPosts');
    
    if (!recentContainer) return;
    
    if (filteredPosts.length === 0) {
        recentContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem; grid-column: 1 / -1;">
                <i class="fas fa-folder-open" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 1rem;"></i>
                <h3>No posts in this category</h3>
                <p>Check back later for new content.</p>
            </div>
        `;
    } else {
        recentContainer.innerHTML = filteredPosts.map(post => createPostCard(post)).join('');
    }
    
    // Scroll to recent posts section
    const recentSection = document.querySelector('.recent-posts');
    if (recentSection) {
        const headerHeight = window.innerWidth <= 768 ? 60 : 70;
        const targetPosition = recentSection.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Load more posts (placeholder functionality)
function loadMorePosts() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (!loadMoreBtn) return;
    
    loadMoreBtn.textContent = 'Loading...';
    loadMoreBtn.disabled = true;
    
    // Simulate loading delay
    setTimeout(() => {
        loadMoreBtn.textContent = 'No more posts';
        loadMoreBtn.disabled = true;
    }, 1000);
}

// Initialize newsletter
function initializeNewsletter() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = this.querySelector('input[type="email"]');
        const submitBtn = this.querySelector('button[type="submit"]');
        
        if (!emailInput || !emailInput.value) return;
        
        // Simulate newsletter subscription
        if (submitBtn) {
            submitBtn.textContent = 'Subscribing...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.textContent = 'Subscribed!';
                emailInput.value = '';
                
                setTimeout(() => {
                    submitBtn.textContent = 'Subscribe';
                    submitBtn.disabled = false;
                }, 2000);
            }, 1000);
        }
    });
}

// Add scroll-based animations with improved performance
function observeElements() {
    if (!window.IntersectionObserver) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe post cards and category cards
    document.querySelectorAll('.post-card, .category-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease-out';
        observer.observe(card);
    });
}

// Update scroll progress indicator
function updateScrollProgress() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    
    // Update any scroll progress indicators if they exist
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
        progressBar.style.width = scrollPercent + '%';
    }
}

// Enhanced keyboard navigation
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // Global keyboard shortcuts
        switch(e.key) {
            case '/':
                if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    const searchInput = document.getElementById('searchInput');
                    if (searchInput) {
                        searchInput.focus();
                    }
                }
                break;
                
            case 'Escape':
                // Close mobile menu, clear search, etc.
                const activeMenu = document.querySelector('.nav-links.active');
                if (activeMenu && window.innerWidth <= 768) {
                    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
                    if (mobileMenuToggle) {
                        mobileMenuToggle.click();
                    }
                }
                break;
                
            case 't':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    const themeToggle = document.getElementById('themeToggle');
                    if (themeToggle) {
                        themeToggle.click();
                    }
                }
                break;
        }
    });
}

// Initialize all enhancements
document.addEventListener('DOMContentLoaded', function() {
    // Add delay to ensure DOM is fully loaded
    setTimeout(() => {
        observeElements();
        initializeKeyboardNavigation();
    }, 100);
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden, pause animations
        document.querySelectorAll('.floating-element, .category-card').forEach(element => {
            element.style.animationPlayState = 'paused';
        });
    } else {
        // Page is visible, resume animations
        document.querySelectorAll('.floating-element, .category-card').forEach(element => {
            element.style.animationPlayState = 'running';
        });
    }
});