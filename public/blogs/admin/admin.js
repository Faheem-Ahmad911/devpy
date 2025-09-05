// DevPy Blog Admin Panel JavaScript

class BlogAdmin {
    constructor() {
        this.posts = [];
        this.currentEditingPost = null;
        this.postsPerPage = 10;
        this.currentPage = 1;
        this.storageKey = 'devpy_blog_posts'; // Consistent with blog.js
        
        this.checkAuthentication();
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

    async processUploadedImage(imageFile) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    // Generate a unique filename
                    const timestamp = Date.now();
                    const extension = imageFile.name.split('.').pop() || 'jpg';
                    const fileName = `post-${timestamp}.${extension}`;
                    
                    // Store image data in localStorage for demo purposes
                    // In a real application, this would be uploaded to a server
                    const imageData = e.target.result;
                    
                    // Store image in localStorage with a special key
                    const imageKey = `blog_image_${fileName}`;
                    localStorage.setItem(imageKey, imageData);
                    
                    resolve(fileName);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('Failed to read image file'));
            reader.readAsDataURL(imageFile);
        });
    }

    checkAuthentication() {
        const isLoggedIn = localStorage.getItem('admin_logged_in');
        if (isLoggedIn === 'true') {
            this.showAdminPanel();
        } else {
            this.showLoginModal();
        }
        
        // Clear any old sample data on initialization
        this.clearOldSampleData();
    }

    clearOldSampleData() {
        // Clear any existing blog posts to ensure clean slate
        const existingPosts = localStorage.getItem(this.storageKey);
        if (existingPosts) {
            try {
                const posts = JSON.parse(existingPosts);
                // Check if posts contain sample data (by looking for known sample titles)
                const hasSampleData = posts.some(post => 
                    post.title === "Getting Started with Modern Web Development" ||
                    post.title === "Building Scalable APIs with Node.js" ||
                    post.title === "The Future of AI in Software Development" ||
                    post.title === "Machine Learning in Web Development" ||
                    post.title === "AI Integration in Web Applications" ||
                    post.title === "Cloud Architecture Best Practices"
                );
                
                if (hasSampleData) {
                    console.log('Clearing old sample data...');
                    localStorage.removeItem(this.storageKey);
                    localStorage.removeItem('blog_last_update');
                }
            } catch (error) {
                console.log('Error checking sample data, clearing storage...');
                localStorage.removeItem(this.storageKey);
            }
        }
    }

    showLoginModal() {
        document.getElementById('loginModal').classList.add('active');
        document.getElementById('adminContent').style.display = 'none';
        this.bindLoginEvents();
    }

    showAdminPanel() {
        document.getElementById('loginModal').classList.remove('active');
        document.getElementById('adminContent').style.display = 'block';
        this.posts = this.loadPosts();
        this.init();
    }

    bindLoginEvents() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
    }

    handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Check credentials
        if (username === 'DEVPY TEAM' && password === 'puh17109') {
            localStorage.setItem('admin_logged_in', 'true');
            localStorage.setItem('admin_username', username);
            document.getElementById('adminUsername').textContent = username;
            this.showAdminPanel();
            this.hideLoginError();
        } else {
            this.showLoginError();
        }
    }

    showLoginError() {
        const errorDiv = document.getElementById('loginError');
        errorDiv.style.display = 'flex';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 3000);
    }

    hideLoginError() {
        document.getElementById('loginError').style.display = 'none';
    }

    logout() {
        localStorage.removeItem('admin_logged_in');
        localStorage.removeItem('admin_username');
        this.showLoginModal();
    }

    init() {
        this.bindEvents();
        this.loadDashboardStats();
        this.renderPostsTable();
        this.setupEditor();
        this.bindLogoutEvent();
    }

    bindLogoutEvent() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    }

    bindEvents() {
        // Modal controls
        document.getElementById('addNewPost').addEventListener('click', () => this.openPostModal());
        document.getElementById('closeModal').addEventListener('click', () => this.closePostModal());
        document.getElementById('cancelPost').addEventListener('click', () => this.closePostModal());

        // Form submission
        document.getElementById('postForm').addEventListener('submit', (e) => this.handlePostSubmit(e));

        // Search and filter
        document.getElementById('adminSearch').addEventListener('input', (e) => this.handleSearch(e.target.value));
        document.getElementById('adminCategoryFilter').addEventListener('change', (e) => this.handleFilter(e.target.value));

        // Image upload
        document.getElementById('postImage').addEventListener('change', (e) => this.handleImageUpload(e));

        // Confirmation modal
        document.getElementById('cancelConfirm').addEventListener('click', () => this.closeConfirmModal());

        // Clear all posts button
        document.getElementById('clearAllPosts').addEventListener('click', () => this.clearAllPosts());

        // Close modals on outside click
        document.getElementById('postModal').addEventListener('click', (e) => {
            if (e.target.id === 'postModal') this.closePostModal();
        });

        document.getElementById('confirmModal').addEventListener('click', (e) => {
            if (e.target.id === 'confirmModal') this.closeConfirmModal();
        });
    }

    loadPosts() {
        const savedPosts = localStorage.getItem(this.storageKey);
        if (savedPosts) {
            return JSON.parse(savedPosts);
        }
        
        // Start with empty blog list
        return [];
    }

    savePosts() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.posts));
        this.loadDashboardStats();
        this.renderPostsTable();
        // Trigger event for blog page to update
        this.notifyBlogUpdate();
    }

    notifyBlogUpdate() {
        // Create a custom event to notify other pages that blogs have been updated
        const event = new CustomEvent('blogUpdated', {
            detail: {
                timestamp: Date.now(),
                posts: this.posts
            }
        });
        window.dispatchEvent(event);
        
        // Also store an update flag for pages to check
        localStorage.setItem('blog_last_update', Date.now().toString());
    }

    loadDashboardStats() {
        const totalPosts = this.posts.length;
        const publishedPosts = this.posts.filter(post => post.status === 'published');
        const totalViews = publishedPosts.reduce((sum, post) => sum + (post.views || 0), 0);
        const thisMonth = new Date().getMonth();
        const thisYear = new Date().getFullYear();
        const postsThisMonth = this.posts.filter(post => {
            const postDate = new Date(post.publishDate);
            return postDate.getMonth() === thisMonth && postDate.getFullYear() === thisYear;
        }).length;

        document.getElementById('totalPosts').textContent = totalPosts;
        document.getElementById('totalViews').textContent = totalViews.toLocaleString();
        document.getElementById('postsThisMonth').textContent = postsThisMonth;
    }

    renderPostsTable(filteredPosts = null) {
        const posts = filteredPosts || this.posts;
        const tbody = document.getElementById('postsTableBody');
        
        if (posts.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">No posts found</td></tr>';
            return;
        }

        tbody.innerHTML = posts.map(post => `
            <tr>
                <td>
                    <strong>${post.title}</strong>
                    <br>
                    <small class="text-muted">${post.excerpt.substring(0, 50)}...</small>
                </td>
                <td>
                    <span class="category-badge">${this.formatCategory(post.category)}</span>
                </td>
                <td>${(post.author && post.author.name) ? post.author.name : post.author || 'Unknown Author'}</td>
                <td>${this.formatDate(post.publishDate)}</td>
                <td>
                    <span class="post-status ${post.status}">${post.status}</span>
                </td>
                <td>
                    <div class="post-actions">
                        <button class="edit-btn" onclick="blogAdmin.editPost(${post.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-btn" onclick="blogAdmin.deletePost(${post.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    formatCategory(category) {
        const categories = {
            'web-development': 'Web Development',
            'ai-ml': 'AI & ML',
            'cloud-devops': 'Cloud & DevOps',
            'database': 'Database',
            'case-study': 'Case Study'
        };
        return categories[category] || category;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    handleSearch(query) {
        const filteredPosts = this.posts.filter(post => {
            const authorName = (post.author && post.author.name) ? post.author.name : post.author || '';
            return post.title.toLowerCase().includes(query.toLowerCase()) ||
                   authorName.toLowerCase().includes(query.toLowerCase()) ||
                   post.excerpt.toLowerCase().includes(query.toLowerCase());
        });
        this.renderPostsTable(filteredPosts);
    }

    handleFilter(category) {
        if (category === 'all') {
            this.renderPostsTable();
        } else {
            const filteredPosts = this.posts.filter(post => post.category === category);
            this.renderPostsTable(filteredPosts);
        }
    }

    openPostModal(post = null) {
        const modal = document.getElementById('postModal');
        const modalTitle = document.getElementById('modalTitle');
        const form = document.getElementById('postForm');
        
        this.currentEditingPost = post;
        
        if (post) {
            modalTitle.textContent = 'Edit Post';
            this.populateForm(post);
        } else {
            modalTitle.textContent = 'Add New Post';
            form.reset();
            this.clearImagePreview();
            document.getElementById('postContent').innerHTML = '';
        }
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closePostModal() {
        const modal = document.getElementById('postModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
        this.currentEditingPost = null;
    }

    populateForm(post) {
        document.getElementById('postTitle').value = post.title;
        document.getElementById('postCategory').value = post.category;
        document.getElementById('postAuthor').value = (post.author && post.author.name) ? post.author.name : post.author || '';
        document.getElementById('postExcerpt').value = post.excerpt;
        document.getElementById('postContent').innerHTML = post.content;
        document.getElementById('postTags').value = post.tags ? post.tags.join(', ') : '';
        document.getElementById('postStatus').value = post.status;
        
        if (post.featuredImage || post.image) {
            const imageSrc = this.getImageSrc(post.featuredImage || post.image);
            this.showImagePreview(imageSrc);
        }
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.showImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    }

    showImagePreview(src) {
        const preview = document.getElementById('imagePreview');
        preview.innerHTML = `<img src="${src}" alt="Preview">`;
    }

    clearImagePreview() {
        const preview = document.getElementById('imagePreview');
        preview.innerHTML = `
            <i class="fas fa-image"></i>
            <p>Upload featured image</p>
        `;
    }

    async processUploadedImage(imageFile) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    // Generate a unique filename
                    const timestamp = Date.now();
                    const extension = imageFile.name.split('.').pop() || 'jpg';
                    const fileName = `post-${timestamp}.${extension}`;
                    
                    // Store image data in localStorage for demo purposes
                    // In a real application, this would be uploaded to a server
                    const imageData = e.target.result;
                    
                    // Store image in localStorage with a special key
                    const imageKey = `blog_image_${fileName}`;
                    localStorage.setItem(imageKey, imageData);
                    
                    resolve(fileName);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('Failed to read image file'));
            reader.readAsDataURL(imageFile);
        });
    }

    async handlePostSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const postData = {
            title: formData.get('title'),
            category: formData.get('category'),
            author: {
                name: formData.get('author')
            },
            excerpt: formData.get('excerpt'),
            content: document.getElementById('postContent').innerHTML,
            tags: formData.get('tags') ? formData.get('tags').split(',').map(tag => tag.trim()) : [],
            status: formData.get('status'),
            publishDate: new Date().toISOString(),
            readTime: Math.ceil(document.getElementById('postContent').innerText.length / 200) || 1,
            views: 0
        };

        // Handle image
        const imageFile = formData.get('image');
        if (imageFile && imageFile.size > 0) {
            // Process the uploaded image
            const imageFileName = await this.processUploadedImage(imageFile);
            postData.featuredImage = `./images/post-images/${imageFileName}`;
        } else if (this.currentEditingPost) {
            postData.featuredImage = this.currentEditingPost.featuredImage;
        } else {
            postData.featuredImage = './images/posts/placeholder.jpg';
        }

        if (this.currentEditingPost) {
            // Edit existing post
            postData.id = this.currentEditingPost.id;
            postData.views = this.currentEditingPost.views;
            const index = this.posts.findIndex(post => post.id === this.currentEditingPost.id);
            this.posts[index] = postData;
            this.showMessage('Post updated successfully!', 'success');
        } else {
            // Add new post
            postData.id = Date.now();
            this.posts.unshift(postData);
            this.showMessage('Post created successfully!', 'success');
        }

        this.savePosts();
        this.closePostModal();
    }

    editPost(id) {
        const post = this.posts.find(post => post.id === id);
        if (post) {
            this.openPostModal(post);
        }
    }

    clearAllPosts() {
        this.showConfirmModal(
            'Are you sure you want to delete ALL blog posts? This action cannot be undone.',
            () => {
                this.posts = [];
                localStorage.removeItem(this.storageKey);
                localStorage.removeItem('blog_last_update');
                this.loadDashboardStats();
                this.renderPostsTable();
                this.notifyBlogUpdate();
                this.showMessage('All posts cleared successfully!', 'success');
                this.closeConfirmModal();
            }
        );
    }

    deletePost(id) {
        const post = this.posts.find(post => post.id === id);
        if (post) {
            this.showConfirmModal(
                `Are you sure you want to delete "${post.title}"?`,
                () => {
                    this.posts = this.posts.filter(p => p.id !== id);
                    this.savePosts();
                    this.showMessage('Post deleted successfully!', 'success');
                    this.closeConfirmModal();
                }
            );
        }
    }

    showConfirmModal(message, onConfirm) {
        const modal = document.getElementById('confirmModal');
        const messageEl = document.getElementById('confirmMessage');
        const confirmBtn = document.getElementById('confirmAction');
        
        messageEl.textContent = message;
        confirmBtn.onclick = onConfirm;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeConfirmModal() {
        const modal = document.getElementById('confirmModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    setupEditor() {
        const editor = document.getElementById('postContent');
        const toolbar = document.querySelectorAll('.editor-btn');
        
        toolbar.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const command = btn.dataset.command;
                
                if (command === 'createLink') {
                    const url = prompt('Enter URL:');
                    if (url) {
                        document.execCommand(command, false, url);
                    }
                } else if (command === 'insertImage') {
                    const url = prompt('Enter image URL:');
                    if (url) {
                        document.execCommand(command, false, url);
                    }
                } else {
                    document.execCommand(command, false, null);
                }
                
                editor.focus();
            });
        });
    }

    showMessage(text, type = 'success') {
        // Create message element
        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = text;
        
        // Insert at the top of admin main
        const adminMain = document.querySelector('.admin-main');
        adminMain.insertBefore(message, adminMain.firstChild);
        
        // Remove after 5 seconds
        setTimeout(() => {
            message.remove();
        }, 5000);
    }

    // Export posts data (for backup)
    exportPosts() {
        const dataStr = JSON.stringify(this.posts, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'blog-posts-backup.json';
        link.click();
        
        URL.revokeObjectURL(url);
    }

    // Import posts data
    importPosts(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedPosts = JSON.parse(e.target.result);
                this.posts = importedPosts;
                this.savePosts();
                this.showMessage('Posts imported successfully!', 'success');
            } catch (error) {
                this.showMessage('Error importing posts. Please check the file format.', 'error');
            }
        };
        reader.readAsText(file);
    }
}

// API simulation for blog posts
class BlogAPI {
    static async getPosts(page = 1, limit = 6, category = 'all', search = '') {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const posts = blogAdmin ? blogAdmin.posts : [];
        let filteredPosts = posts.filter(post => post.status === 'published');
        
        // Apply filters
        if (category !== 'all') {
            filteredPosts = filteredPosts.filter(post => post.category === category);
        }
        
        if (search) {
            filteredPosts = filteredPosts.filter(post => 
                post.title.toLowerCase().includes(search.toLowerCase()) ||
                post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
                post.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
            );
        }
        
        // Sort by date (newest first)
        filteredPosts.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
        
        // Paginate
        const startIndex = (page - 1) * limit;
        const paginatedPosts = filteredPosts.slice(startIndex, startIndex + limit);
        
        return {
            posts: paginatedPosts,
            totalPosts: filteredPosts.length,
            totalPages: Math.ceil(filteredPosts.length / limit),
            currentPage: page
        };
    }
    
    static async getPost(id) {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const posts = blogAdmin ? blogAdmin.posts : [];
        return posts.find(post => post.id === parseInt(id));
    }
}

// Initialize admin when DOM is loaded
let blogAdmin;

document.addEventListener('DOMContentLoaded', () => {
    blogAdmin = new BlogAdmin();
});

// Export for use in other files
window.BlogAPI = BlogAPI;
window.blogAdmin = blogAdmin;
