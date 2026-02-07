import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function PUT(
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
    const { id } = await params

    // Validate required fields
    if (!data.name || !data.country || !data.type) {
      return NextResponse.json(
        { error: 'Name, country, and type are required' },
        { status: 400 }
      )
    }

    // Check if organization exists
    const existing = await prisma.organization.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    // Update organization
    const organization = await prisma.organization.update({
      where: { id },
      data: {
        name: data.name,
        fullName: data.fullName || null,
        country: data.country,
        type: data.type,
        description: data.description || null,
        website: data.website || null,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address || null,
        established: data.established || null,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    })

    // Revalidate homepage and org detail page
    revalidatePath('/')
    revalidatePath(`/org/${id}`)

    return NextResponse.json({
      success: true,
      organization,
    })
  } catch (error: any) {
    console.error('Update organization error:', error)

    // Check for unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'An organization with this name already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    const { id } = await params

    // Check if organization exists
    const existing = await prisma.organization.findUnique({
      where: { id },
      include: {
        _count: {
          select: { personnel: true },
        },
      },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    // Check if organization has personnel
    if (existing._count.personnel > 0) {
      return NextResponse.json(
        { error: `Cannot delete organization with ${existing._count.personnel} personnel. Please remove all personnel first.` },
        { status: 400 }
      )
    }

    // Delete organization
    await prisma.organization.delete({
      where: { id },
    })

    // Revalidate homepage
    revalidatePath('/')

    return NextResponse.json({
      success: true,
      message: 'Organization deleted successfully',
    })
  } catch (error: any) {
    console.error('Delete organization error:', error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
