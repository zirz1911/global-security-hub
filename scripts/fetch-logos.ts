import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./dev.db'
})

const prisma = new PrismaClient({ adapter })

// Helper function to extract domain from URL
function extractDomain(url: string): string | null {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname.replace('www.', '')
  } catch {
    return null
  }
}

// Helper function to test if image URL is accessible
async function isImageAccessible(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    return response.ok && response.headers.get('content-type')?.startsWith('image/')
  } catch {
    return false
  }
}

// Try to fetch logo from multiple sources
async function fetchLogo(domain: string): Promise<string | null> {
  const sources = [
    // Clearbit Logo API (high quality)
    `https://logo.clearbit.com/${domain}`,
    // Google Favicon API (larger size)
    `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
    // DuckDuckGo Icon API
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
  ]

  for (const url of sources) {
    console.log(`  Trying: ${url}`)
    const accessible = await isImageAccessible(url)
    if (accessible) {
      console.log(`  ✓ Found logo: ${url}`)
      return url
    }
  }

  return null
}

async function main() {
  console.log('🔍 Fetching organization logos...\n')

  // Get all organizations
  const allOrgs = await prisma.organization.findMany({
    orderBy: { name: 'asc' },
  })

  // Filter organizations with website URLs
  const organizations = allOrgs.filter(org => org.website && org.website.trim() !== '')

  console.log(`Found ${organizations.length} organizations with websites (out of ${allOrgs.length} total)\n`)

  let updated = 0
  let skipped = 0
  let failed = 0

  for (const org of organizations) {
    console.log(`\n[${organizations.indexOf(org) + 1}/${organizations.length}] ${org.name}`)

    // Skip if already has logo
    if (org.logoUrl) {
      console.log('  ⏭️  Already has logo, skipping...')
      skipped++
      continue
    }

    if (!org.website) {
      console.log('  ⚠️  No website URL')
      failed++
      continue
    }

    const domain = extractDomain(org.website)
    if (!domain) {
      console.log(`  ⚠️  Invalid website URL: ${org.website}`)
      failed++
      continue
    }

    console.log(`  Domain: ${domain}`)

    const logoUrl = await fetchLogo(domain)

    if (logoUrl) {
      await prisma.organization.update({
        where: { id: org.id },
        data: { logoUrl },
      })
      console.log(`  ✅ Updated with logo`)
      updated++
    } else {
      console.log(`  ❌ No logo found`)
      failed++
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  console.log('\n' + '='.repeat(50))
  console.log('📊 Summary:')
  console.log(`  ✅ Updated: ${updated}`)
  console.log(`  ⏭️  Skipped: ${skipped}`)
  console.log(`  ❌ Failed: ${failed}`)
  console.log('='.repeat(50))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
