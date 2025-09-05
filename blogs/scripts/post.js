// Individual Post Page JavaScript
class PostManager {
    constructor() {
        this.blogAPI = new BlogAPI();
        this.currentPost = null;
        this.init();
    }

    init() {
        this.loadPost();
        this.initShareButtons();
        this.initComments();
    }

    async loadPost() {
        try {
            this.showLoading();
            
            // Get post ID from URL
            const urlParams = new URLSearchParams(window.location.search);
            const postId = urlParams.get('id');
            
            if (!postId) {
                this.showError('Post not found', 'No post ID provided');
                return;
            }

            // Load post data
            const post = await this.blogAPI.getPost(postId);
            
            if (!post) {
                this.showError('Post not found', 'The requested post could not be found');
                return;
            }

            this.currentPost = post;
            this.renderPost(post);
            this.loadRelatedPosts(post);
            this.updateBreadcrumbs(post);
            
            // Update page meta
            this.updatePageMeta(post);
            
        } catch (error) {
            console.error('Error loading post:', error);
            this.showError('Error loading post', 'Please try again later');
        }
    }

    showLoading() {
        const container = document.getElementById('post-container');
        container.innerHTML = `
            <div class="post-loading">
                <div class="spinner"></div>
                <h3>Loading post...</h3>
                <p>Please wait while we fetch the content</p>
            </div>
        `;
    }

    showError(title, message) {
        const container = document.getElementById('post-container');
        container.innerHTML = `
            <div class="post-error">
                <i class="fas fa-exclamation-triangle"></i>
                <h2>${title}</h2>
                <p>${message}</p>
                <a href="/blogs/" class="btn btn-primary">
                    <i class="fas fa-arrow-left"></i>
                    Back to Blog
                </a>
            </div>
        `;
    }

