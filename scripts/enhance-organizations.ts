import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./dev.db'
})

const prisma = new PrismaClient({ adapter })

interface OrgEnhancement {
  fullName?: string
  description?: string
  website?: string
  email?: string
  phone?: string
  address?: string
  established?: string
}

// Enhanced data for major organizations
const enhancementMap: Record<string, OrgEnhancement> = {
  'FBI United States': {
    fullName: 'Federal Bureau of Investigation',
    description: 'The FBI is the domestic intelligence and security service of the United States and its principal federal law enforcement agency. Operating under the jurisdiction of the United States Department of Justice, the FBI is also a member of the U.S. Intelligence Community.',
    website: 'https://www.fbi.gov',
    email: 'info@fbi.gov',
    phone: '+1-202-324-3000',
    address: '935 Pennsylvania Avenue NW, Washington, D.C. 20535, United States',
    established: '1908'
  },
  'CIA': {
    fullName: 'Central Intelligence Agency',
    description: 'The Central Intelligence Agency is a civilian foreign intelligence service of the federal government of the United States, tasked with gathering, processing, and analyzing national security information from around the world.',
    website: 'https://www.cia.gov',
    phone: '+1-703-482-0623',
    address: '1000 Colonial Farm Road, McLean, Virginia 22101, United States',
    established: '1947'
  },
  'INTERPOL': {
    fullName: 'International Criminal Police Organization',
    description: 'INTERPOL is an international organization facilitating international police cooperation. It enables police in member countries to work together to make the world a safer place. With 195 member countries, INTERPOL is the world\'s largest international police organization.',
    website: 'https://www.interpol.int',
    email: 'osg@interpol.int',
    phone: '+33-4-72-44-70-00',
    address: '200 Quai Charles de Gaulle, 69006 Lyon, France',
    established: '1923'
  },
  'MI5': {
    fullName: 'Security Service',
    description: 'MI5 is the United Kingdom\'s domestic counter-intelligence and security agency. Its remit includes the protection of UK parliamentary democracy and economic interests, and counter-terrorism and counter-espionage activities.',
    website: 'https://www.mi5.gov.uk',
    address: 'Thames House, Millbank, London SW1P 1AE, United Kingdom',
    established: '1909'
  },
  'MI6': {
    fullName: 'Secret Intelligence Service',
    description: 'MI6 is the foreign intelligence service of the United Kingdom, tasked mainly with the covert overseas collection and analysis of human intelligence in support of the UK\'s national security.',
    website: 'https://www.sis.gov.uk',
    address: '85 Vauxhall Cross, London SE1 7TP, United Kingdom',
    established: '1909'
  },
  'Royal Canadian Mounted Police': {
    fullName: 'Royal Canadian Mounted Police / Gendarmerie royale du Canada',
    description: 'The RCMP is both a federal and a national police force of Canada. The RCMP provides law enforcement at the federal level. It also provides provincial policing in eight provinces and local policing on contract basis in the three territories and more than 150 municipalities.',
    website: 'https://www.rcmp-grc.gc.ca',
    email: 'webadmin@rcmp-grc.gc.ca',
    phone: '+1-613-993-7267',
    address: '73 Leikin Drive, Ottawa, Ontario K1A 0R2, Canada',
    established: '1873'
  },
  'AFP': {
    fullName: 'Australian Federal Police',
    description: 'The AFP is a progressive and multi-faceted law enforcement agency that polices at a federal level, investigating crimes against the Commonwealth as well as crimes of a complex, transnational nature.',
    website: 'https://www.afp.gov.au',
    email: 'national.media@afp.gov.au',
    phone: '+61-2-6275-6666',
    address: 'GPO Box 401, Canberra ACT 2601, Australia',
    established: '1979'
  },
  'Singapore Ministry Home Affairs': {
    fullName: 'Ministry of Home Affairs, Singapore',
    description: 'The Ministry of Home Affairs oversees the internal security, law and order of Singapore. MHA works closely with its agencies to ensure the safety and security of Singapore, and also leads in policy formulation, legislation and coordination.',
    website: 'https://www.mha.gov.sg',
    email: 'mha_feedback@mha.gov.sg',
    phone: '+65-6355-2222',
    address: 'New Phoenix Park, 28 Irrawaddy Road, Singapore 329560',
    established: '1959'
  },
  'Malaysia Royal Police': {
    fullName: 'Royal Malaysia Police / Polis Diraja Malaysia',
    description: 'The Royal Malaysia Police is a federal police force responsible for law enforcement in Malaysia. The force is a centralized organization, and its headquarters is located in Bukit Aman, Kuala Lumpur.',
    website: 'https://www.rmp.gov.my',
    email: 'pro_kpn@rmp.gov.my',
    phone: '+60-3-2266-2222',
    address: 'Bukit Aman, 50560 Kuala Lumpur, Malaysia',
    established: '1807'
  },
  'Indonesia National Police': {
    fullName: 'Kepolisian Negara Republik Indonesia',
    description: 'The Indonesian National Police is the national law enforcement agency of Indonesia. The police force has about 440,000 sworn members and is organized into provincial and district commands.',
    website: 'https://www.polri.go.id',
    email: 'humas@polri.go.id',
    phone: '+62-21-721-8012',
    address: 'Jalan Trunojoyo No.3, Jakarta Selatan 12110, Indonesia',
    established: '1946'
  },
  'Royal Thai Police': {
    fullName: 'Royal Thai Police / สำนักงานตำรวจแห่งชาติ',
    description: 'The Royal Thai Police is the national police force of Thailand. It falls under the jurisdiction of the Ministry of Interior and is commanded by the Commissioner-General of the Royal Thai Police.',
    website: 'https://www.royalthaipolice.go.th',
    phone: '+66-2-251-5151',
    address: '1 Rama 1 Road, Pathum Wan, Bangkok 10330, Thailand',
    established: '1915'
  },
  'Korea National Police Agency': {
    fullName: 'Korean National Police Agency / 대한민국 경찰청',
    description: 'The Korean National Police Agency is a centralized national police force in South Korea. It is under the jurisdiction of the Ministry of the Interior and Safety.',
    website: 'https://www.police.go.kr',
    phone: '+82-2-3150-2011',
    address: '97 Tongil-ro, Seodaemun-gu, Seoul 03739, South Korea',
    established: '1945'
  },
  'Philippines National Police': {
    fullName: 'Philippine National Police / Pambansang Pulisya ng Pilipinas',
    description: 'The PNP is the armed national police force in the Philippines. It is administered and controlled by the National Police Commission and is part of the Department of the Interior and Local Government.',
    website: 'https://www.pnp.gov.ph',
    email: 'didm@pnp.gov.ph',
    phone: '+63-2-8723-0401',
    address: 'Camp Crame, Quezon City, Metro Manila, Philippines',
    established: '1991'
  },
  'India Ministry Home Affairs': {
    fullName: 'Ministry of Home Affairs, Government of India',
    description: 'The Ministry of Home Affairs is responsible for the maintenance of internal security and domestic policy of India. It controls and supervises central police forces and provides policy and support to state governments.',
    website: 'https://www.mha.gov.in',
    email: 'mhapublic.grievance@nic.in',
    phone: '+91-11-2309-2462',
    address: 'North Block, Central Secretariat, New Delhi 110001, India',
    established: '1947'
  },
  'Hong Kong Customs Department': {
    fullName: 'Hong Kong Customs and Excise Department',
    description: 'Hong Kong Customs is responsible for customs control, excise duties, trade controls, consumer protection, intellectual property rights protection, and drug investigation in Hong Kong.',
    website: 'https://www.customs.gov.hk',
    email: 'enquiry@customs.gov.hk',
    phone: '+852-2815-7711',
    address: 'Customs Headquarters Building, 222 Java Road, North Point, Hong Kong',
    established: '1909'
  },
  'Mossad': {
    fullName: 'Institute for Intelligence and Special Operations',
    description: 'Mossad is responsible for intelligence collection, covert operations, and counter-terrorism. Its director reports directly to the Prime Minister of Israel.',
    website: 'https://www.gov.il/en/departments/mossad',
    address: 'Tel Aviv, Israel',
    established: '1949'
  },
  'FSB': {
    fullName: 'Federal Security Service of the Russian Federation',
    description: 'The FSB is the principal security agency of Russia and the main successor agency to the KGB. It is headquartered in Lubyanka Square in Moscow.',
    website: 'https://www.fsb.ru',
    address: 'Lubyanka Square, Moscow, Russia',
    established: '1995'
  },
  'Petronas': {
    fullName: 'Petroliam Nasional Berhad',
    description: 'Petronas is a Malaysian multinational oil and gas company. Established in 1974 and wholly owned by the Government of Malaysia, Petronas is one of the largest oil companies in the world.',
    website: 'https://www.petronas.com',
    email: 'enquiry@petronas.com',
    phone: '+60-3-2331-3000',
    address: 'Tower 1, Petronas Twin Towers, Kuala Lumpur City Centre, 50088 Kuala Lumpur, Malaysia',
    established: '1974'
  },
  'Telekom Malaysia': {
    fullName: 'Telekom Malaysia Berhad',
    description: 'TM is Malaysia\'s convergence champion and No. 1 connectivity provider. The Group offers a comprehensive suite of communications services and solutions in broadband, data and fixed-line.',
    website: 'https://www.tm.com.my',
    email: 'info@tm.com.my',
    phone: '+60-3-2240-1221',
    address: 'Menara TM, Jalan Pantai Baharu, 50672 Kuala Lumpur, Malaysia',
    established: '1984'
  },
  'Europol': {
    fullName: 'European Union Agency for Law Enforcement Cooperation',
    description: 'Europol is the European Union\'s law enforcement agency. It supports the 27 EU Member States in their fight against terrorism, cybercrime and other serious and organized forms of crime.',
    website: 'https://www.europol.europa.eu',
    email: 'info@europol.europa.eu',
    phone: '+31-70-302-5000',
    address: 'Eisenhowerlaan 73, 2517 KK The Hague, Netherlands',
    established: '1999'
  },
  'U.S. Department Homeland Security': {
    fullName: 'United States Department of Homeland Security',
    description: 'DHS is responsible for public security, comparable to the interior or home ministries of other countries. Its stated missions involve anti-terrorism, border security, immigration and customs, cyber security, and disaster prevention and management.',
    website: 'https://www.dhs.gov',
    email: 'feedback@hq.dhs.gov',
    phone: '+1-202-282-8000',
    address: 'Washington, D.C. 20528, United States',
    established: '2002'
  },
  'U.S. Secret Service': {
    fullName: 'United States Secret Service',
    description: 'The Secret Service has two distinct areas of responsibility: Financial Crimes including financial institution fraud, identity theft, counterfeiting, and computer fraud; and Protection of National Leaders including the President, Vice President, and their families.',
    website: 'https://www.secretservice.gov',
    phone: '+1-202-406-5708',
    address: '950 H Street NW, Washington, D.C. 20223, United States',
    established: '1865'
  },
  'U.S. Customs and Border Protection': {
    fullName: 'United States Customs and Border Protection',
    description: 'CBP is the largest federal law enforcement agency of the U.S. Department of Homeland Security and is the country\'s primary border control organization, charged with regulating and facilitating international trade, collecting import duties, and enforcing U.S. regulations.',
    website: 'https://www.cbp.gov',
    phone: '+1-877-227-5511',
    address: '1300 Pennsylvania Avenue NW, Washington, D.C. 20229, United States',
    established: '2003'
  },
  'Netherlands Police': {
    fullName: 'National Police Corps of the Netherlands / Politie',
    description: 'The National Police Corps is the national police force of the Netherlands. The force consists of ten regional units and a central unit for nation-wide police services.',
    website: 'https://www.politie.nl',
    phone: '+31-900-8844',
    address: 'Affourtitweg 10, 2992 CW Barendrecht, Netherlands',
    established: '2013'
  },
  'New Zealand Defence Force': {
    fullName: 'New Zealand Defence Force',
    description: 'The NZDF consists of three services: the Royal New Zealand Navy, the New Zealand Army and the Royal New Zealand Air Force. The NZDF is responsible for protecting New Zealand and its interests.',
    website: 'https://www.nzdf.mil.nz',
    email: 'info@nzdf.mil.nz',
    phone: '+64-4-496-0999',
    address: 'Defence House, 2-12 Aitken Street, Wellington 6011, New Zealand',
    established: '1990'
  },
}

