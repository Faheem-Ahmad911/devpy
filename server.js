const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use(express.static('public'));

// Ensure posts directory exists
const POSTS_DIR = path.join(__dirname, 'public', 'blogs', 'posts');
const IMAGES_DIR = path.join(__dirname, 'public', 'blogs', 'images', 'post-images');

fs.ensureDirSync(POSTS_DIR);
fs.ensureDirSync(IMAGES_DIR);

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, IMAGES_DIR);
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const extension = path.extname(file.originalname);
        const filename = `post-${timestamp}${extension}`;
        cb(null, filename);
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// Helper function to get all blog posts
async function getAllPosts() {
    try {
        const postsIndex = path.join(POSTS_DIR, 'index.json');
        
        if (await fs.pathExists(postsIndex)) {
            const indexData = await fs.readJson(postsIndex);
            return indexData.posts || [];
        }
        
        return [];
    } catch (error) {
        console.error('Error reading posts index:', error);
        return [];
    }
}

// Helper function to save posts index
async function savePostsIndex(posts) {
    try {
        const postsIndex = path.join(POSTS_DIR, 'index.json');
        await fs.writeJson(postsIndex, { 
            posts: posts,
            lastUpdated: new Date().toISOString()
        }, { spaces: 2 });
        return true;
    } catch (error) {
        console.error('Error saving posts index:', error);
        return false;
    }
}

// API Routes

// Admin authentication
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    
    // Simple hardcoded authentication (in production, use proper auth)
    if (username === 'DEVPY TEAM' && password === 'puh17109') {
        res.json({ 
            success: true, 
            token: 'admin-authenticated', // In production, use JWT
            username: username 
        });
    } else {
        res.status(401).json({ 
            success: false, 
            message: 'Invalid credentials' 
        });
    }
});

// Get all blog posts (public)
app.get('/api/posts', async (req, res) => {
    try {
        const posts = await getAllPosts();
        const publishedPosts = posts.filter(post => post.status === 'published');
        
        res.json({
            success: true,
            posts: publishedPosts
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch posts'
        });
    }
});

// Get all posts for admin (including drafts)
app.get('/api/admin/posts', async (req, res) => {
    try {
        const posts = await getAllPosts();
        res.json({
            success: true,
            posts: posts
        });
    } catch (error) {
        console.error('Error fetching admin posts:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch posts'
        });
    }
});

// Create new blog post
app.post('/api/admin/posts', upload.single('image'), async (req, res) => {
    try {
        const {
            title,
            excerpt,
            content,
            category,
            tags,
            status,
            author,
            readTime
        } = req.body;

        // Generate unique ID
        const postId = uuidv4();
        const timestamp = new Date().toISOString();
        
        // Handle image upload
        let imagePath = './images/posts/placeholder.jpg'; // default
        if (req.file) {
            imagePath = `./images/post-images/${req.file.filename}`;
        }

        // Create post object
        const newPost = {
            id: postId,
            title: title,
            excerpt: excerpt,
            content: content,
            category: category,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            image: imagePath,
            author: author || 'DevPy Team',
            publishDate: timestamp,
            lastModified: timestamp,
            status: status || 'published',
            views: 0,
            readTime: readTime || '5 min read'
        };

        // Get existing posts
        const posts = await getAllPosts();
        
        // Add new post
        posts.unshift(newPost); // Add to beginning
        
        // Save posts index
        await savePostsIndex(posts);
        
        // Save individual post file
        const postFile = path.join(POSTS_DIR, `${postId}.json`);
        await fs.writeJson(postFile, newPost, { spaces: 2 });

        res.json({
            success: true,
            post: newPost,
            message: 'Post created successfully'
        });

    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create post'
        });
    }
});

// Update blog post
app.put('/api/admin/posts/:id', upload.single('image'), async (req, res) => {
    try {
        const postId = req.params.id;
        const posts = await getAllPosts();
        const postIndex = posts.findIndex(post => post.id === postId);
        
        if (postIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        const {
            title,
            excerpt,
            content,
            category,
            tags,
            status,
            author,
            readTime
        } = req.body;

        // Handle image upload
        let imagePath = posts[postIndex].image; // keep existing
        if (req.file) {
            imagePath = `./images/post-images/${req.file.filename}`;
        }

        // Update post
        const updatedPost = {
            ...posts[postIndex],
            title: title,
            excerpt: excerpt,
            content: content,
            category: category,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            image: imagePath,
            author: author || posts[postIndex].author,
            lastModified: new Date().toISOString(),
            status: status || posts[postIndex].status,
            readTime: readTime || posts[postIndex].readTime
        };

        posts[postIndex] = updatedPost;
        
        // Save posts index
        await savePostsIndex(posts);
        
        // Save individual post file
        const postFile = path.join(POSTS_DIR, `${postId}.json`);
        await fs.writeJson(postFile, updatedPost, { spaces: 2 });

        res.json({
            success: true,
            post: updatedPost,
            message: 'Post updated successfully'
        });

    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update post'
        });
    }
});

// Delete blog post
app.delete('/api/admin/posts/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const posts = await getAllPosts();
        const postIndex = posts.findIndex(post => post.id === postId);
        
        if (postIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Remove from posts array
        posts.splice(postIndex, 1);
        
        // Save updated posts index
        await savePostsIndex(posts);
        
        // Delete individual post file
        const postFile = path.join(POSTS_DIR, `${postId}.json`);
        if (await fs.pathExists(postFile)) {
            await fs.remove(postFile);
        }

        res.json({
            success: true,
            message: 'Post deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete post'
        });
    }
});

// Get single post by ID
app.get('/api/posts/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const postFile = path.join(POSTS_DIR, `${postId}.json`);
        
        if (await fs.pathExists(postFile)) {
            const post = await fs.readJson(postFile);
            
            // Increment view count
            post.views = (post.views || 0) + 1;
            await fs.writeJson(postFile, post, { spaces: 2 });
            
            // Update in index as well
            const posts = await getAllPosts();
            const postIndex = posts.findIndex(p => p.id === postId);
            if (postIndex !== -1) {
                posts[postIndex].views = post.views;
                await savePostsIndex(posts);
            }
            
            res.json({
                success: true,
                post: post
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch post'
        });
    }
});

// Clear all posts (admin only)
app.delete('/api/admin/posts', async (req, res) => {
    try {
        // Clear posts index
        await savePostsIndex([]);
        
        // Remove all individual post files
        const files = await fs.readdir(POSTS_DIR);
        for (const file of files) {
            if (file.endsWith('.json') && file !== 'index.json') {
                await fs.remove(path.join(POSTS_DIR, file));
            }
        }

        res.json({
            success: true,
            message: 'All posts cleared successfully'
        });

    } catch (error) {
        console.error('Error clearing posts:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to clear posts'
        });
    }
});

// Catch-all handler for SPA routes
app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    
    // Handle blog routes
    if (req.path.startsWith('/blogs') || req.path === '/blog') {
        return res.sendFile(path.join(__dirname, 'public', 'blogs', 'index.html'));
    }
    
    // Default to main index
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        return res.status(400).json({
            success: false,
            message: 'File upload error: ' + error.message
        });
    }
    
    console.error('Server error:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`DevPy Blog Server running on port ${PORT}`);
    console.log(`Blog available at: http://localhost:${PORT}/blogs`);
    console.log(`Admin panel at: http://localhost:${PORT}/blogs/admin`);
});

module.exports = app;
