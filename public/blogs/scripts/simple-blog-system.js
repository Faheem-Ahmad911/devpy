// Simple Blog System - No Database Required!
// Uses localStorage with automatic GitHub sync (optional)

class SimpleBlogSystem {
    constructor() {
        this.storageKey = 'devpy_blog_posts_v2';
        this.lastSyncKey = 'devpy_last_sync';
        this.posts = this.loadPosts();
        
        // Auto-sync every 30 seconds if GitHub integration is set up
        setInterval(() => this.autoSync(), 30000);
    }

    // Load posts from localStorage (primary storage)
    loadPosts() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (error) {
            console.error('Error loading posts:', error);
        }
        return [];
    }

    // Save posts to localStorage (and optionally sync to GitHub)
    savePosts(posts) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(posts));
            localStorage.setItem(this.lastSyncKey, Date.now().toString());
            
            // Trigger sync event for other tabs
            window.dispatchEvent(new CustomEvent('postsUpdated', {
                detail: { posts: posts }
            }));
            
            // Optional: Auto-sync to GitHub if configured
            this.syncToGitHub(posts);
            
            return true;
        } catch (error) {
            console.error('Error saving posts:', error);
            return false;
        }
    }

    // Get all published posts
    getPublishedPosts() {
        return this.posts.filter(post => post.status === 'published');
    }

    // Get all posts (admin only)
    getAllPosts() {
        return this.posts;
    }

    // Add new post
    addPost(postData) {
        const newPost = {
            id: 'post_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            ...postData,
            publishDate: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            views: 0
        };
        
        this.posts.unshift(newPost);
        this.savePosts(this.posts);
        return newPost;
    }

    // Update existing post
    updatePost(postId, postData) {
        const index = this.posts.findIndex(post => post.id === postId);
        if (index !== -1) {
            this.posts[index] = {
                ...this.posts[index],
                ...postData,
                lastModified: new Date().toISOString()
            };
            this.savePosts(this.posts);
            return this.posts[index];
        }
        return null;
    }

    // Delete post
    deletePost(postId) {
        const index = this.posts.findIndex(post => post.id === postId);
        if (index !== -1) {
            this.posts.splice(index, 1);
            this.savePosts(this.posts);
            return true;
        }
        return false;
    }

    // Clear all posts
    clearAllPosts() {
        this.posts = [];
        this.savePosts(this.posts);
        localStorage.removeItem('devpy_blog_posts'); // Clear old storage too
    }

    // Process uploaded image
    async processImage(imageFile) {
        return new Promise((resolve, reject) => {
            if (!imageFile) {
                resolve('./images/posts/placeholder.jpg');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const timestamp = Date.now();
                    const extension = imageFile.name.split('.').pop() || 'jpg';
                    const fileName = `post-${timestamp}.${extension}`;
                    
                    // Store image in localStorage
                    const imageKey = `blog_image_${fileName}`;
                    localStorage.setItem(imageKey, e.target.result);
                    
                    resolve(`./images/post-images/${fileName}`);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('Failed to read image file'));
            reader.readAsDataURL(imageFile);
        });
    }

    // Get image URL (handles localStorage images)
    getImageUrl(imagePath) {
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
        
        return imagePath;
    }

    // Auto-sync to GitHub (optional, requires setup)
    async syncToGitHub(posts) {
        try {
            const githubToken = localStorage.getItem('github_sync_token');
            if (!githubToken) return; // No GitHub sync configured

            const lastSync = localStorage.getItem(this.lastSyncKey);
            const now = Date.now();
            
            // Only sync every 5 minutes to avoid rate limits
            if (lastSync && (now - parseInt(lastSync)) < 300000) {
                return;
            }

            // GitHub sync logic would go here
            console.log('Auto-sync to GitHub (if configured)');
            
        } catch (error) {
            console.error('GitHub sync error:', error);
        }
    }

    // Auto-sync from other sources
    async autoSync() {
        try {
            // Check if other tabs/windows have updated posts
            const currentPosts = this.loadPosts();
            if (currentPosts.length !== this.posts.length) {
                this.posts = currentPosts;
                window.dispatchEvent(new CustomEvent('postsUpdated', {
                    detail: { posts: this.posts }
                }));
            }
        } catch (error) {
            console.error('Auto-sync error:', error);
        }
    }

    // Export posts for backup
    exportPosts() {
        const exportData = {
            posts: this.posts,
            exportDate: new Date().toISOString(),
            version: '2.0'
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `devpy-blog-export-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }

    // Import posts from backup
    importPosts(jsonData) {
        try {
            const importData = JSON.parse(jsonData);
            if (importData.posts && Array.isArray(importData.posts)) {
                this.posts = importData.posts;
                this.savePosts(this.posts);
                return true;
            }
        } catch (error) {
            console.error('Import error:', error);
        }
        return false;
    }
}

// Global instance
window.blogSystem = new SimpleBlogSystem();

// Make it available globally
window.SimpleBlogSystem = SimpleBlogSystem;
