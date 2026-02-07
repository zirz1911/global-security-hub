# Caching Strategy - Global Security Hub

## Overview
This application uses Next.js's built-in caching mechanisms with Incremental Static Regeneration (ISR) to provide fast page loads while keeping data fresh.

## Cache Configuration

### Public Pages

#### Homepage (`/`)
- **Strategy**: Static Site Generation (SSG) with ISR
- **Revalidate**: 3600 seconds (1 hour)
- **Why**: Organization list changes infrequently, but we want fresh data every hour
- **Invalidation**: Automatically revalidated on organization create/update/delete

#### Organization Detail Pages (`/org/[id]`)
- **Strategy**: Static Site Generation (SSG) with ISR
- **Revalidate**: 21600 seconds (6 hours)
- **Why**: Organization details and personnel change less frequently
- **Invalidation**: Automatically revalidated on organization or personnel changes
- **Pre-generation**: All organization pages are pre-generated at build time using `generateStaticParams`

### Admin Pages

#### Dashboard (`/admin`)
- **Strategy**: Server-Side Rendering (SSR)
- **Why**: Always shows fresh data for admin users

#### Organizations List (`/admin/organizations`)
- **Strategy**: Server-Side Rendering (SSR)
- **Why**: Admins need real-time data

#### Personnel Management (`/admin/organizations/[id]/personnel`)
- **Strategy**: Server-Side Rendering (SSR)
- **Why**: Admins need real-time data

## Cache Invalidation

### Automatic Invalidation

The application automatically invalidates cache when data changes:

1. **Organization Created/Updated**
   - Invalidates: `/` (homepage)
   - Invalidates: `/org/[id]` (organization detail page)

2. **Organization Deleted**
   - Invalidates: `/` (homepage)

3. **Personnel Created/Updated/Deleted**
   - Invalidates: `/org/[organizationId]` (organization detail page)
   - Invalidates: `/admin/organizations/[organizationId]/personnel` (personnel management)

### Manual Invalidation

Admins can manually revalidate cache using the API:

```bash
# Revalidate specific path
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"path": "/"}'

# Revalidate all common paths
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{}'
```

## Performance Considerations

### Static Generation Benefits
- **Fast**: Pages are pre-rendered at build time
- **SEO**: Fully crawlable by search engines
- **Scalable**: No database queries on page load
- **Cost-effective**: Minimal server resources

### ISR Benefits
- **Fresh Data**: Content updates without full rebuilds
- **Best of Both**: Static speed + dynamic freshness
- **Gradual Updates**: Pages regenerate on-demand after revalidation period

## Monitoring

- Check build logs for static page generation count
- Monitor revalidation logs in application logs
- Use Next.js Analytics for real-time performance metrics

## Best Practices

1. **Homepage**: Keep revalidation at 1 hour for balance between freshness and performance
2. **Detail Pages**: 6-hour revalidation is sufficient for most organization updates
3. **Admin Pages**: Always use SSR to ensure fresh data
4. **Manual Revalidation**: Use sparingly, only when immediate updates are critical

## Cache Headers

Next.js automatically sets appropriate cache headers:
- Static pages: Long cache duration with stale-while-revalidate
- API routes: No caching by default
- Admin pages: No caching (always fresh)
