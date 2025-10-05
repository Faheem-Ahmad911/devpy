// Simple Blog System for DevPy Blog - Fixed Version
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Starting blog initialization');
    
    // Immediate initialization attempt
    initializeBlogComponents();
    
    // Wait a bit for all elements to be ready (backup)
    setTimeout(function() {
        initializeBlogComponents();
    }, 100);
    
    // Final backup attempt
    setTimeout(function() {
        initializeBlogComponents();
    }, 1000);
});

function initializeBlogComponents() {
    // Initialize blog functionality (only for blog index page)
    const blogPostsGrid = document.getElementById('blogPostsGrid');
    if (blogPostsGrid && (!blogPostsGrid.hasAttribute('data-initialized') || blogPostsGrid.innerHTML.trim() === '')) {
        console.log('Initializing blog index...');
        initializeBlogIndex();
        blogPostsGrid.setAttribute('data-initialized', 'true');
    }
    
    // Initialize hero slider (only for pages with hero slider)
    if (document.querySelector('.hero-image-slide') && !document.querySelector('.hero-image-slide').hasAttribute('data-slider-initialized')) {
        initializeHeroSlider();
        document.querySelector('.hero-image-slide').setAttribute('data-slider-initialized', 'true');
    }
    
    // Initialize mobile menu for all pages
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn && !mobileMenuBtn.hasAttribute('data-menu-initialized')) {
        initializeMobileMenu();
        mobileMenuBtn.setAttribute('data-menu-initialized', 'true');
    }
    
    // Hide loading screen
    hideLoadingScreen();
}

// Blog posts data
const blogPosts = [
    {
        id: 'blog1',
        title: 'Future of Data Science in 2025',
        excerpt: 'Explore the evolving landscape of data science, career opportunities, industry trends, and the roadmap for aspiring professionals in 2025.',
        category: 'ai-ml',
        categoryDisplay: 'AI & Machine Learning',
        author: 'DevPy Team',
        authorImage: 'images/authors/default.jpg',
        date: '2025-10-05',
        readTime: '12 min read',
        image: 'blogs_pics/blog1-data-science-2025.jpg',
        url: 'blog1.html',
        tags: ['Data Science', 'Machine Learning', 'AI', 'Career Guide', 'Tech Trends', '2025']
    }
    // Add more blog posts here as they are created
];

// Initialize blog index page
function initializeBlogIndex() {
    console.log('Initializing blog index...');
    
    const blogPostsGrid = document.getElementById('blogPostsGrid');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const noPostsMessage = document.getElementById('noPostsMessage');
    const searchInput = document.getElementById('blogSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    
    if (!blogPostsGrid) {
        console.error('Blog posts grid not found!');
        return;
    }
    
    console.log('Found blog elements:', {
        blogPostsGrid: !!blogPostsGrid,
        loadingSpinner: !!loadingSpinner,
        noPostsMessage: !!noPostsMessage,
        searchInput: !!searchInput,
        categoryFilter: !!categoryFilter
    });

    // Hide loading spinner
    if (loadingSpinner) {
        loadingSpinner.style.display = 'none';
        console.log('Loading spinner hidden');
    }

    // Log blog posts data
    console.log('Blog posts data:', blogPosts);

    // Load and display blog posts
    displayBlogPosts(blogPosts, blogPostsGrid, noPostsMessage);

    // Setup event listeners
    setupEventListeners(searchInput, categoryFilter, blogPostsGrid, noPostsMessage);
    
    console.log('Blog index initialization complete');
}

// Display blog posts
function displayBlogPosts(posts, blogPostsGrid, noPostsMessage) {
    console.log('Displaying blog posts:', posts.length, 'posts found');
    
    if (!blogPostsGrid) {
        console.error('Blog posts grid element not found');
        return;
    }

    if (posts.length === 0) {
        console.log('No posts to display, showing no posts message');
        blogPostsGrid.innerHTML = '';
        if (noPostsMessage) {
            noPostsMessage.style.display = 'block';
        } else {
            // Create no posts message if it doesn't exist
            blogPostsGrid.innerHTML = `
                <div class="no-posts-content" style="text-align: center; padding: 3rem 1rem;">
                    <i class="fas fa-edit" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                    <h3>No blog posts available</h3>
                    <p>No blog posts have been published yet. Check back later for new content!</p>
                </div>
            `;
        }
        return;
    }

    // Hide no posts message
    if (noPostsMessage) {
        noPostsMessage.style.display = 'none';
    }

    console.log('Generating HTML for', posts.length, 'posts');

    // Generate HTML for blog posts
    const postsHTML = posts.map(post => {
        console.log('Processing post:', post.title);
        return `
            <article class="blog-post-card" data-category="${post.category}">
                <div class="post-image">
                    <img src="${post.image}" alt="${post.title}" loading="lazy" onerror="this.src='images/posts/placeholder.jpg'">
                    <div class="post-category">${post.categoryDisplay}</div>
                </div>
                <div class="post-content">
                    <h3 class="post-title">
                        <a href="${post.url}">${post.title}</a>
                    </h3>
                    <p class="post-excerpt">${post.excerpt}</p>
                    <div class="post-meta">
                        <div class="author-info">
                            <img src="${post.authorImage}" alt="${post.author}" class="author-avatar" onerror="this.src='images/authors/default.jpg'">
                            <span class="author-name">${post.author}</span>
                        </div>
                        <div class="post-date">${formatDate(post.date)}</div>
                        <div class="read-time">${post.readTime}</div>
                    </div>
                    <div class="post-tags">
                        ${post.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="post-actions">
                        <a href="${post.url}" class="read-article-btn">
                            <i class="fas fa-book-open"></i>
                            Read Article
                        </a>
                    </div>
                </div>
            </article>
        `;
    }).join('');

    console.log('Setting innerHTML for blog posts grid');
    blogPostsGrid.innerHTML = postsHTML;
    
    // Handle image loading for proper opacity transition
    handleImageLoading(blogPostsGrid);
    
    console.log('Blog posts display completed');
}

// Handle image loading to add loaded-image class
function handleImageLoading(container) {
    if (!container) return;
    
    const images = container.querySelectorAll('img');
    images.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded-image');
        } else {
            img.addEventListener('load', function() {
                this.classList.add('loaded-image');
            });
            img.addEventListener('error', function() {
                this.classList.add('error-image');
                console.warn('Failed to load image:', this.src);
            });
        }
    });
}

