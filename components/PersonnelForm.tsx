'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

interface PersonnelData {
  id?: string
  name: string
  position: string
  rank?: string | null
  photoUrl?: string | null
  bio?: string | null
  isCurrent: boolean
}

interface Personnel {
  id?: string
  name: string
  position: string
  rank: string
  photoUrl: string
  bio: string
  isCurrent: boolean
}

interface PersonnelFormProps {
  organizationId: string
  personnel?: PersonnelData
  mode: 'create' | 'edit'
}

const RANK_OPTIONS = [
  'Senior',
  'Mid-level',
  'Junior',
  'Executive',
  'Director',
  'Manager',
  'Officer',
  'Agent',
  'Analyst',
  'Specialist',
]

export function PersonnelForm({ organizationId, personnel, mode }: PersonnelFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState<Personnel>({
    name: personnel?.name || '',
    position: personnel?.position || '',
    rank: personnel?.rank || '',
    photoUrl: personnel?.photoUrl || '',
    bio: personnel?.bio || '',
    isCurrent: personnel?.isCurrent ?? true,
  })

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const url = mode === 'create'
        ? `/api/orgs/${organizationId}/personnel`
        : `/api/orgs/${organizationId}/personnel/${personnel?.id}`

      const res = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Operation failed')
        return
      }

      // Redirect to personnel list
      router.push(`/admin/organizations/${organizationId}/personnel`)
      router.refresh()
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
            placeholder="John Doe"
          />
        </div>

        {/* Position */}
        <div>
          <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
            Position <span className="text-red-500">*</span>
          </label>
          <input
            id="position"
            type="text"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
            placeholder="Director"
          />
        </div>

        {/* Rank */}
        <div>
          <label htmlFor="rank" className="block text-sm font-medium text-gray-700 mb-2">
            Rank
          </label>
          <select
            id="rank"
            value={formData.rank}
            onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900"
          >
            <option value="">Select rank (optional)</option>
            {RANK_OPTIONS.map((rank) => (
              <option key={rank} value={rank}>
                {rank}
              </option>
            ))}
          </select>
        </div>

        {/* Photo URL */}
        <div>
          <label htmlFor="photoUrl" className="block text-sm font-medium text-gray-700 mb-2">
            Photo URL
          </label>
          <input
            id="photoUrl"
            type="url"
            value={formData.photoUrl}
            onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
            placeholder="https://example.com/photo.jpg"
          />
        </div>
      </div>

      {/* Bio */}
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
          Biography
        </label>
        <textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
          placeholder="Brief biography or background information..."
        />
      </div>

      {/* Current Status */}
      <div className="flex items-center gap-2">
        <input
          id="isCurrent"
          type="checkbox"
          checked={formData.isCurrent}
          onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="isCurrent" className="text-sm font-medium text-gray-700">
          Currently Active
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading ? 'Saving...' : mode === 'create' ? 'Add Personnel' : 'Update Personnel'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-900 px-4 py-2"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
