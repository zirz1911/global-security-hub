import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./dev.db'
})

const prisma = new PrismaClient({ adapter })

interface PersonnelData {
  name: string
  position: string
  rank?: string
  photoUrl?: string
  bio?: string
  startDate?: string
  isCurrent: boolean
}

// Leadership data for major organizations
const personnelMap: Record<string, PersonnelData[]> = {
  // United States
  'FBI United States': [
    {
      name: 'Christopher Wray',
      position: 'Director',
      startDate: '2017',
      isCurrent: true,
      bio: 'Appointed as the 8th Director of the FBI in 2017'
    }
  ],
  'CIA': [
    {
      name: 'William J. Burns',
      position: 'Director',
      startDate: '2021',
      isCurrent: true,
      bio: 'Former U.S. Ambassador and career diplomat, appointed CIA Director in 2021'
    }
  ],
  'U.S. Department Homeland Security': [
    {
      name: 'Alejandro Mayorkas',
      position: 'Secretary',
      startDate: '2021',
      isCurrent: true,
      bio: '7th Secretary of Homeland Security'
    }
  ],
  'U.S. Secret Service': [
    {
      name: 'Kimberly Cheatle',
      position: 'Director',
      startDate: '2022',
      isCurrent: true,
      bio: '27th Director of the United States Secret Service'
    }
  ],

  // International
  'INTERPOL': [
    {
      name: 'Jürgen Stock',
      position: 'Secretary General',
      startDate: '2014',
      isCurrent: true,
      bio: 'German law enforcement officer, serving as Secretary General since 2014'
    },
    {
      name: 'Ahmed Naser Al-Raisi',
      position: 'President',
      startDate: '2021',
      isCurrent: true,
      bio: 'Inspector General of the UAE Ministry of Interior'
    }
  ],

  // United Kingdom
  'MI5': [
    {
      name: 'Ken McCallum',
      position: 'Director General',
      startDate: '2020',
      isCurrent: true,
      bio: 'Current Director General of MI5'
    }
  ],
  'MI6': [
    {
      name: 'Richard Moore',
      position: 'Chief',
      startDate: '2020',
      isCurrent: true,
      bio: 'Current Chief of the Secret Intelligence Service (MI6)'
    }
  ],

  // Canada
  'Royal Canadian Mounted Police': [
    {
      name: 'Mike Duheme',
      position: 'Commissioner',
      startDate: '2023',
      isCurrent: true,
      bio: 'Current Commissioner of the RCMP'
    }
  ],

  // Australia
  'AFP': [
    {
      name: 'Reece Kershaw',
      position: 'Commissioner',
      startDate: '2019',
      isCurrent: true,
      bio: 'Current Commissioner of the Australian Federal Police'
    }
  ],

  // France
  'DGSE': [
    {
      name: 'Nicolas Lerner',
      position: 'Director',
      startDate: '2023',
      isCurrent: true,
      bio: 'Current Director of the DGSE'
    }
  ],

  // Germany
  'Bundeskriminalamt': [
    {
      name: 'Holger Münch',
      position: 'President',
      startDate: '2014',
      isCurrent: true,
      bio: 'President of the Federal Criminal Police Office'
    }
  ],

  // Singapore
  'Singapore Ministry Home Affairs': [
    {
      name: 'K Shanmugam',
      position: 'Minister',
      startDate: '2011',
      isCurrent: true,
      bio: 'Minister for Home Affairs and Minister for Law'
    }
  ],
  'Singapore Police': [
    {
      name: 'Hoong Wee Teck',
      position: 'Commissioner of Police',
      startDate: '2023',
      isCurrent: true,
      bio: 'Current Commissioner of Police'
    }
  ],

  // Malaysia
  'Malaysia Royal Police': [
    {
      name: 'Razarudin Husain',
      position: 'Inspector-General',
      rank: 'Tan Sri',
      startDate: '2023',
      isCurrent: true,
      bio: 'Current Inspector-General of Police'
    }
  ],

  // Indonesia
  'Indonesia National Police': [
    {
      name: 'Listyo Sigit Prabowo',
      position: 'Chief of Police',
      rank: 'General',
      startDate: '2021',
      isCurrent: true,
      bio: 'Current Chief of Indonesian National Police'
    }
  ],

  // Thailand
  'Royal Thai Police': [
    {
      name: 'Torsak Sukvimol',
      position: 'Commissioner-General',
      rank: 'Police General',
      startDate: '2023',
      isCurrent: true,
      bio: 'Current Commissioner-General of the Royal Thai Police'
    }
  ],

  // Philippines
  'Philippines National Police': [
    {
      name: 'Benjamin Acorda Jr.',
      position: 'Chief of Police',
      rank: 'General',
      startDate: '2023',
      isCurrent: true,
      bio: 'Current Chief of the Philippine National Police'
    }
  ],

  // India
  'India Ministry Home Affairs': [
    {
      name: 'Amit Shah',
      position: 'Minister of Home Affairs',
      startDate: '2019',
      isCurrent: true,
      bio: 'Current Union Minister of Home Affairs and Cooperation'
    }
  ],

  // South Korea
  'Korea National Police Agency': [
    {
      name: 'Yoon Hee-keun',
      position: 'Commissioner General',
      startDate: '2022',
      isCurrent: true,
      bio: 'Current Commissioner General of the National Police Agency'
    }
  ],

  // Pakistan
  'Islamabad Police': [
    {
      name: 'Akbar Nasir Khan',
      position: 'Inspector General',
      startDate: '2023',
      isCurrent: true,
      bio: 'Inspector General of Islamabad Police'
    }
  ],

  // New Zealand
  'New Zealand Defence Force': [
    {
      name: 'Tony Davies',
      position: 'Chief of Defence Force',
      rank: 'Air Marshal',
      startDate: '2024',
      isCurrent: true,
      bio: 'Current Chief of the New Zealand Defence Force'
    }
  ],

  // Netherlands
  'Netherlands Police': [
    {
      name: 'Janny Knol',
      position: 'Chief of Police',
      startDate: '2024',
      isCurrent: true,
      bio: 'Current Chief of the National Police'
    }
  ],

  // Italy
  'Italy Carabinieri': [
    {
      name: 'Teo Luzi',
      position: 'Commanding General',
      rank: 'General',
      startDate: '2024',
      isCurrent: true,
      bio: 'Commanding General of the Carabinieri'
    }
  ],
  'Italia Polizia di Stato': [
    {
      name: 'Vittorio Pisani',
      position: 'Chief of Police',
      startDate: '2024',
      isCurrent: true,
      bio: 'Chief of the State Police of Italy'
    }
  ],

  // More United States Agencies
  'U.S. Customs and Border Protection': [
    {
      name: 'Troy Miller',
      position: 'Commissioner',
      startDate: '2021',
      isCurrent: true,
      bio: 'Acting Commissioner of CBP'
    }
  ],
  'DEA': [
    {
      name: 'Anne Milgram',
      position: 'Administrator',
      startDate: '2021',
      isCurrent: true,
      bio: 'Administrator of the Drug Enforcement Administration'
    }
  ],

  // China
  'MSS': [
    {
      name: 'Chen Wenqing',
      position: 'Minister',
      startDate: '2022',
      isCurrent: true,
      bio: 'Minister of State Security of China'
    }
  ],

  // Russia
  'FSB': [
    {
      name: 'Alexander Bortnikov',
      position: 'Director',
      startDate: '2008',
      isCurrent: true,
      bio: 'Director of the Federal Security Service'
    }
  ],

  // Japan
  'PSIA': [
    {
      name: 'Suzuki Masaki',
      position: 'Director-General',
      startDate: '2023',
      isCurrent: true,
      bio: 'Director-General of Public Security Intelligence Agency'
    }
  ],

  // Israel
  'Mossad': [
    {
      name: 'David Barnea',
      position: 'Director',
      startDate: '2021',
      isCurrent: true,
      bio: 'Director of Mossad'
    }
  ],

  // Saudi Arabia
  'Saudi Arabia Ministry Interior': [
    {
      name: 'Abdulaziz bin Saud',
      position: 'Minister',
      startDate: '2019',
      isCurrent: true,
      bio: 'Minister of Interior of Saudi Arabia'
    }
  ],

  // UAE
  'Dubai Police': [
    {
      name: 'Abdullah Khalifa Al Marri',
      position: 'Commander-in-Chief',
      rank: 'Major General',
      startDate: '2013',
      isCurrent: true,
      bio: 'Commander-in-Chief of Dubai Police'
    }
  ],

  // Turkey
  'MIT': [
    {
      name: 'Ibrahim Kalin',
      position: 'Director',
      startDate: '2023',
      isCurrent: true,
      bio: 'Head of National Intelligence Organization'
    }
  ],

  // Egypt
  'GIS': [
    {
      name: 'Abbas Kamel',
      position: 'Director',
      startDate: '2018',
      isCurrent: true,
      bio: 'Director of General Intelligence Service'
    }
  ],

  // South Africa
  'SAPS': [
    {
      name: 'Fannie Masemola',
      position: 'National Commissioner',
      rank: 'General',
      startDate: '2022',
      isCurrent: true,
      bio: 'National Commissioner of South African Police Service'
    }
  ],

  // Kenya
  'Kenya National Crime Center': [
    {
      name: 'Japhet Koome',
      position: 'Inspector-General',
      startDate: '2022',
      isCurrent: true,
      bio: 'Inspector-General of Police'
    }
  ],

  // Nigeria
  'Nigeria Drug Law Enforcement Agency': [
    {
      name: 'Buba Marwa',
      position: 'Chairman',
      rank: 'Brigadier General',
      startDate: '2021',
      isCurrent: true,
      bio: 'Chairman/Chief Executive Officer of NDLEA'
    }
  ],

  // Tanzania
  'Tanzania Police Force': [
    {
      name: 'Sirro Camilus',
      position: 'Inspector General',
      startDate: '2023',
      isCurrent: true,
      bio: 'Inspector General of Police'
    }
  ],

  // Hong Kong
  'Hong Kong Customs Department': [
    {
      name: 'Louise Ho',
      position: 'Commissioner',
      startDate: '2023',
      isCurrent: true,
      bio: 'Commissioner of Customs and Excise'
    }
  ],

  // Taiwan
  'Taiwan Ministry of Justice': [
    {
      name: 'Tsai Ching-hsiang',
      position: 'Minister',
      startDate: '2023',
      isCurrent: true,
      bio: 'Minister of Justice'
    }
  ],

  // Romania
  'Romania Ministry Interior': [
    {
      name: 'Catalin Predoiu',
      position: 'Minister',
      startDate: '2021',
      isCurrent: true,
      bio: 'Minister of Internal Affairs'
    }
  ],

  // Maldives
  'Maldives Police': [
    {
      name: 'Ali Shujau',
      position: 'Commissioner of Police',
      startDate: '2023',
      isCurrent: true,
      bio: 'Commissioner of Police'
    }
  ],

  // Oman
  'Royal Oman Police': [
    {
      name: 'Hassan bin Mohsen Al Shraiqi',
      position: 'Inspector General',
      rank: 'Major General',
      startDate: '2020',
      isCurrent: true,
      bio: 'Inspector General of Police and Customs'
    }
  ],

  // More Singapore Agencies
  'Singapore Ministry Defence': [
    {
      name: 'Ng Eng Hen',
      position: 'Minister',
      startDate: '2011',
      isCurrent: true,
      bio: 'Minister for Defence'
    }
  ],

  // More Malaysia Agencies
  'Petronas': [
    {
      name: 'Tengku Muhammad Taufik',
      position: 'President & CEO',
      rank: 'Tan Sri',
      startDate: '2022',
      isCurrent: true,
      bio: 'President and Group Chief Executive Officer'
    }
  ],
  'Telekom Malaysia': [
    {
      name: 'Imri Mokhtar',
      position: 'Group CEO',
      startDate: '2023',
      isCurrent: true,
      bio: 'Group Chief Executive Officer'
    }
  ],

  // Pakistan agencies
  'Pakistan Police': [
    {
      name: 'Usman Anwar',
      position: 'Inspector General Punjab',
      startDate: '2023',
      isCurrent: true,
      bio: 'Inspector General of Punjab Police'
    }
  ],
  'Pakistan Anti Narcotics Force': [
    {
      name: 'Abdul Jabbar Khattak',
      position: 'Director General',
      rank: 'Major General',
      startDate: '2023',
      isCurrent: true,
      bio: 'Director General of Anti-Narcotics Force'
    }
  ],
}