// Format date for display
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Setup event listeners
function setupEventListeners(searchInput, categoryFilter, blogPostsGrid, noPostsMessage) {
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const filteredPosts = blogPosts.filter(post =>
                post.title.toLowerCase().includes(searchTerm) ||
                post.excerpt.toLowerCase().includes(searchTerm) ||
                post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
            displayBlogPosts(filteredPosts, blogPostsGrid, noPostsMessage);
        });
    }

    // Category filter functionality
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            const selectedCategory = this.value;
            const filteredPosts = selectedCategory === 'all' 
                ? blogPosts 
                : blogPosts.filter(post => post.category === selectedCategory);
            displayBlogPosts(filteredPosts, blogPostsGrid, noPostsMessage);
        });
    }

    // Read Latest Articles button
    const readLatestBtn = document.getElementById('readLatestBtn');
    if (readLatestBtn) {
        readLatestBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const blogPostsSection = document.getElementById('blog-posts');
            if (blogPostsSection) {
                blogPostsSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

// Hero image slider functionality
function initializeHeroSlider() {
    console.log('Initializing hero slider...');
    
    const slides = document.querySelectorAll('.hero-image-slide');
    const indicators = document.querySelectorAll('.indicator');
    let currentSlide = 0;

    if (slides.length === 0) {
        console.log('No hero slides found');
        return;
    }

    function showSlide(index) {
        // Remove active class from all slides and indicators
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));

        // Add active class to current slide and indicator
        slides[index].classList.add('active');
        if (indicators[index]) {
            indicators[index].classList.add('active');
        }
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // Auto-advance slides
    setInterval(nextSlide, 5000);

    // Click handlers for indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
    
    console.log('Hero slider initialized with', slides.length, 'slides');
}

// Mobile menu functionality
function initializeMobileMenu() {
    console.log('Initializing mobile menu...');
    
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.getElementById('navMenu');
    const mobileMenuIcon = document.getElementById('mobileMenuIcon');

    console.log('Mobile menu elements found:', {
        button: !!mobileMenuBtn,
        menu: !!navMenu,
        icon: !!mobileMenuIcon
    });

    if (mobileMenuBtn && navMenu) {
        // Remove any existing event listeners
        const existingHandler = mobileMenuBtn._mobileMenuHandler;
        if (existingHandler) {
            mobileMenuBtn.removeEventListener('click', existingHandler);
        }
        
        // Create mobile menu handler
        const mobileMenuHandler = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Mobile menu toggle clicked');
            
            const isActive = navMenu.classList.contains('active');
            const newState = !isActive;
            
            // Toggle menu visibility
            if (newState) {
                navMenu.classList.add('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'true');
                if (mobileMenuIcon) {
                    mobileMenuIcon.classList.remove('fa-bars');
                    mobileMenuIcon.classList.add('fa-times');
                }
            } else {
                navMenu.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                if (mobileMenuIcon) {
                    mobileMenuIcon.classList.remove('fa-times');
                    mobileMenuIcon.classList.add('fa-bars');
                }
            }
            
            console.log('Mobile menu state:', newState ? 'open' : 'closed');
        };

        // Store handler reference and add listener
        mobileMenuBtn._mobileMenuHandler = mobileMenuHandler;
        mobileMenuBtn.addEventListener('click', mobileMenuHandler);
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (navMenu.classList.contains('active')) {
                if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                    navMenu.classList.remove('active');
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                    if (mobileMenuIcon) {
                        mobileMenuIcon.classList.remove('fa-times');
                        mobileMenuIcon.classList.add('fa-bars');
                    }
                }
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                if (mobileMenuIcon) {
                    mobileMenuIcon.classList.remove('fa-times');
                    mobileMenuIcon.classList.add('fa-bars');
                }
            }
        });
        
        console.log('Mobile menu event listeners added');
    } else {
        console.error('Mobile menu elements not found');
    }
}

// Loading screen
function hideLoadingScreen() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.opacity = '0';
        setTimeout(() => {
            loading.style.display = 'none';
        }, 300);
    }
}

// Initialize AOS if available
document.addEventListener('DOMContentLoaded', function() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }
});