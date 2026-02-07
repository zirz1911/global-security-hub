import prisma from '@/lib/prisma'
import Link from 'next/link'
import { ORG_TYPE_LABELS, OrgType } from '@/lib/types'
import { getCountryFlag } from '@/lib/flags'
import { DeleteOrganizationButton } from '@/components/DeleteOrganizationButton'

export default async function AdminOrganizationsPage() {
  const organizations = await prisma.organization.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { personnel: true },
      },
    },
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Organizations</h1>
        <Link
          href="/admin/organizations/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          Add New Organization
        </Link>
      </div>

      {/* Organizations Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Country
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Personnel
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {organizations.map((org) => {
                const flagUrl = getCountryFlag(org.country, 'w40')
                return (
                  <tr key={org.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-sm font-bold text-gray-500 flex-shrink-0">
                          {org.logoUrl ? (
                            <img src={org.logoUrl} alt={org.name} className="w-full h-full object-contain p-0.5" />
                          ) : (
                            org.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{org.name}</p>
                          {org.website && (
                            <a
                              href={org.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline"
                            >
                              Visit website
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <img src={flagUrl} alt={org.country} className="w-4 h-3 object-cover rounded-sm" />
                        <span className="text-sm text-gray-600">{org.country}</span>
                      </div>
                    </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-700 font-medium">
                      {ORG_TYPE_LABELS[org.type as OrgType] || org.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {org._count.personnel} members
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      org.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {org.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-sm">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/org/${org.id}`}
                        target="_blank"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/organizations/${org.id}/edit`}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/admin/organizations/${org.id}/personnel`}
                        className="text-purple-600 hover:text-purple-700"
                      >
                        Personnel
                      </Link>
                      <DeleteOrganizationButton
                        organizationId={org.id}
                        organizationName={org.name}
                        personnelCount={org._count.personnel}
                      />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-4 text-sm text-gray-600">
        Total: {organizations.length} organizations
      </div>
    </div>
  )
}
