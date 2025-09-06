export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { title, category, author, excerpt, content, tags, status, image } = req.body;

    // Validate required fields
    if (!title || !category || !author || !excerpt || !content) {
      return res.status(400).json({ 
        error: 'Missing required fields: title, category, author, excerpt, content' 
      });
    }

    // GitHub API configuration
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_OWNER = process.env.GITHUB_OWNER || 'Faheem-Ahmad911';
    const GITHUB_REPO = process.env.GITHUB_REPO || 'devpy';

    if (!GITHUB_TOKEN) {
      return res.status(500).json({ error: 'GitHub token not configured' });
    }

    // Generate unique post ID and filename
    const postId = `post-${Date.now()}`;
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
    
    const fileName = `${postId}-${slug}.html`;
    const filePath = `public/blogs/posts/${fileName}`;

    // Create the blog post HTML content
    const postHtml = generateBlogPostHtml({
      id: postId,
      title,
      category,
      author,
      excerpt,
      content,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      status: status || 'published',
      image: image || '../images/posts/placeholder.jpg',
      date: new Date().toISOString(),
      slug
    });

    // Create file in GitHub repository
    const githubResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
          message: `Add new blog post: ${title}`,
          content: Buffer.from(postHtml).toString('base64'),
          branch: 'main'
        })
      }
    );

    if (!githubResponse.ok) {
      const errorData = await githubResponse.json();
      console.error('GitHub API error:', errorData);
      return res.status(500).json({ 
        error: 'Failed to create post in GitHub repository',
        details: errorData.message 
      });
    }

    // Update the posts index file
    await updatePostsIndex({
      id: postId,
      title,
      category,
      author,
      excerpt,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      status: status || 'published',
      image: image || '../images/posts/placeholder.jpg',
      date: new Date().toISOString(),
      slug,
      fileName
    }, GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO);

    res.status(201).json({ 
      success: true, 
      message: 'Blog post created successfully',
      postId,
      fileName,
      url: `/blogs/posts/${fileName}`
    });

  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
}

