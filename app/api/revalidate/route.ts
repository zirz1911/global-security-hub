import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
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

    const body = await request.json()
    const { path } = body

    if (path) {
      // Revalidate specific path
      revalidatePath(path)
      return NextResponse.json({
        success: true,
        message: `Path ${path} revalidated`,
        revalidated: true,
      })
    }

    // Revalidate all common paths
    const pathsToRevalidate = [
      '/',
      '/admin',
      '/admin/organizations',
    ]

    pathsToRevalidate.forEach((p) => revalidatePath(p))

    return NextResponse.json({
      success: true,
      message: 'Common paths revalidated',
      paths: pathsToRevalidate,
      revalidated: true,
    })
  } catch (error: any) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      { error: 'Failed to revalidate', details: error.message },
      { status: 500 }
    )
  }
}
