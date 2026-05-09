# Deploy to Vercel

This guide will help you deploy your AI Resumer application to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub/GitLab/Bitbucket**: Your code should be in a Git repository
3. **Environment Variables**: Have your Puter.com credentials ready

## Quick Deploy (Recommended)

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy from your project directory
```bash
cd ai-resumer
vercel
```

Follow the prompts:
- Link to existing Vercel project or create new one
- Confirm settings (build command, output directory)
- Add environment variables when prompted

### 4. Add Environment Variables
In the Vercel dashboard or during setup, add these environment variables:

```
PUTER_HOSTNAME=your-puter-hostname
PUTER_API_KEY=your-puter-api-key
```

### 5. Deploy to Production
```bash
vercel --prod
```

## Manual Deploy via Vercel Dashboard

### 1. Push your code to GitHub/GitLab
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. Import Project in Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your Git repository
4. Vercel will auto-detect the framework (Vite/React)

### 3. Configure Build Settings
Vercel will automatically use the `vercel.json` configuration:
- **Build Command**: `npm run build`
- **Output Directory**: `build/client`
- **Install Command**: `npm install`

### 4. Add Environment Variables
In the project settings → Environment Variables:
```
PUTER_HOSTNAME=your-puter-hostname
PUTER_API_KEY=your-puter-api-key
```

### 5. Deploy
Click "Deploy" and wait for the build to complete.

## Configuration Files Created

- `vercel.json` - Vercel deployment configuration
- `.env.example` - Environment variables template
- Updated `package.json` with Vercel scripts

## Troubleshooting

### Build Issues
- Ensure all dependencies are in `package.json`
- Check that `react-router.config.ts` has `ssr: false`
- Verify Tailwind CSS v4 configuration

### Environment Variables
- Make sure Puter.com credentials are correct
- Check variable names match exactly
- Redeploy after adding/changing variables

### Routing Issues
- The `vercel.json` includes SPA routing rewrites
- All routes should work as client-side navigation

## Post-Deployment

1. **Test your application** - Visit the deployed URL
2. **Check file uploads** - Test Puter.com integration
3. **Verify all routes** - Ensure navigation works properly
4. **Monitor logs** - Check Vercel function logs for any issues

## Custom Domain (Optional)

1. In Vercel project settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificate is automatically provisioned

## Continuous Deployment

Once set up, Vercel will automatically redeploy when you:
- Push to your main branch
- Merge pull requests
- Update environment variables

Your AI Resumer is now live on Vercel! 🚀