    renderPost(post) {
        const container = document.getElementById('post-container');
        
        const postHTML = `
            <article class="post-article">
                <header class="post-header">
                    <span class="post-category-badge">${post.category}</span>
                    <h1 class="post-title">${post.title}</h1>
                    <p class="post-excerpt">${post.excerpt}</p>
                    
                    <div class="post-meta">
                        <div class="author-info">
                            <i class="fas fa-user"></i>
                            <span class="author-name">${(post.author && post.author.name) ? post.author.name : post.author || 'Unknown Author'}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-calendar"></i>
                            <span>${this.formatDate(post.publishDate)}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-clock"></i>
                            <span>${this.calculateReadingTime(post.content)} min read</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-eye"></i>
                            <span>${post.views || 0} views</span>
                        </div>
                    </div>
                </header>

                ${post.featuredImage ? `
                    <img src="${this.getImageSrc(post.featuredImage)}" alt="${post.title}" class="post-featured-image" onerror="this.src='./images/posts/placeholder.jpg'">
                ` : ''}

                <div class="post-content" id="post-content">
                    ${post.content}
                </div>

                ${post.tags && post.tags.length > 0 ? `
                    <div class="post-tags">
                        <h4>Tags</h4>
                        <div class="tags-list">
                            ${post.tags.map(tag => `
                                <a href="index.html?tag=${encodeURIComponent(tag)}" class="tag">${tag}</a>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <div class="post-share">
                    <h4>Share this post</h4>
                    <div class="share-buttons">
                        <button class="share-btn twitter" data-platform="twitter">
                            <i class="fab fa-twitter"></i>
                            Twitter
                        </button>
                        <button class="share-btn facebook" data-platform="facebook">
                            <i class="fab fa-facebook"></i>
                            Facebook
                        </button>
                        <button class="share-btn linkedin" data-platform="linkedin">
                            <i class="fab fa-linkedin"></i>
                            LinkedIn
                        </button>
                        <button class="share-btn copy" data-platform="copy">
                            <i class="fas fa-link"></i>
                            Copy Link
                        </button>
                    </div>
                </div>

                <div class="post-navigation" id="post-navigation">
                    <!-- Navigation will be loaded here -->
                </div>
            </article>
        `;

        container.innerHTML = postHTML;
        
        // Show the post content
        container.style.display = 'block';
        
        // Hide any loading indicators
        const loadingElement = document.querySelector('.post-loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
        
        // Increment view count
        this.incrementViews(post.id);
    }

    async loadRelatedPosts(currentPost) {
        try {
            const allPosts = await this.blogAPI.getAllPosts();
            
            // Filter out current post and find related posts
            const relatedPosts = allPosts
                .filter(post => post.id !== currentPost.id && post.status === 'published')
                .filter(post => {
                    // Find posts with same category or matching tags
                    const sameCategory = post.category === currentPost.category;
                    const matchingTags = currentPost.tags && post.tags && 
                        post.tags.some(tag => currentPost.tags.includes(tag));
                    return sameCategory || matchingTags;
                })
                .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
                .slice(0, 3);

            // If not enough related posts, fill with recent posts
            if (relatedPosts.length < 3) {
                const recentPosts = allPosts
                    .filter(post => post.id !== currentPost.id && post.status === 'published')
                    .filter(post => !relatedPosts.find(rp => rp.id === post.id))
                    .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
                    .slice(0, 3 - relatedPosts.length);
                
                relatedPosts.push(...recentPosts);
            }

            this.renderRelatedPosts(relatedPosts);
            
            // Load post navigation
            this.loadPostNavigation(currentPost, allPosts);
            
        } catch (error) {
            console.error('Error loading related posts:', error);
        }
    }

    renderRelatedPosts(posts) {
        const relatedSection = document.getElementById('related-posts-section');
        
        if (posts.length === 0) {
            relatedSection.style.display = 'none';
            return;
        }

        const relatedHTML = `
            <section class="related-posts">
                <div class="section-header">
                    <h2>Related Posts</h2>
                </div>
                <div class="related-posts-grid">
                    ${posts.map(post => `
                        <article class="related-post-card">
                            <div class="post-image">
                                <img src="${post.featuredImage || '/public/images/default-blog.jpg'}" 
                                     alt="${post.title}">
                            </div>
                            <div class="post-content">
                                <h3 class="post-title">
                                    <a href="/blogs/post.html?id=${post.id}">${post.title}</a>
                                </h3>
                                <p class="post-excerpt">${post.excerpt}</p>
                                <div class="post-date">
                                    <i class="fas fa-calendar"></i>
                                    <span>${this.formatDate(post.publishDate)}</span>
                                </div>
                            </div>
                        </article>
                    `).join('')}
                </div>
            </section>
        `;

        relatedSection.innerHTML = relatedHTML;
    }

    async loadPostNavigation(currentPost, allPosts) {
        const publishedPosts = allPosts
            .filter(post => post.status === 'published')
            .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));

        const currentIndex = publishedPosts.findIndex(post => post.id === currentPost.id);
        
        let navigationHTML = '';
        
        // Previous post (newer)
        if (currentIndex > 0) {
            const prevPost = publishedPosts[currentIndex - 1];
            navigationHTML += `
                <a href="/blogs/post.html?id=${prevPost.id}" class="nav-post prev">
                    <i class="fas fa-chevron-left"></i>
                    <div>
                        <span>Previous</span>
                        <strong>${prevPost.title}</strong>
                    </div>
                </a>
            `;
        } else {
            navigationHTML += '<div></div>';
        }

        // Next post (older)
        if (currentIndex < publishedPosts.length - 1) {
            const nextPost = publishedPosts[currentIndex + 1];
            navigationHTML += `
                <a href="/blogs/post.html?id=${nextPost.id}" class="nav-post next">
                    <div>
                        <span>Next</span>
                        <strong>${nextPost.title}</strong>
                    </div>
                    <i class="fas fa-chevron-right"></i>
                </a>
            `;
        } else {
            navigationHTML += '<div></div>';
        }

        document.getElementById('post-navigation').innerHTML = navigationHTML;
    }

    updateBreadcrumbs(post) {
        const breadcrumbs = document.querySelector('.breadcrumbs');
        if (breadcrumbs) {
            const currentItem = breadcrumbs.querySelector('.breadcrumb-item:last-child');
            if (currentItem) {
                currentItem.textContent = post.title;
            }
        }
    }

    updatePageMeta(post) {
        // Update page title
        document.title = `${post.title} - DevPy Blog`;
        
        // Update meta description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.name = 'description';
            document.head.appendChild(metaDescription);
        }
        metaDescription.content = post.excerpt;

        // Update Open Graph tags
        this.updateOpenGraphTags(post);
    }