function generateBlogPostHtml(post) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${post.title} - DevPy Blog</title>
    
    <!-- SEO Meta Tags -->
    <meta name="description" content="${post.excerpt}">
    <meta name="keywords" content="${post.tags.join(', ')}">
    <meta name="author" content="${post.author}">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="${post.title}">
    <meta property="og:description" content="${post.excerpt}">
    <meta property="og:image" content="${post.image}">
    <meta property="og:type" content="article">
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${post.title}">
    <meta name="twitter:description" content="${post.excerpt}">
    <meta name="twitter:image" content="${post.image}">
    
    <!-- Favicons -->
    <link rel="icon" href="../../favicon.ico" type="image/x-icon">
    <link rel="icon" type="image/png" sizes="32x32" href="../../favicon-32x32.png">
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Styles -->
    <link rel="stylesheet" href="../styles/blog.css">
    <link rel="stylesheet" href="../styles/post.css">
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "${post.title}",
      "description": "${post.excerpt}",
      "image": "${post.image}",
      "author": {
        "@type": "Person",
        "name": "${post.author}"
      },
      "datePublished": "${post.date}",
      "dateModified": "${post.date}",
      "publisher": {
        "@type": "Organization",
        "name": "DevPy",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.devpy.tech/logo.png"
        }
      }
    }
    </script>
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-logo">
                <a href="../../index.html">
                    <img src="../../logo.png" alt="DevPy Logo" width="40" height="40">
                    <span>DevPy</span>
                </a>
            </div>
            <div class="nav-links">
                <a href="../../index.html">Home</a>
                <a href="../../services.html">Services</a>
                <a href="../index.html" class="active">Blog</a>
                <a href="../../about.html">About</a>
                <a href="../../contact.html">Contact</a>
            </div>
            <div class="nav-toggle" id="navToggle">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </nav>

    <!-- Post Header -->
    <header class="post-header">
        <div class="container">
            <div class="post-meta">
                <span class="category ${post.category}">${getCategoryName(post.category)}</span>
                <span class="date">${formatDate(post.date)}</span>
            </div>
            <h1 class="post-title">${post.title}</h1>
            <div class="post-excerpt">${post.excerpt}</div>
            <div class="post-author">
                <img src="../images/authors/default.jpg" alt="${post.author}" class="author-avatar">
                <div class="author-info">
                    <span class="author-name">By ${post.author}</span>
                    <span class="reading-time">${calculateReadingTime(post.content)} min read</span>
                </div>
            </div>
        </div>
    </header>

    <!-- Post Content -->
    <main class="post-main">
        <div class="container">
            <article class="post-content">
                <div class="post-image">
                    <img src="${post.image}" alt="${post.title}" loading="lazy">
                </div>
                
                <div class="post-body">
                    ${post.content}
                </div>

                <!-- Post Tags -->
                ${post.tags.length > 0 ? `
                <div class="post-tags">
                    <h4>Tags:</h4>
                    <div class="tags-list">
                        ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
                ` : ''}

                <!-- Share Buttons -->
                <div class="post-share">
                    <h4>Share this post:</h4>
                    <div class="share-buttons">
                        <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}" target="_blank" class="share-btn twitter">
                            <i class="fab fa-twitter"></i>
                        </a>
                        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}" target="_blank" class="share-btn facebook">
                            <i class="fab fa-facebook-f"></i>
                        </a>
                        <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}" target="_blank" class="share-btn linkedin">
                            <i class="fab fa-linkedin-in"></i>
                        </a>
                        <button onclick="copyToClipboard()" class="share-btn copy">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                </div>
            </article>

            <!-- Navigation -->
            <div class="post-navigation">
                <a href="../index.html" class="nav-btn back">
                    <i class="fas fa-arrow-left"></i>
                    Back to Blog
                </a>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-logo">
                    <img src="../../logo.png" alt="DevPy Logo" width="40" height="40">
                    <span>DevPy</span>
                </div>
                <p>&copy; 2024 DevPy. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script>
        // Copy to clipboard functionality
        function copyToClipboard() {
            navigator.clipboard.writeText(window.location.href).then(() => {
                const btn = document.querySelector('.share-btn.copy');
                const originalIcon = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    btn.innerHTML = originalIcon;
                }, 2000);
            });
        }

        // Mobile navigation toggle
        document.getElementById('navToggle').addEventListener('click', function() {
            document.querySelector('.navbar').classList.toggle('active');
        });
    </script>
</body>
</html>`;
}

function getCategoryName(category) {
  const categories = {
    'web-development': 'Web Development',
    'ai-ml': 'AI & Machine Learning',
    'cloud-devops': 'Cloud & DevOps',
    'database': 'Database',
    'case-study': 'Case Studies'
  };
  return categories[category] || category;
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function calculateReadingTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

async function updatePostsIndex(post, githubToken, githubOwner, githubRepo) {
  try {
    // Get current posts index
    const indexResponse = await fetch(
      `https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/public/blogs/posts/index.json`,
      {
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    let postsData = { posts: [], lastUpdated: new Date().toISOString() };
    let sha = null;

    if (indexResponse.ok) {
      const indexData = await indexResponse.json();
      sha = indexData.sha;
      const content = Buffer.from(indexData.content, 'base64').toString();
      postsData = JSON.parse(content);
    }

    // Add new post to the beginning of the array
    postsData.posts.unshift({
      id: post.id,
      title: post.title,
      category: post.category,
      author: post.author,
      excerpt: post.excerpt,
      image: post.image,
      date: post.date,
      slug: post.slug,
      fileName: post.fileName,
      tags: post.tags,
      status: post.status
    });

    postsData.lastUpdated = new Date().toISOString();

    // Update the index file
    const updateResponse = await fetch(
      `https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/public/blogs/posts/index.json`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
          message: `Update posts index for: ${post.title}`,
          content: Buffer.from(JSON.stringify(postsData, null, 2)).toString('base64'),
          sha: sha,
          branch: 'main'
        })
      }
    );

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      console.error('Failed to update posts index:', errorData);
    }

  } catch (error) {
    console.error('Error updating posts index:', error);
  }
}
