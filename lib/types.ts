export type OrgType =
  | 'POLICE'
  | 'INTELLIGENCE'
  | 'DEFENCE'
  | 'EMBASSY'
  | 'CYBER_SECURITY'
  | 'CUSTOMS'
  | 'BORDER_CONTROL'
  | 'TRADE'
  | 'NARCOTICS'
  | 'ANTI_CORRUPTION'
  | 'TELECOMMUNICATIONS'
  | 'GOVERNMENT'
  | 'OTHER'

export const ORG_TYPE_LABELS: Record<OrgType, string> = {
  POLICE: 'Police',
  INTELLIGENCE: 'Intelligence',
  DEFENCE: 'Defence',
  EMBASSY: 'Embassy',
  CYBER_SECURITY: 'Cyber Security',
  CUSTOMS: 'Customs',
  BORDER_CONTROL: 'Border Control',
  TRADE: 'Trade',
  NARCOTICS: 'Narcotics',
  ANTI_CORRUPTION: 'Anti-Corruption',
  TELECOMMUNICATIONS: 'Telecommunications',
  GOVERNMENT: 'Government',
  OTHER: 'Other',
}

export const ORG_TYPE_COLORS: Record<OrgType, string> = {
  POLICE: 'bg-blue-100 text-blue-800',
  INTELLIGENCE: 'bg-purple-100 text-purple-800',
  DEFENCE: 'bg-green-100 text-green-800',
  EMBASSY: 'bg-amber-100 text-amber-800',
  CYBER_SECURITY: 'bg-cyan-100 text-cyan-800',
  CUSTOMS: 'bg-orange-100 text-orange-800',
  BORDER_CONTROL: 'bg-red-100 text-red-800',
  TRADE: 'bg-emerald-100 text-emerald-800',
  NARCOTICS: 'bg-rose-100 text-rose-800',
  ANTI_CORRUPTION: 'bg-indigo-100 text-indigo-800',
  TELECOMMUNICATIONS: 'bg-teal-100 text-teal-800',
  GOVERNMENT: 'bg-slate-100 text-slate-800',
  OTHER: 'bg-gray-100 text-gray-800',
}
