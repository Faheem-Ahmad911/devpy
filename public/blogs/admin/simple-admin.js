// Updated Admin Panel - No Database Required!
// Uses the simple blog system with localStorage

class SimpleBlogAdmin {
    constructor() {
        this.currentEditingPost = null;
        this.postsPerPage = 10;
        this.currentPage = 1;
        
        // Initialize blog system
        this.blogSystem = window.blogSystem || new SimpleBlogSystem();
        
        this.checkAuthentication();
    }

    checkAuthentication() {
        const isLoggedIn = localStorage.getItem('admin_logged_in');
        if (isLoggedIn === 'true') {
            this.showAdminPanel();
        } else {
            this.showLoginModal();
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
        
        // Simple authentication
        if (username === 'DEVPY TEAM' && password === 'puh17109') {
            localStorage.setItem('admin_logged_in', 'true');
            localStorage.setItem('admin_username', username);
            
            const adminUsername = document.getElementById('adminUsername');
            if (adminUsername) {
                adminUsername.textContent = username;
            }
            
            this.showAdminPanel();
            this.hideLoginError();
        } else {
            this.showLoginError('Invalid credentials. Please try again.');
        }
    }

    showLoginError(message = 'Invalid credentials. Please try again.') {
        const errorDiv = document.getElementById('loginError');
        if (errorDiv) {
            const errorSpan = errorDiv.querySelector('span');
            if (errorSpan) {
                errorSpan.textContent = message;
            }
            errorDiv.style.display = 'flex';
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 5000);
        }
    }

    hideLoginError() {
        const errorDiv = document.getElementById('loginError');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
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
        
        // Listen for post updates
        window.addEventListener('postsUpdated', () => {
            this.loadDashboardStats();
            this.renderPostsTable();
        });
    }

