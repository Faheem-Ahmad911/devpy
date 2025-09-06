# GitHub API Blog Setup Guide

This guide will help you set up the GitHub API integration for your blog.

## 🚀 How It Works

1. **Admin Form** → submits to Vercel API route (`/api/create-post`)
2. **Vercel API** → creates new HTML files in your GitHub repository
3. **GitHub** → triggers automatic Vercel redeployment
4. **New Post** → goes live within 1-2 minutes

## 📋 Setup Steps

### 1. Create GitHub Personal Access Token

1. Go to [GitHub Settings > Personal Access Tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a name like "DevPy Blog API"
4. Select the **`repo`** scope (full repository access)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again!)

### 2. Configure Vercel Environment Variables

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `devpy` project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

```bash
GITHUB_TOKEN=your_github_personal_access_token_here
GITHUB_OWNER=Faheem-Ahmad911
GITHUB_REPO=devpy
```

### 3. Deploy to Vercel

1. Push your changes to GitHub:
```bash
git add .
git commit -m "Add GitHub API blog integration"
git push origin main
```

2. Vercel will automatically deploy your changes

### 4. Test the Admin Panel

1. Go to `https://yourdomain.com/blogs/admin/`
2. Log in with your admin credentials
3. Try creating a new blog post
4. Wait 1-2 minutes for GitHub Actions to deploy
5. Check that your new post appears at `https://yourdomain.com/blogs/`

## 🔧 How to Use

### Creating a New Post

1. Go to your admin panel
2. Click "Add New Post"
3. Fill in all required fields:
   - **Title**: Your blog post title
   - **Category**: Select from available categories
   - **Author**: Your name
   - **Excerpt**: Brief description (max 300 chars)
   - **Content**: Your blog post content (supports rich text)
   - **Tags**: Comma-separated tags
   - **Status**: Published or Draft

4. Click "Save Post"
5. Wait for the success message
6. Your post will be live in 1-2 minutes!

### Post URLs

New posts will be available at:
```
https://yourdomain.com/blogs/posts/post-[timestamp]-[slug].html
```

## 📁 File Structure

When you create a post, the system will:

1. **Create HTML file**: `public/blogs/posts/post-[timestamp]-[slug].html`
2. **Update index**: `public/blogs/posts/index.json` (adds your post to the list)
3. **Trigger deployment**: GitHub webhook tells Vercel to redeploy

## ⚠️ Important Notes

### Limitations
- **No post editing**: Currently, you can only create new posts (editing requires additional API endpoints)
- **No image upload**: Uses placeholder images (you can manually upload images to GitHub)
- **No post deletion**: Must be done manually through GitHub

### Rate Limits
- GitHub API: 5,000 requests/hour
- Vercel functions: 100GB-hours/month (free tier)

### Delays
- **Post creation**: ~30-60 seconds for GitHub commit
- **Live deployment**: Additional 30-60 seconds for Vercel deployment
- **Total time**: ~1-2 minutes from "Save" to live

## 🛠️ Troubleshooting

### "GitHub token not configured"
- Check that `GITHUB_TOKEN` is set in Vercel environment variables
- Ensure the token has `repo` permissions

### "Failed to create post in GitHub repository"
- Verify `GITHUB_OWNER` and `GITHUB_REPO` are correct
- Check that the token has write access to your repository

### Posts not appearing
- Wait 2-3 minutes for deployment
- Check Vercel deployment logs
- Verify the posts index.json file was updated

### Admin panel not working
- Clear browser cache
- Check browser console for JavaScript errors
- Ensure you're using the correct admin credentials

## 🔄 Backup & Recovery

Your blog posts are stored in:
1. **GitHub repository** (main source)
2. **Vercel deployment** (live site)

To backup:
```bash
git clone https://github.com/Faheem-Ahmad911/devpy.git
```

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Review Vercel deployment logs
3. Verify GitHub repository permissions
4. Test with a simple post first

## 🎯 Next Steps

Once working, you can:
1. **Add image upload** (using GitHub or Cloudinary)
2. **Implement post editing** (additional API endpoints)
3. **Add post deletion** (with confirmation)
4. **Add categories management**
5. **Implement user authentication**
