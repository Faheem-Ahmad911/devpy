// Simple Blog Frontend - No Database Required!

// Initialize blog system when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DevPy Simple Blog: DOM loaded, initializing...');
    
    // Load the simple blog system
    loadScript('/blogs/scripts/simple-blog-system.js').then(() => {
        initializeSimpleBlog();
    });
});

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

function initializeSimpleBlog() {
    console.log('Initializing Simple Blog System...');
    
    // Initialize the blog system
    window.blogSystem = window.blogSystem || new SimpleBlogSystem();
    
    // Initialize all blog features
    initializeBlogPosts();
    initializeSearch();
    initializeNavigation();
    initializeScrollEffects();
    initializeLazyLoading();
    initializeAnimations();
    initializeTheme();
    initializeHeroSlider();
    initializeLatestPostButton();
    
    // Listen for post updates
    window.addEventListener('postsUpdated', () => {
        loadBlogPosts();
    });
    
    console.log('Simple Blog System initialized successfully');
}

// Global variables
let currentPage = 1;
let currentCategory = 'all';
let currentSearch = '';
const postsPerPage = 6;

function initializeBlogPosts() {
    console.log('Initializing blog posts...');
    loadBlogPosts();
    
    // Category filter
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
            currentCategory = e.target.value;
            currentPage = 1;
            loadBlogPosts();
        });
    }
    
    // Search functionality
    const searchInput = document.getElementById('blogSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value;
            currentPage = 1;
            loadBlogPosts();
        });
    }
}

