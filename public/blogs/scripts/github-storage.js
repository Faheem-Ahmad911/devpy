// GitHub-based Blog Storage System
// This system uses GitHub API to store blogs as files in your repository
// No database or backend server required!

class GitHubBlogStorage {
    constructor() {
        this.owner = 'Faheem-Ahmad911'; // Your GitHub username
        this.repo = 'devpy'; // Your repository name
        this.branch = 'main'; // Branch to store posts
        this.postsPath = 'public/blogs/data'; // Path in repo to store posts
        this.baseUrl = 'https://api.github.com';
        
        // GitHub token (you'll need to create this)
        this.token = localStorage.getItem('github_token') || null;
    }

    // Set GitHub token (admin only)
    setGitHubToken(token) {
        this.token = token;
        localStorage.setItem('github_token', token);
    }

    // Get headers for GitHub API
    getHeaders() {
        const headers = {
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        };
        
        if (this.token) {
            headers['Authorization'] = `token ${this.token}`;
        }
        
        return headers;
    }

    // Get all blog posts from GitHub
    async getPosts() {
        try {
            const url = `${this.baseUrl}/repos/${this.owner}/${this.repo}/contents/${this.postsPath}/posts.json`;
            const response = await fetch(url, {
                headers: this.getHeaders()
            });

            if (response.ok) {
                const data = await response.json();
                const content = atob(data.content);
                const posts = JSON.parse(content);
                return posts.filter(post => post.status === 'published');
            } else if (response.status === 404) {
                // File doesn't exist yet, return empty array
                return [];
            } else {
                throw new Error(`GitHub API error: ${response.status}`);
            }
        } catch (error) {
            console.error('Error loading posts from GitHub:', error);
            
            // Fallback to localStorage
            const localPosts = localStorage.getItem('devpy_blog_posts');
            if (localPosts) {
                const posts = JSON.parse(localPosts);
                return posts.filter(post => post.status === 'published');
            }
            
            return [];
        }
    }

    // Save posts to GitHub
    async savePosts(posts) {
        if (!this.token) {
            throw new Error('GitHub token required for saving posts');
        }

        try {
            const url = `${this.baseUrl}/repos/${this.owner}/${this.repo}/contents/${this.postsPath}/posts.json`;
            
            // Get current file SHA if it exists
            let sha = null;
            try {
                const currentFile = await fetch(url, {
                    headers: this.getHeaders()
                });
                if (currentFile.ok) {
                    const currentData = await currentFile.json();
                    sha = currentData.sha;
                }
            } catch (e) {
                // File doesn't exist, that's okay
            }

            // Prepare the content
            const content = btoa(JSON.stringify(posts, null, 2));
            
            const payload = {
                message: `Update blog posts - ${new Date().toISOString()}`,
                content: content,
                branch: this.branch
            };
            
            if (sha) {
                payload.sha = sha;
            }

            const response = await fetch(url, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Failed to save to GitHub: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error saving posts to GitHub:', error);
            
            // Fallback to localStorage
            localStorage.setItem('devpy_blog_posts', JSON.stringify(posts));
            throw error;
        }
    }

    // Upload image to GitHub
    async uploadImage(imageFile) {
        if (!this.token) {
            throw new Error('GitHub token required for image upload');
        }

        try {
            const timestamp = Date.now();
            const extension = imageFile.name.split('.').pop();
            const fileName = `post-${timestamp}.${extension}`;
            const imagePath = `public/blogs/images/post-images/${fileName}`;

            // Convert image to base64
            const arrayBuffer = await imageFile.arrayBuffer();
            const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

            const url = `${this.baseUrl}/repos/${this.owner}/${this.repo}/contents/${imagePath}`;
            
            const payload = {
                message: `Upload image: ${fileName}`,
                content: base64,
                branch: this.branch
            };

            const response = await fetch(url, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Failed to upload image: ${response.status}`);
            }

            return `./images/post-images/${fileName}`;
        } catch (error) {
            console.error('Error uploading image to GitHub:', error);
            
            // Fallback to base64 storage in localStorage
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const timestamp = Date.now();
                    const fileName = `post-${timestamp}.jpg`;
                    localStorage.setItem(`blog_image_${fileName}`, e.target.result);
                    resolve(`./images/post-images/${fileName}`);
                };
                reader.readAsDataURL(imageFile);
            });
        }
    }
}

// Export for use in other files
window.GitHubBlogStorage = GitHubBlogStorage;
