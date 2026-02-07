import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import bcrypt from 'bcryptjs'

// Create adapter with URL string - database is at project root
const adapter = new PrismaBetterSqlite3({
  url: 'file:./dev.db'
})
const prisma = new PrismaClient({ adapter })

// Organization type detection based on name
function detectOrgType(name: string): string {
  const nameLower = name.toLowerCase()

  if (nameLower.includes('embassy') || nameLower.includes('high commission') || nameLower.includes('delegation')) {
    return 'EMBASSY'
  }
  if (nameLower.includes('police') || nameLower.includes('carabinieri') || nameLower.includes('polizia')) {
    return 'POLICE'
  }
  if (nameLower.includes('intelligence') || nameLower.includes('security service') || nameLower.includes('state security') ||
      nameLower.includes('secret service') || nameLower.includes('fbi') || nameLower.includes('interpol')) {
    return 'INTELLIGENCE'
  }
  if (nameLower.includes('defence') || nameLower.includes('defense') || nameLower.includes('armed forces') ||
      nameLower.includes('air force') || nameLower.includes('navy') || nameLower.includes('military')) {
    return 'DEFENCE'
  }
  if (nameLower.includes('cyber') || nameLower.includes('information security') || nameLower.includes('digital')) {
    return 'CYBER_SECURITY'
  }
  if (nameLower.includes('customs') || nameLower.includes('border')) {
    return 'CUSTOMS'
  }
  if (nameLower.includes('trade') || nameLower.includes('commerce')) {
    return 'TRADE'
  }
  if (nameLower.includes('narcotics') || nameLower.includes('drug')) {
    return 'NARCOTICS'
  }
  if (nameLower.includes('anti-corruption') || nameLower.includes('corrupt')) {
    return 'ANTI_CORRUPTION'
  }
  if (nameLower.includes('telecom') || nameLower.includes('communication')) {
    return 'TELECOMMUNICATIONS'
  }
  if (nameLower.includes('government') || nameLower.includes('ministry') || nameLower.includes('president')) {
    return 'GOVERNMENT'
  }
  return 'OTHER'
}

// Extract country from organization name
function detectCountry(name: string): string {
  const countryPatterns: Record<string, string[]> = {
    'India': ['india', 'andhra pradesh', 'punjab'],
    'Australia': ['australia', 'western australia'],
    'Azerbaijan': ['azerbaijan'],
    'Bahrain': ['bahrain'],
    'Bangladesh': ['bangladesh'],
    'Bhutan': ['bhutan'],
    'Botswana': ['botswana'],
    'United Kingdom': ['british', 'uk police', 'united kingdom'],
    'Brunei': ['brunei', 'brunnei'],
    'Cameroon': ['cameroon'],
    'Canada': ['canada', 'canadian'],
    'Central African Republic': ['central african republic'],
    'Chad': ['chad'],
    'Chile': ['chile'],
    'Congo': ['congo'],
    'Malaysia': ['malaysia', 'petronas', 'telekom malaysia'],
    'Czech Republic': ['czech republic'],
    'Egypt': ['egypt'],
    'Austria': ['austria'],
    'Bosnia and Herzegovina': ['bosnia'],
    'Cambodia': ['cambodia'],
    'Georgia': ['georgia'],
    'Germany': ['germany'],
    'Hungary': ['hungary'],
    'Italy': ['italy', 'italia'],
    'Jordan': ['jordan'],
    'Kenya': ['kenya'],
    'Laos': ['lao'],
    'Lithuania': ['lithuania'],
    'Morocco': ['morocco'],
    'Myanmar': ['myanmar'],
    'Netherlands': ['netherlands'],
    'Pakistan': ['pakistan', 'islamabad'],
    'Papua New Guinea': ['papua new guinea'],
    'Philippines': ['philippine'],
    'Poland': ['poland'],
    'Portugal': ['portugal'],
    'Spain': ['spain'],
    'Thailand': ['thailand'],
    'United States': ['united states', 'u.s.', 'fbi', 'irs'],
    'Timor-Leste': ['timor'],
    'Turkey': ['turkiye', 'turkish'],
    'United Arab Emirates': ['uae', 'united arab emirates'],
    'Zimbabwe': ['zimbabwe'],
    'Ethiopia': ['ethiopia'],
    'European Union': ['european union'],
    'Ghana': ['ghana'],
    'Hong Kong': ['hong kong'],
    'Indonesia': ['indonesia'],
    'International': ['interpol', 'international'],
    'Israel': ['israel'],
    'Kazakhstan': ['kazakhstan'],
    'Korea': ['korea'],
    'Liberia': ['liberia'],
    'Malawi': ['malawi'],
    'Maldives': ['maldives'],
    'Mongolia': ['mongolia'],
    'Mozambique': ['mozambique'],
    'Namibia': ['namibia'],
    'New Zealand': ['new zealand'],
    'Nigeria': ['nigeria'],
    'Oman': ['oman'],
    'Romania': ['romania'],
    'Grenada': ['grenada'],
    'Samoa': ['samoa'],
    'Saudi Arabia': ['saudi arabia'],
    'Singapore': ['singapore'],
    'Slovakia': ['slovak'],
    'South Africa': ['south africa'],
    'Suriname': ['suriname'],
    'Taiwan': ['taiwan'],
    'Tanzania': ['tanzania'],
    'Togo': ['togo'],
    'Uganda': ['uganda'],
    'Ukraine': ['ukraine'],
    'Vietnam': ['vietnam'],
    'Zambia': ['zambia'],
  }

  const nameLower = name.toLowerCase()
  for (const [country, patterns] of Object.entries(countryPatterns)) {
    if (patterns.some(pattern => nameLower.includes(pattern))) {
      return country
    }
  }
  return 'International'
}

