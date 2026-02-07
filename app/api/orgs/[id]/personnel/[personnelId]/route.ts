import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; personnelId: string }> }
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
    const { id: organizationId, personnelId } = await params

    // Validate required fields
    if (!data.name || !data.position) {
      return NextResponse.json(
        { error: 'Name and position are required' },
        { status: 400 }
      )
    }

    // Check if personnel exists and belongs to the organization
    const existing = await prisma.personnel.findUnique({
      where: { id: personnelId },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Personnel not found' },
        { status: 404 }
      )
    }

    if (existing.organizationId !== organizationId) {
      return NextResponse.json(
        { error: 'Personnel does not belong to this organization' },
        { status: 403 }
      )
    }

    // Update personnel
    const personnel = await prisma.personnel.update({
      where: { id: personnelId },
      data: {
        name: data.name,
        position: data.position,
        rank: data.rank || null,
        photoUrl: data.photoUrl || null,
        bio: data.bio || null,
        isCurrent: data.isCurrent !== undefined ? data.isCurrent : true,
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
    console.error('Update personnel error:', error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; personnelId: string }> }
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

    const { id: organizationId, personnelId } = await params

    // Check if personnel exists and belongs to the organization
    const existing = await prisma.personnel.findUnique({
      where: { id: personnelId },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Personnel not found' },
        { status: 404 }
      )
    }

    if (existing.organizationId !== organizationId) {
      return NextResponse.json(
        { error: 'Personnel does not belong to this organization' },
        { status: 403 }
      )
    }

    // Delete personnel
    await prisma.personnel.delete({
      where: { id: personnelId },
    })

    // Revalidate pages
    revalidatePath(`/org/${organizationId}`)
    revalidatePath(`/admin/organizations/${organizationId}/personnel`)

    return NextResponse.json({
      success: true,
      message: 'Personnel deleted successfully',
    })
  } catch (error: any) {
    console.error('Delete personnel error:', error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
