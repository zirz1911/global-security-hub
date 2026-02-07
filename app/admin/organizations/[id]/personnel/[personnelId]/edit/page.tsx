import { notFound } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { PersonnelForm } from '@/components/PersonnelForm'

export default async function EditPersonnelPage({
  params,
}: {
  params: Promise<{ id: string; personnelId: string }>
}) {
  const { id: organizationId, personnelId } = await params

  const [organization, personnel] = await Promise.all([
    prisma.organization.findUnique({
      where: { id: organizationId },
      select: {
        id: true,
        name: true,
      },
    }),
    prisma.personnel.findUnique({
      where: { id: personnelId },
    }),
  ])

  if (!organization || !personnel) {
    notFound()
  }

  // Verify personnel belongs to the organization
  if (personnel.organizationId !== organizationId) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href={`/admin/organizations/${organizationId}/personnel`}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Personnel
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Personnel</h1>
        <p className="text-sm text-gray-600 mt-1">{organization.name}</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <PersonnelForm
          organizationId={organizationId}
          personnel={personnel}
          mode="edit"
        />
      </div>
    </div>
  )
}
