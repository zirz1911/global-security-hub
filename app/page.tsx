import prisma from '@/lib/prisma'
import { OrganizationList } from '@/components/OrganizationList'

// Revalidate every hour
export const revalidate = 3600

export default async function HomePage() {
  // Fetch all organizations
  const organizations = await prisma.organization.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      country: true,
      type: true,
      logoUrl: true,
    },
    orderBy: { name: 'asc' },
  })

  // Get unique countries and types for filters
  const countries = [...new Set(organizations.map(org => org.country))].sort()
  const types = [...new Set(organizations.map(org => org.type))].sort()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Global Security Hub</h1>
              <p className="text-sm text-gray-600">Directory of Security Agencies Worldwide</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">{organizations.length}</div>
            <div className="text-sm text-gray-600">Organizations</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{countries.length}</div>
            <div className="text-sm text-gray-600">Countries</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">{types.length}</div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-amber-600">2026</div>
            <div className="text-sm text-gray-600">Updated</div>
          </div>
        </div>

        {/* Organization List with Search/Filter */}
        <OrganizationList
          organizations={organizations}
          countries={countries}
          types={types}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>Global Security Hub - Last Updated: February 2026</p>
          <p className="mt-1">Data for informational purposes only</p>
        </div>
      </footer>
    </div>
  )
}