// Full list of 150+ organizations
const organizations = [
  'Andhra Pradesh India Police',
  'Australia Trade Commission',
  'Australia Federal Police',
  'Azerbaijan Information Security',
  'Azerbaijan Ministry Internal Affairs',
  'Azerbaijan Security Service',
  'Bahrain Ministry Interior',
  'Bangladesh Ministry Defence',
  'Bangladesh National Police',
  'Bangladesh National Security Intelligence',
  'Bhutan Anti-Corruption Commission',
  'Botswana Directorate Economic Crime',
  'Botswana Intelligence Service Agency',
  'Botswana President\'s Office',
  'British High Commission',
  'Brunei Cyber Security Agency',
  'Brunei Narcotics Control Bureau',
  'Brunei Prime Minister\'s Office',
  'Cameroon Intelligence Agency',
  'Canada High Commission',
  'Canada Police',
  'Central African Republic Police',
  'Chad Agence Securite Informatique',
  'Chile Carabineros',
  'Congo Ministry Interior',
  'CyberSecurity Malaysia',
  'Czech Republic Trade',
  'Egypt Ministry Defence',
  'Embassy of Austria',
  'Embassy of Bosnia and Herzegovina',
  'Embassy of Botswana',
  'Embassy of Cambodia',
  'Embassy of Canada',
  'Embassy of Czech Republic',
  'Embassy of Georgia',
  'Embassy of Germany',
  'Embassy of Hungary',
  'Embassy of India',
  'Embassy of Italy',
  'Embassy of Jordan',
  'Embassy of Kenya',
  'Embassy of Lao',
  'Embassy of Lithuania',
  'Embassy of Morocco',
  'Embassy of Myanmar',
  'Embassy of Netherlands',
  'Embassy of Pakistan',
  'Embassy of Papua New Guinea',
  'Embassy of Philippine',
  'Embassy of Poland',
  'Embassy of Portugal',
  'Embassy of Spain',
  'Embassy of Thailand',
  'Embassy of the United States',
  'Embassy of Timor-Leste',
  'Embassy of Turkiye',
  'Embassy of United Arab Emirates',
  'Embassy of Zimbabwe',
  'Ethiopia Artificial Intelligence Agency',
  'Ethiopia Security Agency',
  'European Union Delegation',
  'FBI United States',
  'Ghana Narcotics Control Commission',
  'Government of India',
  'Hong Kong Customs Department',
  'India Centre Advanced Computing',
  'India Department Telecommunications',
  'India High Commission',
  'India Intelligence Department',
  'India Ministry Home Affairs',
  'Indonesia Cyber and Crypto Agency',
  'Indonesia National Police',
  'Indonesia State Intelligence Agency',
  'International Crimes Tribunal',
  'INTERPOL',
  'Islamabad Police',
  'Israel Trade Mission',
  'Italia Polizia di Stato',
  'Italy Carabinieri',
  'Italy Prime Minister\'s Office',
  'Italy Trade Agency',
  'Kazakhstan Security Agency',
  'Kenya Ministry Interior',
  'Kenya National Crime Center',
  'Korea National Police Agency',
  'Laos Law Enforcement',
  'Liberia National Police',
  'Malawi Intelligence Services',
  'Malaysia Anti-Financial Crime Centre',
  'Malaysia Communication Commission',
  'Malaysia Inland Revenue Authority',
  'Malaysia Ministry Defence',
  'Malaysia Ministry Domestic Trade',
  'Malaysia Prime Minister\'s Office',
  'Malaysia Prison Department',
  'Malaysia Royal Police',
  'Maldives Armed Forces',
  'Maldives Police',
  'Mongolia Anti Corruption Agency',
  'Mozambique Government',
  'Namibia President\'s Office',
  'Netherlands Police',
  'New Zealand Defence Force',
  'Nigeria Drug Law Enforcement Agency',
  'Nigeria High Commission',
  'Nigeria State Services',
  'Oman Telecom Agency',
  'Pakistan Anti Narcotics Force',
  'Pakistan Intelligence Bureau',
  'Pakistan Ministry Defence',
  'Pakistan Police',
  'Papua New Guinea Communications Authority',
  'Petronas',
  'Philippines Drug Enforcement Agency',
  'Philippines National Police',
  'Punjab Pakistan Police',
  'Romania Ministry Interior',
  'Royal Canadian Mounted Police',
  'Royal Grenada Police Force',
  'Royal Malaysia Air Force',
  'Royal Malaysia Police',
  'Royal Oman Police',
  'Samoa Ministry Communications',
  'Saudi Arabia Ministry Defence',
  'Saudi Arabia Ministry Interior',
  'Saudi Arabia State Security',
  'Singapore Corrupt Practices Investigation',
  'Singapore Defence Technology Agency',
  'Singapore Digital and Intelligence Service',
  'Singapore Home Team Technology Agency',
  'Singapore Inland Revenue Authority',
  'Singapore Ministry Defence',
  'Singapore Ministry Home Affairs',
  'Singapore Prison Service',
  'Slovak Information Service',
  'South Africa Security Service',
  'Spain Trade Office',
  'Suriname Police',
  'Taiwan Ministry of Justice',
  'Tanzania Police Force',
  'Tanzania President\'s Office',
  'Telekom Malaysia',
  'Thailand Cyber Forensic Investigation',
  'Thailand Facility Management',
  'Thailand Narcotics Control Board',
  'Thailand Traffic Center',
  'Togo Armed Forces',
  'Togo National Security',
  'Turkish Telecom Agency',
  'U.S. Air Force',
  'U.S. Armed Forces',
  'U.S. Customs and Border Protection',
  'U.S. Department Homeland Security',
  'U.S. Secret Service',
  'UAE Government',
  'UAE Ministry Defence',
  'UAE Ministry Interior',
  'Uganda Ministry Defence',
  'UK Police',
  'Ukraine State Bureau Investigation',
  'United Kingdom Foreign Services',
  'United States Embassy',
  'United States IRS-Criminal Investigation',
  'United States Navy',
  'Vietnam Government',
  'Western Australia Police Force',
  'Zambia Air Force',
  'Zambia Communication Division',
  'Zambia High Commission',
  'Zambia Internal Security',
  'Zambia Ministry Defence',
  'Zimbabwe Home Affairs',
  'Zimbabwe Telecommunications Authority',
]

