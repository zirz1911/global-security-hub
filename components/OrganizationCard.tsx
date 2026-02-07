'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ORG_TYPE_LABELS, ORG_TYPE_COLORS, OrgType } from '@/lib/types'
import { getCountryFlag } from '@/lib/flags'

interface Organization {
  id: string
  name: string
  country: string
  type: string
  logoUrl: string | null
}

export function OrganizationCard({ org }: { org: Organization }) {
  const typeColor = ORG_TYPE_COLORS[org.type as OrgType] || ORG_TYPE_COLORS.OTHER
  const typeLabel = ORG_TYPE_LABELS[org.type as OrgType] || org.type
  const flagUrl = getCountryFlag(org.country, 'w40')

  return (
    <Link href={`/org/${org.id}`}>
      <div className="group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-pointer h-full">
        {/* Logo */}
        <div className="w-16 h-16 bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-2xl font-bold text-gray-500 group-hover:bg-blue-50 transition-colors">
          {org.logoUrl ? (
            <img src={org.logoUrl} alt={org.name} className="w-full h-full object-contain rounded-lg p-1" />
          ) : (
            org.name.charAt(0).toUpperCase()
          )}
        </div>

        {/* Organization Name */}
        <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {org.name}
        </h3>

        {/* Country with flag */}
        <p className="text-xs text-gray-600 mb-2 flex items-center gap-1.5">
          <img src={flagUrl} alt={org.country} className="w-4 h-3 object-cover rounded-sm" />
          {org.country}
        </p>

        {/* Type Badge */}
        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${typeColor}`}>
          {typeLabel}
        </span>
      </div>
    </Link>
  )
}
