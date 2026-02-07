import prisma from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminDashboard() {
  // Get statistics
  const [
    totalOrgs,
    totalPersonnel,
    recentOrgs,
    orgsByType,
  ] = await Promise.all([
    prisma.organization.count(),
    prisma.personnel.count(),
    prisma.organization.findMany({
      take: 5,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        name: true,
        country: true,
        type: true,
        updatedAt: true,
      },
    }),
    prisma.organization.groupBy({
      by: ['type'],
      _count: { type: true },
      orderBy: { _count: { type: 'desc' } },
    }),
  ])

  const countries = await prisma.organization.findMany({
    distinct: ['country'],
    select: { country: true },
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="text-3xl font-bold text-blue-600">{totalOrgs}</div>
          <div className="text-sm text-gray-500">Total Organizations</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="text-3xl font-bold text-green-600">{countries.length}</div>
          <div className="text-sm text-gray-500">Countries</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="text-3xl font-bold text-purple-600">{totalPersonnel}</div>
          <div className="text-sm text-gray-500">Personnel Records</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="text-3xl font-bold text-amber-600">{orgsByType.length}</div>
          <div className="text-sm text-gray-500">Categories</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recently Updated */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recently Updated</h2>
            <Link href="/admin/organizations" className="text-sm text-blue-600 hover:text-blue-700">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {recentOrgs.map((org) => (
              <div key={org.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{org.name}</p>
                  <p className="text-xs text-gray-500">{org.country}</p>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(org.updatedAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Organizations by Type */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Organizations by Type</h2>
          <div className="space-y-3">
            {orgsByType.map((item) => (
              <div key={item.type} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{item.type.replace('_', ' ')}</span>
                <span className="text-sm font-semibold text-gray-900">{item._count.type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/organizations/new" className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Add Organization</p>
                <p className="text-xs text-gray-500">Create new entry</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/organizations" className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Manage Organizations</p>
                <p className="text-xs text-gray-500">Edit, delete entries</p>
              </div>
            </div>
          </Link>

          <Link href="/" className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">View Public Site</p>
                <p className="text-xs text-gray-500">See live website</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
