import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const user = await requireAuth()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()
    const { id: organizationId } = await params

    // Validate required fields
    if (!data.name || !data.position) {
      return NextResponse.json(
        { error: 'Name and position are required' },
        { status: 400 }
      )
    }

    // Check if organization exists
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
    })

    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    // Create personnel
    const personnel = await prisma.personnel.create({
      data: {
        name: data.name,
        position: data.position,
        rank: data.rank || null,
        photoUrl: data.photoUrl || null,
        bio: data.bio || null,
        isCurrent: data.isCurrent !== undefined ? data.isCurrent : true,
        organizationId,
      },
    })

    // Revalidate pages
    revalidatePath(`/org/${organizationId}`)
    revalidatePath(`/admin/organizations/${organizationId}/personnel`)

    return NextResponse.json({
      success: true,
      personnel,
    })
  } catch (error: any) {
    console.error('Create personnel error:', error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