// Sample personnel names by region
const personnelByRegion: Record<string, string[]> = {
  'Asia': ['Wei Chen', 'Raj Patel', 'Yuki Tanaka', 'Ahmad Hassan', 'Nguyen Van Minh', 'Park Ji-hoon', 'Arun Kumar'],
  'Europe': ['Hans Mueller', 'Pierre Dubois', 'Marco Rossi', 'Jan Kowalski', 'Elena Petrova', 'James Smith', 'Anna Schmidt'],
  'Middle East': ['Mohammed Al-Rashid', 'Omar Khalil', 'Fatima Hassan', 'Ali Abdullah', 'Youssef Ibrahim'],
  'Africa': ['Kwame Asante', 'Amara Diallo', 'Chidi Okonkwo', 'Tendai Moyo', 'Fatou Mbaye'],
  'Americas': ['John Williams', 'Maria Garcia', 'Carlos Rodriguez', 'Emily Johnson', 'Michael Brown'],
  'Oceania': ['Jack Thompson', 'Sarah Mitchell', 'David Chen', 'Emma Wilson', 'James Cook'],
}

// Get region from country
function getRegion(country: string): string {
  const regions: Record<string, string[]> = {
    'Asia': ['India', 'Bangladesh', 'Pakistan', 'Malaysia', 'Singapore', 'Thailand', 'Indonesia', 'Vietnam', 'Laos', 'Cambodia', 'Myanmar', 'Brunei', 'Philippines', 'Korea', 'Japan', 'Hong Kong', 'Taiwan', 'Maldives', 'Bhutan', 'Mongolia', 'Kazakhstan', 'Azerbaijan'],
    'Europe': ['United Kingdom', 'Germany', 'France', 'Italy', 'Spain', 'Poland', 'Czech Republic', 'Hungary', 'Austria', 'Netherlands', 'Portugal', 'Lithuania', 'Romania', 'Ukraine', 'Slovakia', 'Bosnia and Herzegovina', 'Georgia', 'European Union'],
    'Middle East': ['United Arab Emirates', 'Saudi Arabia', 'Bahrain', 'Oman', 'Jordan', 'Israel', 'Turkey', 'Egypt'],
    'Africa': ['Nigeria', 'Kenya', 'South Africa', 'Ghana', 'Ethiopia', 'Cameroon', 'Botswana', 'Zimbabwe', 'Zambia', 'Malawi', 'Mozambique', 'Namibia', 'Tanzania', 'Togo', 'Uganda', 'Liberia', 'Morocco', 'Central African Republic', 'Chad', 'Congo'],
    'Americas': ['United States', 'Canada', 'Chile', 'Suriname', 'Grenada'],
    'Oceania': ['Australia', 'New Zealand', 'Papua New Guinea', 'Samoa', 'Timor-Leste'],
  }

  for (const [region, countries] of Object.entries(regions)) {
    if (countries.includes(country)) {
      return region
    }
  }
  return 'Europe' // default
}