async function main() {
  console.log('👥 Updating organization personnel...\n')

  // Get all organizations
  const allOrgs = await prisma.organization.findMany({
    orderBy: { name: 'asc' },
    include: {
      personnel: true
    }
  })

  console.log(`Found ${allOrgs.length} organizations\n`)

  let added = 0
  let skipped = 0
  let notFound = 0

  for (const org of allOrgs) {
    const personnelData = personnelMap[org.name]

    if (!personnelData || personnelData.length === 0) {
      notFound++
      continue
    }

    console.log(`\n📋 ${org.name} (${org.country})`)

    for (const person of personnelData) {
      // Check if personnel already exists
      const existing = org.personnel.find(
        p => p.name === person.name && p.position === person.position
      )

      if (existing) {
        console.log(`  ⏭️  ${person.name} - ${person.position} (already exists)`)
        skipped++
        continue
      }

      // Add new personnel
      await prisma.personnel.create({
        data: {
          organizationId: org.id,
          ...person
        }
      })

      console.log(`  ✅ ${person.name} - ${person.position}`)
      added++
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('📊 Summary:')
  console.log(`  ✅ Added: ${added} personnel`)
  console.log(`  ⏭️  Skipped (already exists): ${skipped}`)
  console.log(`  ❓ Organizations without data: ${notFound}`)
  console.log('='.repeat(60))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
