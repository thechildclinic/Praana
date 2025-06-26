# Prana.ai - Netlify Deployment Guide

## 🚀 Quick Deployment Checklist

### Prerequisites
- [ ] Node.js 18+ installed locally (for testing)
- [ ] Git repository set up
- [ ] Netlify account created
- [ ] Audio files prepared (see Audio Assets section)

### Pre-Deployment Steps
1. [ ] Add required audio files to `assets/audio/` directory
2. [ ] Test build locally: `npm install && npm run build`
3. [ ] Commit all changes to your Git repository
4. [ ] Push to your Git hosting service (GitHub, GitLab, etc.)

## 📁 Required Audio Assets

Before deployment, you MUST add these audio files to the `assets/audio/` directory:

- `calming-yoga-music.mp3` - Background meditation music (loopable, 3-5 minutes)
- `breath-inhale.mp3` - Inhale sound effect (1-3 seconds)
- `breath-exhale.mp3` - Exhale sound effect (1-3 seconds)

**Format Requirements:**
- File format: MP3
- Quality: 128kbps or higher recommended
- Background music should be seamlessly loopable

## 🌐 Netlify Deployment Steps

### Method 1: Automated Script (Easiest)

Use the provided deployment script:

```bash
# Make script executable (if not already)
chmod +x deploy.sh

# Run the deployment script
./deploy.sh
```

The script will:
- Install dependencies
- Build the project
- Install Netlify CLI if needed
- Deploy to Netlify
- Provide the live URL

### Method 2: Git Integration (Recommended for Continuous Deployment)

1. **Connect Repository**
   - Log into [Netlify Dashboard](https://app.netlify.com)
   - Click "New site from Git"
   - Choose GitHub
   - Select the repository: `thechildclinic/Praana`

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18` (set in Environment variables)

3. **Set Environment Variables**
   - Go to Site settings → Environment variables
   - Add: `GEMINI_API_KEY` = `your_gemini_api_key_here`
   - Add: `NODE_VERSION` = `18`

4. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete

### Method 3: Netlify CLI (Manual)

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Build the project
npm install
npm run build

# Deploy (draft first)
netlify deploy --dir=dist

# Deploy to production
netlify deploy --prod --dir=dist
```

### Method 4: Manual Deploy

1. **Build Locally**
   ```bash
   npm install
   npm run build
   ```

2. **Deploy dist folder**
   - Drag and drop the `dist` folder to Netlify dashboard
   - Or zip the `dist` folder and upload

## 🔧 Configuration Files

The following configuration files have been created for optimal deployment:

### `netlify.toml`
- Build configuration
- SPA routing setup
- Security headers
- Caching rules

### `.env.example`
- Environment variable template
- Copy to `.env` for local development

### `index.css`
- Additional styles for the application
- Accessibility and animation utilities

## 🔐 Environment Variables

### Required Variables
- `GEMINI_API_KEY`: Google Gemini API key (for future premium features)

### Setting in Netlify
1. Go to Site settings → Environment variables
2. Click "Add variable"
3. Name: `GEMINI_API_KEY`
4. Value: Your actual API key
5. Click "Create variable"

**Note**: The Gemini API integration is currently conceptual and planned for future premium features.

## 🧪 Testing Your Deployment

### Local Testing
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Post-Deployment Testing
1. [ ] Site loads without errors
2. [ ] Audio files load correctly (check browser console)
3. [ ] Voice recognition works (requires HTTPS)
4. [ ] Theme switching functions
5. [ ] Responsive design on mobile devices
6. [ ] All interactive elements work

## 🔍 Troubleshooting

### Common Issues

**Build Fails**
- Ensure Node.js 18+ is specified in environment variables
- Check that all dependencies are in package.json
- Verify no TypeScript errors

**Audio Files Not Loading**
- Confirm files are in `assets/audio/` directory
- Check file names match exactly: `calming-yoga-music.mp3`, `breath-inhale.mp3`, `breath-exhale.mp3`
- Verify file formats are MP3

**Voice Recognition Not Working**
- Ensure site is served over HTTPS (Netlify provides this automatically)
- Check browser permissions for microphone access
- Test in Chrome/Edge (best Web Speech API support)

**Environment Variables Not Working**
- Verify variables are set in Netlify dashboard
- Check variable names match exactly
- Redeploy after adding variables

### Performance Optimization

The deployment is configured with:
- Static asset caching (1 year)
- Audio file caching
- Gzip compression
- CDN distribution via Netlify

## 📱 Browser Compatibility

**Fully Supported:**
- Chrome 80+
- Edge 80+
- Safari 14+
- Firefox 80+

**Limited Support:**
- Older browsers may have issues with Web Speech API
- Voice recognition requires modern browser

## 🔄 Continuous Deployment

Once connected to Git:
- Automatic deployments on push to main branch
- Preview deployments for pull requests
- Build logs available in Netlify dashboard

## 📞 Support

For deployment issues:
1. Check Netlify build logs
2. Review browser console for errors
3. Verify all required files are present
4. Test locally first with `npm run build`

---

**Ready to deploy?** Follow the checklist above and your Prana.ai application will be live on Netlify! 🧘‍♀️
