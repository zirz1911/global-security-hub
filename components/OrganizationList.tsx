'use client'

import { useState, useMemo, useCallback } from 'react'
import { OrganizationCard } from './OrganizationCard'
import { SearchFilter } from './SearchFilter'

interface Organization {
  id: string
  name: string
  country: string
  type: string
  logoUrl: string | null
}

interface OrganizationListProps {
  organizations: Organization[]
  countries: string[]
  types: string[]
}

const ITEMS_PER_PAGE = 24

export function OrganizationList({ organizations, countries, types }: OrganizationListProps) {
  const [filters, setFilters] = useState({ search: '', country: '', type: '' })
  const [currentPage, setCurrentPage] = useState(1)

  const handleFilterChange = useCallback((newFilters: { search: string; country: string; type: string }) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }, [])

  const filteredOrgs = useMemo(() => {
    return organizations.filter((org) => {
      const matchesSearch = org.name.toLowerCase().includes(filters.search.toLowerCase())
      const matchesCountry = !filters.country || org.country === filters.country
      const matchesType = !filters.type || org.type === filters.type
      return matchesSearch && matchesCountry && matchesType
    })
  }, [organizations, filters])

  const totalPages = Math.ceil(filteredOrgs.length / ITEMS_PER_PAGE)
  const paginatedOrgs = filteredOrgs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div>
      <SearchFilter
        countries={countries}
        types={types}
        onFilterChange={handleFilterChange}
      />

      {/* Results count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {paginatedOrgs.length} of {filteredOrgs.length} organizations
        {filteredOrgs.length !== organizations.length && (
          <span className="text-gray-500"> (filtered from {organizations.length} total)</span>
        )}
      </div>

      {/* Organization Grid */}
      {paginatedOrgs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {paginatedOrgs.map((org) => (
            <OrganizationCard key={org.id} org={org} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>No organizations found matching your criteria.</p>
          <p className="text-sm mt-1">Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-gray-700 font-medium"
          >
            Previous
          </button>

          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 rounded-lg font-medium ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-gray-700 font-medium"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