async function loadBlogPosts() {
    console.log('Loading blog posts...');
    
    const gridContainer = document.getElementById('blogPostsGrid');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const noPostsMessage = document.getElementById('noPostsMessage');
    const paginationContainer = document.getElementById('paginationContainer');
    
    if (!gridContainer) {
        console.error('Blog grid container not found!');
        return;
    }
    
    // Show loading
    if (loadingSpinner) loadingSpinner.style.display = 'flex';
    if (noPostsMessage) noPostsMessage.style.display = 'none';
    if (paginationContainer) paginationContainer.style.display = 'none';
    
    try {
        // Get posts from the blog system
        let allPosts = window.blogSystem.getPublishedPosts();
        console.log('Loaded posts:', allPosts.length);
        
        // Apply filters
        let filteredPosts = allPosts;
        
        if (currentCategory !== 'all') {
            filteredPosts = filteredPosts.filter(post => post.category === currentCategory);
            console.log(`Filtered by category ${currentCategory}:`, filteredPosts.length);
        }
        
        if (currentSearch) {
            const searchTerm = currentSearch.toLowerCase();
            filteredPosts = filteredPosts.filter(post => 
                post.title.toLowerCase().includes(searchTerm) ||
                post.excerpt.toLowerCase().includes(searchTerm) ||
                (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
            );
            console.log(`Filtered by search "${currentSearch}":`, filteredPosts.length);
        }
        
        // Sort by date (newest first)
        filteredPosts.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
        
        // Pagination
        const totalPosts = filteredPosts.length;
        const totalPages = Math.ceil(totalPosts / postsPerPage);
        const startIndex = (currentPage - 1) * postsPerPage;
        const endIndex = Math.min(startIndex + postsPerPage, totalPosts);
        const postsToShow = filteredPosts.slice(startIndex, endIndex);
        
        console.log(`Showing posts ${startIndex + 1}-${endIndex} of ${totalPosts}`);
        
        // Hide loading
        if (loadingSpinner) loadingSpinner.style.display = 'none';
        
        if (postsToShow.length === 0) {
            // Show no posts message
            if (noPostsMessage) {
                noPostsMessage.style.display = 'block';
                const message = currentSearch || currentCategory !== 'all' 
                    ? 'No posts found matching your criteria.' 
                    : 'No blog posts available yet.';
                noPostsMessage.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-search"></i>
                        <h3>${message}</h3>
                        <p>Try adjusting your search or filter criteria.</p>
                    </div>
                `;
            }
            gridContainer.innerHTML = '';
            return;
        }
        
        // Render posts
        gridContainer.innerHTML = postsToShow.map(post => createPostCard(post)).join('');
        
        // Setup pagination
        if (totalPages > 1 && paginationContainer) {
            setupPagination(totalPages, paginationContainer);
            paginationContainer.style.display = 'block';
        }
        
        // Initialize lazy loading for images
        initializeLazyLoading();
        
    } catch (error) {
        console.error('Error loading blog posts:', error);
        if (loadingSpinner) loadingSpinner.style.display = 'none';
        if (noPostsMessage) {
            noPostsMessage.style.display = 'block';
            noPostsMessage.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Error loading posts</h3>
                    <p>Please try again later.</p>
                </div>
            `;
        }
    }
}

function createPostCard(post) {
    const imageUrl = window.blogSystem.getImageUrl(post.image);
    const publishDate = new Date(post.publishDate).toLocaleDateString();
    const excerpt = post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
    
    return `
        <article class="blog-card" data-aos="fade-up" data-aos-delay="100">
            <div class="blog-card-image">
                <img src="${imageUrl}" alt="${escapeHtml(post.title)}" loading="lazy" 
                     onerror="this.src='./images/posts/placeholder.jpg'">
                <div class="blog-card-category">
                    <span class="category-badge">${escapeHtml(post.category || 'General')}</span>
                </div>
            </div>
            <div class="blog-card-content">
                <div class="blog-card-meta">
                    <span class="blog-date">
                        <i class="fas fa-calendar-alt"></i>
                        ${publishDate}
                    </span>
                    <span class="blog-read-time">
                        <i class="fas fa-clock"></i>
                        ${post.readTime || '5 min read'}
                    </span>
                </div>
                <h3 class="blog-card-title">
                    <a href="#" onclick="openPostModal('${post.id}'); return false;">
                        ${escapeHtml(post.title)}
                    </a>
                </h3>
                <p class="blog-card-excerpt">${escapeHtml(excerpt)}</p>
                <div class="blog-card-footer">
                    <div class="blog-author">
                        <img src="./images/authors/default.jpg" alt="${escapeHtml(post.author || 'DevPy Team')}" 
                             onerror="this.src='./images/authors/default.jpg'">
                        <span>${escapeHtml(post.author || 'DevPy Team')}</span>
                    </div>
                    <a href="#" class="read-more-btn" onclick="openPostModal('${post.id}'); return false;">
                        Read More <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
                ${post.tags && post.tags.length > 0 ? `
                    <div class="blog-tags">
                        ${post.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        </article>
    `;
}

function openPostModal(postId) {
    const posts = window.blogSystem.getPublishedPosts();
    const post = posts.find(p => p.id === postId);
    
    if (!post) {
        console.error('Post not found:', postId);
        return;
    }
    
    // Increment view count
    window.blogSystem.updatePost(postId, { views: (post.views || 0) + 1 });
    
    // Create modal HTML
    const imageUrl = window.blogSystem.getImageUrl(post.image);
    const publishDate = new Date(post.publishDate).toLocaleDateString();
    
    const modalHTML = `
        <div class="post-modal-overlay" onclick="closePostModal()">
            <div class="post-modal" onclick="event.stopPropagation()">
                <div class="post-modal-header">
                    <button class="close-btn" onclick="closePostModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="post-modal-content">
                    <div class="post-hero">
                        <img src="${imageUrl}" alt="${escapeHtml(post.title)}" 
                             onerror="this.src='./images/posts/placeholder.jpg'">
                    </div>
                    <div class="post-content">
                        <div class="post-meta">
                            <span class="post-category">${escapeHtml(post.category || 'General')}</span>
                            <span class="post-date">${publishDate}</span>
                            <span class="post-read-time">${post.readTime || '5 min read'}</span>
                        </div>
                        <h1 class="post-title">${escapeHtml(post.title)}</h1>
                        <div class="post-author">
                            <img src="./images/authors/default.jpg" alt="${escapeHtml(post.author || 'DevPy Team')}">
                            <span>By ${escapeHtml(post.author || 'DevPy Team')}</span>
                        </div>
                        <div class="post-body">
                            ${post.content}
                        </div>
                        ${post.tags && post.tags.length > 0 ? `
                            <div class="post-tags">
                                <h4>Tags:</h4>
                                ${post.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to page
    const modalContainer = document.createElement('div');
    modalContainer.id = 'postModalContainer';
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);
    
    // Add animation class
    setTimeout(() => {
        modalContainer.querySelector('.post-modal-overlay').classList.add('active');
    }, 10);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closePostModal() {
    const modalContainer = document.getElementById('postModalContainer');
    if (modalContainer) {
        modalContainer.querySelector('.post-modal-overlay').classList.remove('active');
        setTimeout(() => {
            modalContainer.remove();
            document.body.style.overflow = '';
        }, 300);
    }
}

function setupPagination(totalPages, container) {
    let paginationHTML = '<div class="pagination">';
    
    // Previous button
    if (currentPage > 1) {
        paginationHTML += `
            <button class="pagination-btn" onclick="changePage(${currentPage - 1})">
                <i class="fas fa-chevron-left"></i> Previous
            </button>
        `;
    }
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            paginationHTML += `<button class="pagination-btn active">${i}</button>`;
        } else if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 2) {
            paginationHTML += `<button class="pagination-btn" onclick="changePage(${i})">${i}</button>`;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            paginationHTML += `<span class="pagination-dots">...</span>`;
        }
    }
    
    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `
            <button class="pagination-btn" onclick="changePage(${currentPage + 1})">
                Next <i class="fas fa-chevron-right"></i>
            </button>
        `;
    }
    
    paginationHTML += '</div>';
    container.innerHTML = paginationHTML;
}

function changePage(page) {
    currentPage = page;
    loadBlogPosts();
    
    // Scroll to top of blog section
    const blogSection = document.getElementById('blogPostsGrid');
    if (blogSection) {
        blogSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Helper functions (implement based on your existing code)
function initializeSearch() {
    console.log('Search initialized');
}

function initializeNavigation() {
    console.log('Navigation initialized');
}

function initializeScrollEffects() {
    console.log('Scroll effects initialized');
}

function initializeLazyLoading() {
    console.log('Lazy loading initialized');
}

function initializeAnimations() {
    console.log('Animations initialized');
}

function initializeTheme() {
    console.log('Theme initialized');
}

function initializeHeroSlider() {
    console.log('Hero slider initialized');
}

function initializeLatestPostButton() {
    console.log('Latest post button initialized');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Make functions globally available
window.openPostModal = openPostModal;
window.closePostModal = closePostModal;
window.changePage = changePage;