// Sample positions
const positions = [
  'Director General',
  'Deputy Director',
  'Chief of Operations',
  'Head of Investigations',
  'Senior Analyst',
  'Regional Commander',
  'Chief Inspector',
  'Superintendent',
  'Assistant Director',
  'Operations Manager',
]

async function main() {
  console.log('Starting seed...')

  // Clear existing data
  await prisma.personnel.deleteMany()
  await prisma.organization.deleteMany()
  await prisma.user.deleteMany()

  // Create admin user
  const passwordHash = await bcrypt.hash('admin123', 10)
  await prisma.user.create({
    data: {
      email: 'admin@globalsecurityhub.com',
      passwordHash,
      name: 'Administrator',
      role: 'ADMIN',
    },
  })
  console.log('Created admin user: admin@globalsecurityhub.com / admin123')

  // Create organizations
  let createdCount = 0
  for (const orgName of organizations) {
    const country = detectCountry(orgName)
    const type = detectOrgType(orgName)
    const region = getRegion(country)

    const org = await prisma.organization.create({
      data: {
        name: orgName,
        fullName: orgName,
        country,
        type,
        description: `${orgName} is a ${type.toLowerCase().replace('_', ' ')} organization based in ${country}. This agency plays a crucial role in ${country}'s security and law enforcement infrastructure.`,
        established: `${1950 + Math.floor(Math.random() * 70)}`,
        isActive: true,
      },
    })

    // Add 3-5 personnel per organization
    const personnelCount = 3 + Math.floor(Math.random() * 3)
    const regionPersonnel = personnelByRegion[region] || personnelByRegion['Europe']

    for (let i = 0; i < personnelCount; i++) {
      const name = regionPersonnel[Math.floor(Math.random() * regionPersonnel.length)]
      const position = positions[Math.floor(Math.random() * positions.length)]

      await prisma.personnel.create({
        data: {
          organizationId: org.id,
          name: `${name}${i > 0 ? ` ${String.fromCharCode(65 + i)}` : ''}`,
          position,
          rank: i === 0 ? 'Senior' : i === 1 ? 'Mid-level' : 'Junior',
          bio: `Experienced ${position.toLowerCase()} with extensive background in ${type.toLowerCase().replace('_', ' ')} operations.`,
          isCurrent: true,
          startDate: `${2015 + Math.floor(Math.random() * 10)}`,
        },
      })
    }

    createdCount++
    if (createdCount % 25 === 0) {
      console.log(`Created ${createdCount} organizations...`)
    }
  }

  console.log(`\nSeed completed!`)
  console.log(`- ${createdCount} organizations created`)
  console.log(`- ${await prisma.personnel.count()} personnel records created`)
  console.log(`- 1 admin user created`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
