// Country code mapping for flag API
const countryCodeMap: Record<string, string> = {
  // Americas
  'United States': 'us',
  'Canada': 'ca',
  'Mexico': 'mx',
  'Brazil': 'br',
  'Argentina': 'ar',
  'Chile': 'cl',
  'Colombia': 'co',
  'Peru': 'pe',

  // Europe
  'United Kingdom': 'gb',
  'France': 'fr',
  'Germany': 'de',
  'Italy': 'it',
  'Spain': 'es',
  'Netherlands': 'nl',
  'Belgium': 'be',
  'Switzerland': 'ch',
  'Austria': 'at',
  'Poland': 'pl',
  'Czech Republic': 'cz',
  'Portugal': 'pt',
  'Greece': 'gr',
  'Sweden': 'se',
  'Norway': 'no',
  'Denmark': 'dk',
  'Finland': 'fi',
  'Ireland': 'ie',
  'Russia': 'ru',
  'Ukraine': 'ua',

  // Asia
  'China': 'cn',
  'Japan': 'jp',
  'South Korea': 'kr',
  'India': 'in',
  'Thailand': 'th',
  'Vietnam': 'vn',
  'Singapore': 'sg',
  'Malaysia': 'my',
  'Indonesia': 'id',
  'Philippines': 'ph',
  'Pakistan': 'pk',
  'Bangladesh': 'bd',
  'Sri Lanka': 'lk',
  'Myanmar': 'mm',
  'Cambodia': 'kh',
  'Laos': 'la',

  // Middle East
  'Israel': 'il',
  'Turkey': 'tr',
  'Saudi Arabia': 'sa',
  'United Arab Emirates': 'ae',
  'Qatar': 'qa',
  'Kuwait': 'kw',
  'Iran': 'ir',
  'Iraq': 'iq',
  'Jordan': 'jo',
  'Lebanon': 'lb',

  // Oceania
  'Australia': 'au',
  'New Zealand': 'nz',

  // Africa
  'South Africa': 'za',
  'Egypt': 'eg',
  'Nigeria': 'ng',
  'Kenya': 'ke',
  'Morocco': 'ma',
  'Algeria': 'dz',
  'Tunisia': 'tn',
  'Ethiopia': 'et',
  'Ghana': 'gh',
  'Tanzania': 'tz',
}

/**
 * Get country flag URL from flagcdn.com
 * @param country - Country name
 * @param size - Flag size (w20, w40, w80, w160, w320, w640, w1280, w2560)
 * @returns Flag image URL
 */
export function getCountryFlag(country: string, size: 'w20' | 'w40' | 'w80' | 'w160' = 'w80'): string {
  const code = countryCodeMap[country]
  if (!code) {
    // Return a default/placeholder flag or empty
    return `https://flagcdn.com/${size}/xx.png` // xx = unknown
  }
  return `https://flagcdn.com/${size}/${code}.png`
}

/**
 * Get country code from country name
 */
export function getCountryCode(country: string): string | null {
  return countryCodeMap[country] || null
}

/**
 * Get organization logo URL or fallback to placeholder
 */
export function getOrganizationLogo(
  logoUrl: string | null,
  organizationName: string
): string | null {
  if (logoUrl) {
    return logoUrl
  }

  // Return null to show initials instead
  return null
}
