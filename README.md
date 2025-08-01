# DevPy - Premium Tech Solutions Website

A modern, responsive website for DevPy showcasing premium technology solutions and development services.

## 🌟 Features

- **Modern Design**: Glassmorphism effects, smooth animations, and contemporary UI
- **Responsive**: Fully responsive design that works on all devices
- **Interactive**: Smooth page transitions, animated counters, and hover effects
- **Performance**: Optimized loading, lazy loading, and efficient animations
- **Accessibility**: Keyboard navigation support and proper ARIA labels
- **SEO Optimized**: Meta tags, structured data, and semantic HTML

## 🚀 Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Animations**: AOS (Animate On Scroll) library
- **Icons**: Font Awesome 6
- **Fonts**: Google Fonts (Outfit)
- **Deployment**: Vercel

## 📁 Project Structure

```
devpy-website/
├── index.html          # Main HTML file
├── public/
│   └── logo.png        # DevPy logo
├── package.json        # Node.js dependencies
├── vercel.json         # Vercel configuration
└── README.md          # This file
```

## 🛠️ Local Development

1. Clone the repository
2. Open `index.html` in your browser or use a local server
3. For Vercel development server:
   ```bash
   npm install -g vercel
   vercel dev
   ```

## 🌐 Deployment on Vercel

### Method 1: GitHub Integration (Recommended)

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Sign up/login with your GitHub account
4. Click "New Project"
5. Import your repository
6. Vercel will automatically detect it's a static site
7. Deploy!

### Method 2: Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy from your project directory:
   ```bash
   vercel
   ```

4. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Choose your account
   - Link to existing project? **N**
   - Project name: **devpy-website**
   - Directory: **./** (current directory)

### Method 3: Drag & Drop

1. Go to [vercel.com](https://vercel.com)
2. Sign up/login
3. Drag and drop your project folder to the deployment area
4. Vercel will automatically deploy your site

## 📝 File Setup Instructions

1. **Create the project structure:**
   ```
   devpy-website/
   ├── index.html
   ├── public/
   │   └── logo.png
   ├── package.json
   ├── vercel.json
   └── README.md
   ```

2. **Copy your existing `index.html` file** (rename from `index..html`)

3. **Create the `public` folder** and add your `logo.png` file

4. **Add the configuration files** (package.json and vercel.json)

## 🎨 Customization

- **Colors**: Update CSS custom properties in the `:root` section
- **Content**: Modify the HTML content in each page section
- **Logo**: Replace `public/logo.png` with your logo
- **Contact Info**: Update contact details in the contact section

## 📊 Performance Features

- **Lazy Loading**: Images and content load as needed
- **Optimized Animations**: GPU-accelerated CSS animations
- **Minified Assets**: CDN-delivered external libraries
- **Caching**: Proper cache headers for static assets
- **Service Worker**: PWA capabilities for offline support

## 🔧 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🚀 Deployment Checklist

- [ ] All files are in the correct structure
- [ ] Logo file is in `public/logo.png`
- [ ] HTML file is renamed to `index.html`
- [ ] Configuration files are added
- [ ] Test locally before deployment
- [ ] Deploy to Vercel
- [ ] Test deployed version
- [ ] Set up custom domain (optional)

## 📞 Support

For any issues or questions regarding deployment, please refer to:
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Issues](if you have a GitHub repo)

---

Built with ❤️ by the DevPy Team