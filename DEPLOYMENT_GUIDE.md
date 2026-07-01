# QR Attendance System - Deployment Guide

## 🚀 Deployment Options

### Option 1: Heroku Deployment

#### Prerequisites
- Heroku CLI installed
- GitHub account
- Heroku account

#### Steps

1. **Login to Heroku**
```bash
heroku login
```

2. **Create Heroku Apps**
```bash
# Backend app
heroku create your-app-name-backend

# Admin dashboard app
heroku create your-app-name-admin
```

3. **Set Environment Variables**
```bash
# For backend
heroku config:set -a your-app-name-backend \
  MONGODB_URI="your_mongodb_atlas_uri" \
  JWT_SECRET="your_secure_secret" \
  NODE_ENV="production"
```

4. **Deploy Backend**
```bash
cd backend
git push heroku main
```

5. **Deploy Admin Dashboard**
```bash
cd admin-dashboard
git push heroku main
```

### Option 2: AWS Deployment

#### Using AWS Elastic Beanstalk

1. **Install EB CLI**
```bash
pip install awsebcli
```

2. **Initialize EB**
```bash
cd backend
eb init -p node.js-14 qr-attendance-backend
```

3. **Create Environment**
```bash
eb create qr-attendance-env
```

4. **Deploy**
```bash
eb deploy
```

#### Using AWS RDS for MongoDB

```bash
# Set connection string in EB environment
eb setenv MONGODB_URI="your_rds_uri"
```

### Option 3: DigitalOcean Deployment

#### Prerequisites
- DigitalOcean account
- SSH access

#### Steps

1. **Create Droplet**
   - Choose Ubuntu 20.04
   - Select appropriate size
   - Add SSH keys

2. **SSH into Droplet**
```bash
ssh root@your_droplet_ip
```

3. **Install Dependencies**
```bash
curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
curl -fsSL https://www.mongodb.org/static/pgp/server-4.4.asc | apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list
sudo apt-get update
sudo apt-get install -y mongodb-org
```

4. **Clone Repository**
```bash
git clone https://github.com/your-username/qr-attendance-system.git
cd qr-attendance-system/backend
```

5. **Setup PM2**
```bash
sudo npm install -g pm2
pm2 start server.js --name "qr-backend"
pm2 startup
pm2 save
```

6. **Setup Nginx**
```bash
sudo apt-get install nginx
sudo nano /etc/nginx/sites-available/default
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your_domain;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo systemctl restart nginx
```

### Option 4: Docker & Kubernetes

#### Build Docker Image

```dockerfile
# Dockerfile for backend
FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

#### Build and Push to Docker Hub

```bash
docker build -t your-username/qr-attendance-backend:1.0.0 .
docker push your-username/qr-attendance-backend:1.0.0
```

#### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: qr-attendance-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: qr-backend
  template:
    metadata:
      labels:
        app: qr-backend
    spec:
      containers:
      - name: backend
        image: your-username/qr-attendance-backend:1.0.0
        ports:
        - containerPort: 5000
        env:
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: qr-secrets
              key: mongodb-uri
```

---

## 📊 Database Setup

### MongoDB Atlas (Cloud)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster
3. Get connection string
4. Add to .env:
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/qr-attendance
```

### Local MongoDB

```bash
# Install MongoDB Community Edition
# macOS
brew tap mongodb/brew
brew install mongodb-community

# Ubuntu
curl -fsSL https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start service
sudo systemctl start mongod
```

---

## 🔒 SSL/HTTPS Setup

### Using Let's Encrypt

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d yourdomain.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

### Nginx SSL Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }
}

server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## 📊 Monitoring & Logging

### PM2 Monitoring

```bash
# Install PM2 Plus
pm2 plus

# View logs
pm2 logs qr-backend

# Monitor
pm2 monit
```

### ELK Stack (Elasticsearch, Logstash, Kibana)

```bash
# Install Docker
sudo apt-get install docker.io docker-compose

# Use docker-compose for ELK
docker-compose -f elk-compose.yml up
```

---

## 📊 Backup Strategy

### MongoDB Backup

```bash
# Full backup
mongodump --uri="mongodb://localhost:27017/qr-attendance" --out=./backup

# Restore
mongorestore --uri="mongodb://localhost:27017" ./backup
```

### Automated Daily Backup

```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="mongodb://localhost:27017/qr-attendance" --out=./backups/$DATE

# Upload to cloud storage (AWS S3)
aws s3 cp ./backups/$DATE s3://your-bucket/backups/$DATE --recursive
```

---

## ✅ Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] SSL certificate installed
- [ ] Firewall rules configured
- [ ] CORS settings updated
- [ ] API rate limiting enabled
- [ ] Error logging setup
- [ ] Monitoring configured
- [ ] Backup strategy implemented
- [ ] Security headers configured
- [ ] HTTPS enforced
- [ ] Database backups automated

---

## 📄 Performance Optimization

### Nginx Caching

```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=qr_cache:10m;

server {
    location /api/lectures {
        proxy_cache qr_cache;
        proxy_cache_valid 200 10m;
        proxy_pass http://localhost:5000;
    }
}
```

### Database Indexing

```javascript
// Ensure indexes exist
db.users.createIndex({ email: 1 });
db.lectures.createIndex({ lecturer: 1, date: -1 });
db.attendance.createIndex({ student: 1, lecture: 1 });
```

---

## 🐛 Troubleshooting Deployment

### Backend won't start
```bash
# Check logs
pm2 logs qr-backend

# Verify env variables
echo $MONGODB_URI

# Test MongoDB connection
mongosh $MONGODB_URI
```

### Port already in use
```bash
# Find process using port 5000
lsof -ti:5000 | xargs kill -9
```

### CORS errors
```javascript
// Add to backend .env
MOBILE_APP_URL=https://your-mobile-app.com
ADMIN_DASHBOARD_URL=https://your-admin-dashboard.com
```

---

**Deployment Notes:**
- Always use environment variables for secrets
- Enable HTTPS in production
- Set up automatic backups
- Monitor application performance
- Plan for scalability

---

**Last Updated:** July 2024