import { notFound } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { PersonnelCard } from '@/components/PersonnelCard'
import { ORG_TYPE_LABELS, ORG_TYPE_COLORS, OrgType } from '@/lib/types'
import { Metadata } from 'next'

// Revalidate every 6 hours
export const revalidate = 21600

interface PageProps {
  params: Promise<{ id: string }>
}

// Generate static params for all organizations
export async function generateStaticParams() {
  const orgs = await prisma.organization.findMany({
    select: { id: true },
  })
  return orgs.map((org) => ({ id: org.id }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const org = await prisma.organization.findUnique({
    where: { id },
    select: { name: true, country: true, type: true },
  })

  if (!org) {
    return { title: 'Organization Not Found' }
  }

  return {
    title: `${org.name} | Global Security Hub`,
    description: `Information about ${org.name}, a ${org.type.toLowerCase()} organization based in ${org.country}.`,
    openGraph: {
      title: org.name,
      description: `Security organization in ${org.country}`,
      type: 'website',
    },
  }
}

export default async function OrganizationPage({ params }: PageProps) {
  const { id } = await params

  const org = await prisma.organization.findUnique({
    where: { id },
    include: {
      personnel: {
        orderBy: [
          { isCurrent: 'desc' },
          { name: 'asc' },
        ],
      },
    },
  })

  if (!org) {
    notFound()
  }

  const typeColor = ORG_TYPE_COLORS[org.type as OrgType] || ORG_TYPE_COLORS.OTHER
  const typeLabel = ORG_TYPE_LABELS[org.type as OrgType] || org.type
  const currentPersonnel = org.personnel.filter(p => p.isCurrent)
  const formerPersonnel = org.personnel.filter(p => !p.isCurrent)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Directory
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Organization Header */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Logo */}
            <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-4xl font-bold text-gray-400 flex-shrink-0">
              {org.logoUrl ? (
                <img src={org.logoUrl} alt={org.name} className="w-full h-full object-contain rounded-lg" />
              ) : (
                org.name.charAt(0).toUpperCase()
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{org.name}</h1>
              {org.fullName && org.fullName !== org.name && (
                <p className="text-gray-600 mb-2">{org.fullName}</p>
              )}

              <div className="flex flex-wrap gap-2 mb-4">
                {/* Type Badge */}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${typeColor}`}>
                  {typeLabel}
                </span>

                {/* Country Badge */}
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {org.country}
                </span>

                {/* Established */}
                {org.established && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    Est. {org.established}
                  </span>
                )}
              </div>

              {/* Contact Info */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {org.website && (
                  <a href={org.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    Website
                  </a>
                )}
                {org.email && (
                  <a href={`mailto:${org.email}`} className="flex items-center gap-1 hover:text-blue-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {org.email}
                  </a>
                )}
                {org.phone && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {org.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {org.description && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">About</h2>
            <p className="text-gray-600 leading-relaxed">{org.description}</p>
          </div>
        )}

        {/* Personnel Section */}
        {org.personnel.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Personnel
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({currentPersonnel.length} current, {formerPersonnel.length} former)
              </span>
            </h2>

            {/* Current Personnel */}
            {currentPersonnel.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Current Members</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {currentPersonnel.map((person) => (
                    <PersonnelCard key={person.id} person={person} />
                  ))}
                </div>
              </div>
            )}

            {/* Former Personnel */}
            {formerPersonnel.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">Former Members</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {formerPersonnel.map((person) => (
                    <PersonnelCard key={person.id} person={person} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Last Updated */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Last updated: {org.lastUpdated.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
          <p>Global Security Hub - Data for informational purposes only</p>
        </div>
      </footer>
    </div>
  )
}
