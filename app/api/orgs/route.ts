import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function POST(request: NextRequest) {
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

    // Validate required fields
    if (!data.name || !data.country || !data.type) {
      return NextResponse.json(
        { error: 'Name, country, and type are required' },
        { status: 400 }
      )
    }

    // Create organization
    const organization = await prisma.organization.create({
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

    // Revalidate homepage to show new organization
    revalidatePath('/')

    return NextResponse.json({
      success: true,
      organization,
    })
  } catch (error: any) {
    console.error('Create organization error:', error)

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
