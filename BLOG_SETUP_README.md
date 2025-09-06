# DevPy Blog System - Setup Guide

## Problem Solved
The previous blog system stored data in `localStorage`, which meant:
- Blogs were only visible to the person who created them
- Data didn't persist across deployments or different devices
- No real persistence for production use

## New Solution
This upgrade implements a **Node.js backend with file-based storage** that:
- ✅ Stores blogs as JSON files on the server
- ✅ Makes blogs visible to all users after deployment
- ✅ Persists data across deployments
- ✅ Works with Vercel hosting

## Setup Instructions

### 1. Install Node.js
Download and install Node.js from: https://nodejs.org/
(Choose the LTS version)

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Locally
```bash
# Development mode (with auto-restart)
npm run dev

# Or production mode
npm start
```

### 4. Access the Blog
- Main blog: http://localhost:3000/blogs
- Admin panel: http://localhost:3000/blogs/admin

### 5. Admin Credentials
- Username: `DEVPY TEAM`
- Password: `puh17109`

## Deployment to Vercel

### Option 1: Automatic Deployment
1. Push code to GitHub
2. Connect your GitHub repo to Vercel
3. Vercel will automatically deploy with the backend

### Option 2: Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## How It Works

### Backend API Endpoints:
- `GET /api/posts` - Get all published posts (public)
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/posts` - Get all posts (admin only)
- `POST /api/admin/posts` - Create new post
- `PUT /api/admin/posts/:id` - Update post
- `DELETE /api/admin/posts/:id` - Delete post
- `DELETE /api/admin/posts` - Clear all posts

### File Storage:
- Posts stored in: `public/blogs/posts/`
- Images stored in: `public/blogs/images/post-images/`
- Index file: `public/blogs/posts/index.json`

### Frontend Updates:
- Admin panel now uses API calls instead of localStorage
- Blog page loads posts from API with localStorage fallback
- Image uploads handled via multipart forms
- Proper error handling and loading states

## File Structure
```
devpy/
├── server.js                 # Node.js backend server
├── package.json             # Dependencies
├── vercel.json              # Deployment config
└── public/
    └── blogs/
        ├── admin/
        │   ├── admin.js     # Updated admin panel
        │   └── ...
        ├── scripts/
        │   ├── blog.js      # Updated blog frontend
        │   └── ...
        ├── posts/           # Blog storage directory
        │   └── index.json   # Posts index
        └── images/
            └── post-images/ # Uploaded images
```

## Benefits
1. **Real Persistence**: Blogs are saved as files on the server
2. **Multi-User**: All users see the same blogs
3. **Deployment Ready**: Works with Vercel and other platforms
4. **Image Upload**: Proper image handling with file storage
5. **API-Driven**: Modern REST API architecture
6. **Backward Compatible**: Falls back to localStorage if API fails

## Troubleshooting

### If blogs don't appear:
1. Check browser console for API errors
2. Verify server is running on correct port
3. Check `public/blogs/posts/index.json` exists

### If images don't upload:
1. Check `public/blogs/images/post-images/` directory exists
2. Verify file size is under 5MB
3. Ensure image format is supported (jpg, png, gif, webp)

### If deployment fails:
1. Check all dependencies are in `package.json`
2. Verify `vercel.json` configuration
3. Ensure Node.js version compatibility

## Next Steps
After successful deployment, your blog system will:
- Store all posts persistently
- Show blogs to all users
- Handle image uploads properly
- Work across all devices and browsers
