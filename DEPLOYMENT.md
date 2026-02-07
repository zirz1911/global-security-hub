# Deployment Guide - Global Security Hub

## Prerequisites

Before deploying, ensure you have:
- Node.js 18.x or later
- SQLite database file (`prisma/dev.db`)
- Environment variables configured

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Database
DATABASE_URL="file:./dev.db"

# Session Secret (generate a random 32-character string)
SESSION_SECRET="your-secret-key-here-min-32-chars"
```

To generate a secure SESSION_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Initialize database:
```bash
npm run db:push
npm run db:seed
```

3. Run development server:
```bash
npm run dev
```

4. Open http://localhost:3000

## Production Build

1. Build the application:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications:

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Deploy**:
```bash
vercel
```

3. **Environment Variables**:
   - Go to Vercel dashboard → Settings → Environment Variables
   - Add `DATABASE_URL` and `SESSION_SECRET`

4. **Database**:
   - For production, consider using Vercel Postgres or Turso (SQLite on the edge)
   - Update `DATABASE_URL` accordingly
   - Run migrations: `vercel env pull && npx prisma migrate deploy`

**Note**: SQLite file database won't work on Vercel's serverless environment. Use one of these alternatives:
- Vercel Postgres
- Turso (SQLite on the edge)
- PlanetScale
- Supabase

### Option 2: Docker

1. **Create Dockerfile**:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

2. **Build and run**:
```bash
docker build -t global-security-hub .
docker run -p 3000:3000 -e SESSION_SECRET=your-secret global-security-hub
```

### Option 3: VPS (DigitalOcean, AWS EC2, etc.)

1. **Clone repository**:
```bash
git clone <your-repo-url>
cd global-security-hub
```

2. **Install dependencies**:
```bash
npm ci --only=production
```

3. **Setup database**:
```bash
npx prisma generate
npx prisma migrate deploy
npm run db:seed
```

4. **Build application**:
```bash
npm run build
```

5. **Use PM2 for process management**:
```bash
npm install -g pm2
pm2 start npm --name "global-security-hub" -- start
pm2 save
pm2 startup
```

6. **Setup Nginx reverse proxy** (optional):
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Database Migrations

When updating the schema:

1. Create migration:
```bash
npx prisma migrate dev --name migration_name
```

2. Deploy to production:
```bash
npx prisma migrate deploy
```

## Default Admin Account

After seeding the database, you can login with:
- **Email**: admin@globalsecurityhub.com
- **Password**: admin123

**⚠️ IMPORTANT**: Change the default admin password immediately after first login in production!

## Performance Optimization

1. **Static Generation**: Most pages are pre-rendered for optimal performance
2. **ISR**: Homepage revalidates every 1 hour, detail pages every 6 hours
3. **Image Optimization**: Use Next.js Image component for images
4. **Database**: Consider connection pooling for high traffic

## Monitoring

- Use Vercel Analytics for performance monitoring
- Check application logs regularly
- Monitor database size and performance
- Set up error tracking (e.g., Sentry)

## Security Checklist

- [ ] Change default admin password
- [ ] Use strong SESSION_SECRET (minimum 32 characters)
- [ ] Enable HTTPS in production
- [ ] Set up rate limiting for API routes
- [ ] Regular security updates (`npm audit`)
- [ ] Backup database regularly
- [ ] Review and limit admin access

## Backup Strategy

1. **Database Backup**:
```bash
# Backup SQLite database
cp prisma/dev.db prisma/backup-$(date +%Y%m%d).db

# Or use automated backup script
```

2. **Automated Backups**:
   - Set up daily cron job for database backups
   - Store backups in separate location (S3, DO Spaces, etc.)

## Troubleshooting

### Build Errors
- Ensure all dependencies are installed
- Check Node.js version (18.x or later)
- Clear `.next` folder and rebuild

### Database Connection Issues
- Verify DATABASE_URL is correct
- Ensure database file exists and is readable
- Check file permissions

### Session Issues
- Verify SESSION_SECRET is set
- Clear browser cookies
- Check session configuration in `lib/session.ts`

## Support

For issues and questions:
- Check GitHub Issues
- Review documentation
- Contact: [Your Contact Info]

## License

[Your License Here]
