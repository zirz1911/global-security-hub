import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./dev.db'
})

const prisma = new PrismaClient({ adapter })

// Website mapping for known organizations
const websiteMap: Record<string, string> = {
  // United States
  'FBI': 'https://www.fbi.gov',
  'CIA': 'https://www.cia.gov',
  'NSA': 'https://www.nsa.gov',
  'DEA': 'https://www.dea.gov',
  'U.S. Secret Service': 'https://www.secretservice.gov',
  'U.S. Department Homeland Security': 'https://www.dhs.gov',
  'U.S. Customs and Border Protection': 'https://www.cbp.gov',
  'ATF': 'https://www.atf.gov',
  'US Marshals': 'https://www.usmarshals.gov',
  'TSA': 'https://www.tsa.gov',
  'United States IRS': 'https://www.irs.gov',
  'U.S. Air Force': 'https://www.af.mil',
  'U.S. Armed Forces': 'https://www.defense.gov',

  // United Kingdom
  'MI5': 'https://www.mi5.gov.uk',
  'MI6': 'https://www.sis.gov.uk',
  'GCHQ': 'https://www.gchq.gov.uk',
  'Metropolitan Police': 'https://www.met.police.uk',
  'National Crime Agency': 'https://www.nationalcrimeagency.gov.uk',

  // International
  'INTERPOL': 'https://www.interpol.int',
  'Europol': 'https://www.europol.europa.eu',

  // Canada
  'Royal Canadian Mounted Police': 'https://www.rcmp-grc.gc.ca',
  'CSIS': 'https://www.canada.ca/en/security-intelligence-service.html',

  // Australia
  'AFP': 'https://www.afp.gov.au',
  'ASIO': 'https://www.asio.gov.au',
  'ASIS': 'https://www.asis.gov.au',
  'New Zealand Defence Force': 'https://www.nzdf.mil.nz',

  // France
  'DGSE': 'https://www.defense.gouv.fr/dgse',
  'DGSI': 'https://www.interieur.gouv.fr/dgsi',
  'Police Nationale': 'https://www.police-nationale.interieur.gouv.fr',

  // Germany
  'BND': 'https://www.bnd.bund.de',
  'BfV': 'https://www.verfassungsschutz.de',
  'Bundeskriminalamt': 'https://www.bka.de',

  // Israel
  'Mossad': 'https://www.gov.il/en/departments/mossad',
  'Shin Bet': 'https://www.shabak.gov.il',

  // Russia
  'FSB': 'https://www.fsb.ru',
  'SVR': 'https://www.svr.gov.ru',

  // China
  'MSS': 'https://www.gov.cn',
  'Hong Kong Customs': 'https://www.customs.gov.hk',

  // India
  'Government of India': 'https://www.india.gov.in',
  'India Ministry Home Affairs': 'https://www.mha.gov.in',
  'CBI': 'https://www.cbi.gov.in',

  // Japan
  'PSIA': 'https://www.moj.go.jp/psia',

  // Thailand
  'Royal Thai Police': 'https://www.royalthaipolice.go.th',
  'Thailand Narcotics Control Board': 'https://www.oncb.go.th',

  // Singapore
  'Singapore Ministry Home Affairs': 'https://www.mha.gov.sg',
  'Singapore Police': 'https://www.police.gov.sg',
  'Singapore Ministry Defence': 'https://www.mindef.gov.sg',
  'Singapore Inland Revenue Authority': 'https://www.iras.gov.sg',
  'Singapore Prison Service': 'https://www.sps.gov.sg',

  // Malaysia
  'Malaysia Royal Police': 'https://www.rmp.gov.my',
  'Royal Malaysia Police': 'https://www.rmp.gov.my',
  'Petronas': 'https://www.petronas.com',
  'Telekom Malaysia': 'https://www.tm.com.my',
  'Malaysia Communication Commission': 'https://www.mcmc.gov.my',
  'Malaysia Prime Minister': 'https://www.pmo.gov.my',
  'Malaysia Ministry Defence': 'https://www.mod.gov.my',
  'Royal Malaysia Air Force': 'https://www.airforce.mil.my',

  // Netherlands
  'Netherlands Police': 'https://www.politie.nl',
  'AIVD': 'https://www.aivd.nl',
  'MIVD': 'https://www.defensie.nl/organisatie/mivd',

  // Spain
  'CNI': 'https://www.cni.es',

  // Italy
  'Italy Carabinieri': 'https://www.carabinieri.it',
  'Italia Polizia': 'https://www.poliziadistato.it',
  'Italy Trade Agency': 'https://www.ice.it',

  // Turkey
  'Turkish Telecom Agency': 'https://www.btk.gov.tr',

  // UAE
  'Dubai Police': 'https://www.dubaipolice.gov.ae',

  // Saudi Arabia
  'Saudi Arabia Ministry Interior': 'https://www.moi.gov.sa',
  'Saudi Arabia Ministry Defence': 'https://www.mod.gov.sa',

  // South Korea
  'Korea National Police Agency': 'https://www.police.go.kr',

  // Pakistan
  'Pakistan Police': 'https://www.police.gov.pk',
  'Islamabad Police': 'https://www.islamabadpolice.gov.pk',
  'Pakistan Ministry Defence': 'https://www.mod.gov.pk',
  'Punjab Pakistan Police': 'https://www.punjabpolice.gov.pk',
  'Pakistan Anti Narcotics Force': 'https://www.anf.gov.pk',

  // Indonesia
  'Indonesia National Police': 'https://www.polri.go.id',

  // Philippines
  'Philippines National Police': 'https://www.pnp.gov.ph',
  'Philippines Drug Enforcement': 'https://www.pdea.gov.ph',

  // South Africa
  'SAPS': 'https://www.saps.gov.za',
  'South Africa Security Service': 'https://www.ssa.gov.za',

  // Kenya
  'Kenya National Crime Center': 'https://www.nationalpolice.go.ke',

  // Nigeria
  'Nigeria Drug Law Enforcement': 'https://www.ndlea.gov.ng',

  // Tanzania
  'Tanzania Police Force': 'https://www.polisi.go.tz',

  // Romania
  'Romania Ministry Interior': 'https://www.mai.gov.ro',

  // Taiwan
  'Taiwan Ministry of Justice': 'https://www.moj.gov.tw',

  // Maldives
  'Maldives Police': 'https://www.police.gov.mv',

  // Royal Oman Police
  'Royal Oman Police': 'https://www.rop.gov.om',
}

