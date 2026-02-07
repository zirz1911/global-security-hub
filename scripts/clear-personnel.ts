import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./dev.db'
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🗑️  Clearing all personnel data...\n')

  // Count existing personnel
  const count = await prisma.personnel.count()
  console.log(`Found ${count} personnel records\n`)

  // Delete all personnel
  const result = await prisma.personnel.deleteMany({})

  console.log(`✅ Deleted ${result.count} personnel records\n`)
  console.log('Personnel database cleared successfully!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
