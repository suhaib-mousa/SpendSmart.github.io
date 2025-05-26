# SpendSmart Deployment Guide

## Free Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend) - RECOMMENDED

#### Frontend Deployment on Vercel
1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Set environment variables in Vercel dashboard:
   - `VITE_API_URL`: Your Railway backend URL + `/api`
4. Deploy automatically on push

#### Backend Deployment on Railway
1. Connect your GitHub repo to Railway
2. Create a new project and select your repo
3. Set environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: Generate a secure random string
4. Railway will auto-deploy

### Option 2: Netlify (Frontend) + Render (Backend)

#### Frontend on Netlify
1. Connect GitHub repo to Netlify
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Environment variables:
   - `VITE_API_URL`: Your Render backend URL + `/api`

#### Backend on Render
1. Connect GitHub repo to Render
2. Create a Web Service
3. Settings:
   - Build command: `npm install`
   - Start command: `npm start`
4. Environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: Generate secure string

### Option 3: All-in-One with Render
Use the `render.yaml` file for automatic deployment of both frontend and backend.

## Environment Variables Needed

### Backend (.env)
```
MONGODB_URI=your_mongodb_atlas_connection_string
NODE_ENV=production
JWT_SECRET=your_secure_jwt_secret
PORT=5001
```

### Frontend
```
VITE_API_URL=https://your-backend-url.com/api
```

## Pre-deployment Checklist

- [ ] MongoDB Atlas database is set up and accessible
- [ ] Environment variables are configured
- [ ] CORS is properly configured for your frontend domain
- [ ] Database connection string uses environment variables
- [ ] API URLs use environment variables
- [ ] Build scripts are working locally

## Post-deployment Steps

1. Test all API endpoints
2. Verify database connections
3. Check CORS configuration
4. Test user authentication flow
5. Verify file uploads (if any)

## Troubleshooting

### Common Issues:
- **CORS errors**: Update CORS configuration in server/index.js
- **API not found**: Check VITE_API_URL environment variable
- **Database connection**: Verify MONGODB_URI and network access
- **Build failures**: Check Node.js version compatibility

### Debugging:
- Check deployment logs in your hosting platform
- Verify environment variables are set correctly
- Test API endpoints directly using tools like Postman 