async function main() {
  console.log('🌐 Updating organization websites...\n')

  const allOrgs = await prisma.organization.findMany({
    orderBy: { name: 'asc' },
  })

  console.log(`Found ${allOrgs.length} organizations\n`)

  let updated = 0
  let skipped = 0
  let notFound = 0

  for (const org of allOrgs) {
    // Skip if already has website
    if (org.website && org.website.trim() !== '') {
      skipped++
      continue
    }

    // Try to find matching website
    let websiteUrl: string | null = null

    // Exact match
    if (websiteMap[org.name]) {
      websiteUrl = websiteMap[org.name]
    } else {
      // Partial match
      for (const [key, url] of Object.entries(websiteMap)) {
        if (org.name.includes(key) || key.includes(org.name)) {
          websiteUrl = url
          break
        }
      }
    }

    if (websiteUrl) {
      await prisma.organization.update({
        where: { id: org.id },
        data: { website: websiteUrl },
      })
      console.log(`✅ ${org.name} → ${websiteUrl}`)
      updated++
    } else {
      notFound++
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('📊 Summary:')
  console.log(`  ✅ Updated: ${updated}`)
  console.log(`  ⏭️  Skipped (already has website): ${skipped}`)
  console.log(`  ❓ Not found: ${notFound}`)
  console.log('='.repeat(60))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