async function main() {
  console.log('🔧 Enhancing organization data...\n')

  const allOrgs = await prisma.organization.findMany({
    orderBy: { name: 'asc' },
  })

  console.log(`Found ${allOrgs.length} organizations\n`)

  let updated = 0
  let skipped = 0

  for (const org of allOrgs) {
    const enhancement = enhancementMap[org.name]

    if (!enhancement) {
      skipped++
      continue
    }

    console.log(`📝 Updating: ${org.name}`)

    // Build update data
    const updateData: any = {}
    let changes: string[] = []

    if (enhancement.fullName && enhancement.fullName !== org.fullName) {
      updateData.fullName = enhancement.fullName
      changes.push('fullName')
    }
    if (enhancement.description && enhancement.description !== org.description) {
      updateData.description = enhancement.description
      changes.push('description')
    }
    if (enhancement.website && enhancement.website !== org.website) {
      updateData.website = enhancement.website
      changes.push('website')
    }
    if (enhancement.email && enhancement.email !== org.email) {
      updateData.email = enhancement.email
      changes.push('email')
    }
    if (enhancement.phone && enhancement.phone !== org.phone) {
      updateData.phone = enhancement.phone
      changes.push('phone')
    }
    if (enhancement.address && enhancement.address !== org.address) {
      updateData.address = enhancement.address
      changes.push('address')
    }
    if (enhancement.established && enhancement.established !== org.established) {
      updateData.established = enhancement.established
      changes.push('established')
    }

    if (Object.keys(updateData).length > 0) {
      await prisma.organization.update({
        where: { id: org.id },
        data: updateData
      })
      console.log(`  ✅ Updated: ${changes.join(', ')}`)
      updated++
    } else {
      console.log(`  ⏭️  No changes needed`)
      skipped++
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('📊 Summary:')
  console.log(`  ✅ Updated: ${updated} organizations`)
  console.log(`  ⏭️  Skipped: ${skipped} organizations`)
  console.log('='.repeat(60))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