    bindLogoutEvent() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    }

    bindEvents() {
        // Modal controls
        const addNewPost = document.getElementById('addNewPost');
        if (addNewPost) {
            addNewPost.addEventListener('click', () => this.openPostModal());
        }

        const closeModal = document.getElementById('closeModal');
        if (closeModal) {
            closeModal.addEventListener('click', () => this.closePostModal());
        }

        const cancelPost = document.getElementById('cancelPost');
        if (cancelPost) {
            cancelPost.addEventListener('click', () => this.closePostModal());
        }

        // Form submission
        const postForm = document.getElementById('postForm');
        if (postForm) {
            postForm.addEventListener('submit', (e) => this.handlePostSubmit(e));
        }

        // Search and filter
        const adminSearch = document.getElementById('adminSearch');
        if (adminSearch) {
            adminSearch.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        const adminCategoryFilter = document.getElementById('adminCategoryFilter');
        if (adminCategoryFilter) {
            adminCategoryFilter.addEventListener('change', (e) => this.handleFilter(e.target.value));
        }

        // Image upload
        const postImage = document.getElementById('postImage');
        if (postImage) {
            postImage.addEventListener('change', (e) => this.handleImageUpload(e));
        }

        // Clear all posts button
        const clearAllPosts = document.getElementById('clearAllPosts');
        if (clearAllPosts) {
            clearAllPosts.addEventListener('click', () => this.clearAllPosts());
        }

        // Export/Import buttons
        const exportBtn = document.getElementById('exportPosts');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportPosts());
        }

        const importBtn = document.getElementById('importPosts');
        if (importBtn) {
            importBtn.addEventListener('click', () => this.importPosts());
        }
    }

    loadDashboardStats() {
        const posts = this.blogSystem.getAllPosts();
        const publishedPosts = posts.filter(post => post.status === 'published');
        const totalViews = publishedPosts.reduce((sum, post) => sum + (post.views || 0), 0);
        
        const thisMonth = new Date().getMonth();
        const thisYear = new Date().getFullYear();
        const postsThisMonth = posts.filter(post => {
            const postDate = new Date(post.publishDate);
            return postDate.getMonth() === thisMonth && postDate.getFullYear() === thisYear;
        }).length;

        // Update dashboard
        const totalPostsEl = document.getElementById('totalPosts');
        if (totalPostsEl) totalPostsEl.textContent = posts.length;

        const totalViewsEl = document.getElementById('totalViews');
        if (totalViewsEl) totalViewsEl.textContent = totalViews.toLocaleString();

        const postsThisMonthEl = document.getElementById('postsThisMonth');
        if (postsThisMonthEl) postsThisMonthEl.textContent = postsThisMonth;
    }

    renderPostsTable() {
        const tbody = document.querySelector('#postsTable tbody');
        if (!tbody) return;

        const posts = this.blogSystem.getAllPosts();
        
        if (posts.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">
                        <div class="empty-state">
                            <i class="fas fa-file-alt"></i>
                            <p>No blog posts yet</p>
                            <button class="btn btn-primary" onclick="blogAdmin.openPostModal()">
                                <i class="fas fa-plus"></i> Create your first post
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = posts.map(post => `
            <tr>
                <td>
                    <div class="post-title">
                        <h4>${this.escapeHtml(post.title)}</h4>
                        <p>${this.escapeHtml(post.excerpt?.substring(0, 100) || '')}...</p>
                    </div>
                </td>
                <td>
                    <span class="badge badge-${this.getCategoryColor(post.category)}">
                        ${this.escapeHtml(post.category || 'Uncategorized')}
                    </span>
                </td>
                <td>${this.escapeHtml(post.author || 'DevPy Team')}</td>
                <td>${new Date(post.publishDate).toLocaleDateString()}</td>
                <td>
                    <span class="badge badge-${post.status === 'published' ? 'success' : 'warning'}">
                        ${post.status || 'draft'}
                    </span>
                </td>
                <td>
                    <div class="post-actions">
                        <button class="btn btn-sm btn-outline-primary" onclick="blogAdmin.editPost('${post.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="blogAdmin.deletePost('${post.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    async handlePostSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const submitBtn = event.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        submitBtn.disabled = true;
        
        try {
            // Process image upload
            const imageFile = formData.get('image');
            let imagePath = './images/posts/placeholder.jpg';
            
            if (imageFile && imageFile.size > 0) {
                imagePath = await this.blogSystem.processImage(imageFile);
            } else if (this.currentEditingPost) {
                imagePath = this.currentEditingPost.image;
            }

            // Calculate read time
            const content = document.getElementById('postContent').innerHTML;
            const contentLength = document.getElementById('postContent').innerText.length;
            const readTime = Math.ceil(contentLength / 200) || 1;

            // Prepare post data
            const postData = {
                title: formData.get('title'),
                excerpt: formData.get('excerpt'),
                content: content,
                category: formData.get('category'),
                tags: formData.get('tags') ? formData.get('tags').split(',').map(tag => tag.trim()) : [],
                image: imagePath,
                author: formData.get('author') || 'DevPy Team',
                status: formData.get('status') || 'published',
                readTime: `${readTime} min read`
            };

            let result;
            if (this.currentEditingPost) {
                // Update existing post
                result = this.blogSystem.updatePost(this.currentEditingPost.id, postData);
                this.showMessage('Post updated successfully!', 'success');
            } else {
                // Create new post
                result = this.blogSystem.addPost(postData);
                this.showMessage('Post created successfully!', 'success');
            }

            if (result) {
                this.loadDashboardStats();
                this.renderPostsTable();
                this.closePostModal();
            }
        } catch (error) {
            console.error('Error saving post:', error);
            this.showMessage('Failed to save post: ' + error.message, 'error');
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    editPost(id) {
        const posts = this.blogSystem.getAllPosts();
        const post = posts.find(p => p.id === id);
        if (post) {
            this.openPostModal(post);
        }
    }

    deletePost(id) {
        const posts = this.blogSystem.getAllPosts();
        const post = posts.find(p => p.id === id);
        if (post) {
            if (confirm(`Are you sure you want to delete "${post.title}"?`)) {
                this.blogSystem.deletePost(id);
                this.showMessage('Post deleted successfully!', 'success');
                this.loadDashboardStats();
                this.renderPostsTable();
            }
        }
    }

    clearAllPosts() {
        if (confirm('Are you sure you want to delete ALL blog posts? This action cannot be undone.')) {
            this.blogSystem.clearAllPosts();
            this.showMessage('All posts cleared successfully!', 'success');
            this.loadDashboardStats();
            this.renderPostsTable();
        }
    }

    exportPosts() {
        this.blogSystem.exportPosts();
        this.showMessage('Posts exported successfully!', 'success');
    }

    importPosts() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const success = this.blogSystem.importPosts(e.target.result);
                        if (success) {
                            this.showMessage('Posts imported successfully!', 'success');
                            this.loadDashboardStats();
                            this.renderPostsTable();
                        } else {
                            this.showMessage('Error importing posts. Please check the file format.', 'error');
                        }
                    } catch (error) {
                        this.showMessage('Error importing posts: ' + error.message, 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    openPostModal(post = null) {
        this.currentEditingPost = post;
        const modal = document.getElementById('postModal');
        const form = document.getElementById('postForm');
        
        if (post) {
            // Edit mode
            document.getElementById('modalTitle').textContent = 'Edit Post';
            document.getElementById('postTitle').value = post.title || '';
            document.getElementById('postExcerpt').value = post.excerpt || '';
            document.getElementById('postContent').innerHTML = post.content || '';
            document.getElementById('postCategory').value = post.category || '';
            document.getElementById('postTags').value = (post.tags || []).join(', ');
            document.getElementById('postAuthor').value = post.author || '';
            document.getElementById('postStatus').value = post.status || 'draft';
        } else {
            // Create mode
            document.getElementById('modalTitle').textContent = 'Add New Post';
            form.reset();
            document.getElementById('postContent').innerHTML = '';
        }
        
        modal.classList.add('active');
    }

    closePostModal() {
        const modal = document.getElementById('postModal');
        modal.classList.remove('active');
        this.currentEditingPost = null;
    }

    setupEditor() {
        // Simple rich text editor setup
        const editor = document.getElementById('postContent');
        if (editor) {
            editor.contentEditable = true;
            editor.style.minHeight = '200px';
            editor.style.border = '1px solid #ddd';
            editor.style.padding = '10px';
            editor.style.borderRadius = '4px';
        }
    }

    handleImageUpload(e) {
        const file = e.target.files[0];
        if (file) {
            // Preview image
            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = document.getElementById('imagePreview');
                if (preview) {
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                }
            };
            reader.readAsDataURL(file);
        }
    }

    handleSearch(query) {
        // Simple search implementation
        console.log('Search:', query);
        // You can implement search filtering here
    }

    handleFilter(category) {
        // Simple filter implementation
        console.log('Filter:', category);
        // You can implement category filtering here
    }

    showMessage(text, type = 'success') {
        // Create and show message
        const message = document.createElement('div');
        message.className = `alert alert-${type}`;
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            background: ${type === 'success' ? '#28a745' : '#dc3545'};
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        message.textContent = text;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 5000);
    }

    // Helper methods
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    getCategoryColor(category) {
        const colors = {
            'web-development': 'primary',
            'ai-ml': 'success',
            'devops': 'warning',
            'database': 'info',
            'mobile': 'secondary'
        };
        return colors[category] || 'secondary';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.blogAdmin = new SimpleBlogAdmin();
});
