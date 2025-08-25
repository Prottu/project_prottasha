# 🚗 Car Rental Application - Production Deployment Guide

This guide covers deploying your car rental application to production environments using various platforms and services.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [Frontend Deployment](#frontend-deployment)
4. [Backend Deployment](#backend-deployment)
5. [Database Deployment](#database-deployment)
6. [Domain & SSL](#domain--ssl)
7. [Monitoring & Maintenance](#monitoring--maintenance)

## 🔧 Prerequisites

### Required Accounts
- [ ] Supabase account (for database)
- [ ] Vercel/Netlify account (for frontend)
- [ ] Railway/Heroku/DigitalOcean account (for backend)
- [ ] Domain registrar account (optional)

### Required Tools
- [ ] Git
- [ ] Node.js (v18+)
- [ ] Python (v3.9+)
- [ ] Docker (optional)

## 🌍 Environment Configuration

### 1. Production Environment Variables

Create production `.env` files:

**Backend (.env)**
```bash
# Production Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key

# Flask Configuration
FLASK_ENV=production
FLASK_DEBUG=False
SECRET_KEY=your_super_secret_production_key

# CORS Configuration
CORS_ORIGINS=https://your-frontend-domain.com

# Database
DATABASE_URL=postgresql://your_db_connection_string
```

**Frontend (.env.production)**
```bash
# Production Supabase Configuration
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

# API Configuration
REACT_APP_API_URL=https://your-backend-domain.com
```

### 2. Security Considerations

```bash
# Generate secure secret key for Flask
python -c "import secrets; print(secrets.token_hex(32))"

# Set strong database passwords
# Enable Supabase Row Level Security
# Configure CORS properly
# Use HTTPS only
```

## 🎨 Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Configure Build Settings**
```json
{
  "name": "car-rental-frontend",
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "headers": {
        "cache-control": "s-maxage=31536000,immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

3. **Deploy**
```bash
cd car-rental-frontend
vercel --prod
```

### Option 2: Netlify

1. **Build Configuration (netlify.toml)**
```toml
[build]
  publish = "build"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  REACT_APP_SUPABASE_URL = "https://your-project.supabase.co"
  REACT_APP_SUPABASE_ANON_KEY = "your_key"
```

2. **Deploy via Git**
```bash
# Connect your GitHub repo to Netlify
# Set environment variables in Netlify dashboard
# Automatic deployments on push
```

### Option 3: AWS S3 + CloudFront

1. **Build for Production**
```bash
cd car-rental-frontend
npm run build
```

2. **Upload to S3**
```bash
aws s3 sync build/ s3://your-bucket-name --delete
```

3. **Configure CloudFront Distribution**
```json
{
  "origins": [{
    "domainName": "your-bucket.s3.amazonaws.com",
    "id": "S3-car-rental-frontend"
  }],
  "defaultCacheBehavior": {
    "targetOriginId": "S3-car-rental-frontend",
    "viewerProtocolPolicy": "redirect-to-https"
  }
}
```

## 🔧 Backend Deployment

### Option 1: Railway (Recommended)

1. **Railway Configuration (railway.toml)**
```toml
[build]
  builder = "NIXPACKS"

[deploy]
  startCommand = "python app.py"
  restartPolicyType = "ON_FAILURE"
```

2. **Dockerfile (Optional)**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python", "app.py"]
```

3. **Deploy**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway link
railway up
```

### Option 2: Heroku

1. **Procfile**
```
web: python app.py
```

2. **runtime.txt**
```
python-3.11.0
```

3. **Deploy**
```bash
# Install Heroku CLI
heroku create car-rental-backend
heroku config:set SUPABASE_URL=your_url
heroku config:set SUPABASE_KEY=your_key
git push heroku main
```

### Option 3: DigitalOcean App Platform

1. **App Spec (app.yaml)**
```yaml
name: car-rental-backend
services:
- name: api
  source_dir: /
  github:
    repo: your-username/car-rental-app
    branch: main
  run_command: python app.py
  environment_slug: python
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: SUPABASE_URL
    value: your_supabase_url
  - key: SUPABASE_KEY
    value: your_supabase_key
  http_port: 5000
```

2. **Deploy**
```bash
doctl apps create app.yaml
```

### Option 4: Docker + Any Platform

1. **Multi-stage Dockerfile**
```dockerfile
# Backend
FROM python:3.11-slim as backend

WORKDIR /app
COPY Car-rental-Service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY Car-rental-Service/ .
EXPOSE 5000
CMD ["python", "app.py"]
```

2. **Docker Compose (docker-compose.yml)**
```yaml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "5000:5000"
    environment:
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_KEY=${SUPABASE_KEY}
    restart: unless-stopped
```

## 🗄️ Database Deployment

### Supabase Production Setup

1. **Create Production Project**
```sql
-- Run in Supabase SQL Editor
-- Your database schema from database-schema.sql
-- Enable Row Level Security
-- Set up proper indexes
```

2. **Configure Security**
```sql
-- Enable RLS on all tables
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create production policies
CREATE POLICY "Public vehicles are viewable by everyone" 
ON vehicles FOR SELECT 
USING (true);

CREATE POLICY "Users can insert bookings" 
ON bookings FOR INSERT 
WITH CHECK (auth.uid() = user_id);
```

3. **Backup Strategy**
```bash
# Set up automated backups
# Configure point-in-time recovery
# Set up monitoring alerts
```

## 🌐 Domain & SSL

### 1. Domain Setup

```bash
# Point your domain to your deployments
# Frontend: CNAME to vercel/netlify
# Backend: A record to server IP

# Example DNS records:
# A     @           123.456.789.0
# CNAME www         car-rental-frontend.vercel.app
# CNAME api         car-rental-backend.railway.app
```

### 2. SSL Certificates

```bash
# Most platforms provide automatic SSL
# Vercel: Automatic
# Netlify: Automatic
# Railway: Automatic

# For custom servers:
# Use Let's Encrypt with Certbot
sudo certbot --nginx -d yourdomain.com
```

## 📊 Monitoring & Maintenance

### 1. Application Monitoring

**Uptime Monitoring**
```javascript
// Add to your app.py
@app.route('/health')
def health_check():
    return {'status': 'healthy', 'timestamp': datetime.now().isoformat()}
```

**Error Tracking**
```bash
# Use services like:
# - Sentry for error tracking
# - LogRocket for session replay
# - DataDog for performance monitoring
```

### 2. Performance Optimization

**Frontend Optimization**
```json
{
  "scripts": {
    "build": "GENERATE_SOURCEMAP=false react-scripts build",
    "analyze": "npm run build && npx serve -s build"
  }
}
```

**Backend Optimization**
```python
# Add caching
from flask_caching import Cache

cache = Cache(app, config={'CACHE_TYPE': 'simple'})

@cache.cached(timeout=300)
def get_vehicles():
    # Cached for 5 minutes
    pass
```

### 3. Security Checklist

- [ ] Enable HTTPS everywhere
- [ ] Set up CORS properly
- [ ] Use environment variables for secrets
- [ ] Enable Supabase RLS
- [ ] Regular dependency updates
- [ ] Set up rate limiting
- [ ] Configure proper headers

### 4. Backup & Recovery

```bash
# Database backups (automated via Supabase)
# Code backups (Git repositories)
# Environment variable backups (secure storage)

# Recovery procedures documented
# Disaster recovery plan
# Regular backup testing
```

## 🚀 Deployment Checklist

### Pre-deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database schema applied
- [ ] Security policies enabled
- [ ] Performance optimized

### Deployment
- [ ] Frontend deployed and accessible
- [ ] Backend deployed and responding
- [ ] Database connected and working
- [ ] Domain configured with SSL
- [ ] Monitoring set up

### Post-deployment
- [ ] End-to-end testing
- [ ] Performance monitoring
- [ ] Error tracking active
- [ ] Backup verification
- [ ] Documentation updated

## 📞 Support & Troubleshooting

### Common Issues

1. **CORS Errors**
```python
# Fix CORS configuration
CORS(app, origins=['https://yourdomain.com'])
```

2. **Environment Variables**
```bash
# Verify all variables are set
echo $SUPABASE_URL
echo $REACT_APP_SUPABASE_URL
```

3. **Database Connection**
```python
# Test database connectivity
try:
    supabase.table('vehicles').select('*').limit(1).execute()
    print("Database connected successfully")
except Exception as e:
    print(f"Database connection failed: {e}")
```

### Getting Help

- 📧 Create GitHub issues for bugs
- 📖 Check documentation first
- 🔍 Search existing issues
- 💬 Join community discussions

---

**Congratulations! Your Car Rental Application is now ready for production! 🎉**
