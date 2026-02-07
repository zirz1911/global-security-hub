'use client'

import Link from 'next/link'
import { ORG_TYPE_LABELS, ORG_TYPE_COLORS, OrgType } from '@/lib/types'

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

  return (
    <Link href={`/org/${org.id}`}>
      <div className="group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-pointer h-full">
        {/* Logo placeholder */}
        <div className="w-16 h-16 bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-2xl font-bold text-gray-400 group-hover:bg-blue-50 transition-colors">
          {org.logoUrl ? (
            <img src={org.logoUrl} alt={org.name} className="w-full h-full object-contain rounded-lg" />
          ) : (
            org.name.charAt(0).toUpperCase()
          )}
        </div>

        {/* Organization Name */}
        <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {org.name}
        </h3>

        {/* Country */}
        <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
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