    updateOpenGraphTags(post) {
        const ogTags = {
            'og:title': post.title,
            'og:description': post.excerpt,
            'og:type': 'article',
            'og:url': window.location.href,
            'og:image': post.featuredImage || '/public/images/default-blog.jpg',
            'article:published_time': post.publishDate,
            'article:author': post.author.name,
            'article:section': post.category
        };

        Object.entries(ogTags).forEach(([property, content]) => {
            let metaTag = document.querySelector(`meta[property="${property}"]`);
            if (!metaTag) {
                metaTag = document.createElement('meta');
                metaTag.setAttribute('property', property);
                document.head.appendChild(metaTag);
            }
            metaTag.content = content;
        });
    }

    initShareButtons() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.share-btn') || e.target.closest('.share-btn')) {
                e.preventDefault();
                
                const button = e.target.closest('.share-btn');
                const platform = button.dataset.platform;
                
                this.sharePost(platform);
            }
        });
    }

    sharePost(platform) {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(this.currentPost.title);
        const text = encodeURIComponent(this.currentPost.excerpt);

        const shareUrls = {
            twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}&via=DevPy`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
            copy: null
        };

        if (platform === 'copy') {
            this.copyToClipboard(window.location.href);
        } else if (shareUrls[platform]) {
            window.open(shareUrls[platform], '_blank', 'width=600,height=400');
        }
    }

    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showToast('Link copied to clipboard!', 'success');
        } catch (error) {
            console.error('Failed to copy:', error);
            this.showToast('Failed to copy link', 'error');
        }
    }

    showToast(message, type = 'info') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'info'}-circle"></i>
                <span>${message}</span>
            </div>
        `;

        // Add styles
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--bg-card);
            border: 1px solid var(--glass-border);
            border-radius: var(--radius-md);
            padding: var(--space-md);
            box-shadow: var(--glass-shadow);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform var(--transition-fast);
        `;

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    async incrementViews(postId) {
        try {
            // Check if already viewed in this session
            const viewedPosts = JSON.parse(sessionStorage.getItem('viewedPosts') || '[]');
            if (viewedPosts.includes(postId)) {
                return;
            }

            await this.blogAPI.incrementViews(postId);
            
            // Mark as viewed in this session
            viewedPosts.push(postId);
            sessionStorage.setItem('viewedPosts', JSON.stringify(viewedPosts));
            
        } catch (error) {
            console.error('Error incrementing views:', error);
        }
    }

    initComments() {
        // Placeholder for future comment system integration
        // Could integrate with services like Disqus, Commento, or custom solution
        console.log('Comments system ready for integration');
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    }

    calculateReadingTime(content) {
        const wordsPerMinute = 200;
        const words = content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length;
        return Math.ceil(words / wordsPerMinute);
    }

    getImageSrc(imagePath) {
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
}

// Blog API Extension for Post-specific methods
class BlogAPI {
    constructor() {
        this.storageKey = 'devpy_blog_posts';
        this.init();
    }

    init() {
        // No need to initialize sample data - let admin system handle all posts
        // This ensures consistency with admin-created posts
    }

    async getPost(postId) {
        const posts = await this.getAllPosts();
        // Handle both string and numeric IDs for compatibility
        return posts.find(post => post.id == postId || post.id === postId.toString() || post.id === parseInt(postId));
    }

    async getAllPosts() {
        const posts = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        return posts.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
    }

    async incrementViews(postId) {
        const posts = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        // Handle both string and numeric IDs for compatibility
        const postIndex = posts.findIndex(post => post.id == postId || post.id === postId.toString() || post.id === parseInt(postId));
        
        if (postIndex !== -1) {
            posts[postIndex].views = (posts[postIndex].views || 0) + 1;
            localStorage.setItem(this.storageKey, JSON.stringify(posts));
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PostManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PostManager, BlogAPI };
}
