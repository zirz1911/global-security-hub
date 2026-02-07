import { notFound } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { PersonnelForm } from '@/components/PersonnelForm'

export default async function NewPersonnelPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const organization = await prisma.organization.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
    },
  })

  if (!organization) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href={`/admin/organizations/${id}/personnel`}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Personnel
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Add New Personnel</h1>
        <p className="text-sm text-gray-600 mt-1">{organization.name}</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <PersonnelForm organizationId={id} mode="create" />
      </div>
    </div>
  )
}
