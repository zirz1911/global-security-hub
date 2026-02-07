interface Personnel {
  id: string
  name: string
  position: string
  rank: string | null
  photoUrl: string | null
  bio: string | null
  isCurrent: boolean
}

export function PersonnelCard({ person }: { person: Personnel }) {
  return (
    <div className={`bg-white border rounded-lg p-4 ${person.isCurrent ? 'border-gray-200' : 'border-gray-100 opacity-75'}`}>
      {/* Photo */}
      <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full mb-3 flex items-center justify-center text-2xl font-bold text-gray-400 overflow-hidden">
        {person.photoUrl ? (
          <img src={person.photoUrl} alt={person.name} className="w-full h-full object-cover" />
        ) : (
          person.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        )}
      </div>

      {/* Name */}
      <h4 className="font-semibold text-gray-900 text-center text-sm">{person.name}</h4>

      {/* Position */}
      <p className="text-xs text-gray-600 text-center mt-1">{person.position}</p>

      {/* Rank Badge */}
      {person.rank && (
        <div className="flex justify-center mt-2">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            person.rank === 'Senior' ? 'bg-amber-100 text-amber-800' :
            person.rank === 'Mid-level' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {person.rank}
          </span>
        </div>
      )}

      {/* Status Badge */}
      {!person.isCurrent && (
        <div className="flex justify-center mt-2">
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            Former
          </span>
        </div>
      )}
    </div>
  )
}
