"use client"

import dynamic from "next/dynamic"

interface MonthlyStats {
  month: string
  total: number
}

interface YearlyData {
  year: string
  indigenas: number
  quilombolas: number
  extrativistas: number
  pescadores: number
  emergencial: number
  ciganas: number
  catadores: number
  assentados: number
  rural: number
  total: number
}

interface GroupDistributionData {
  name: string
  value: number
  fill: string
}

interface DataRecord {
  anomes_s: string
  codigo_ibge: string
  qtd_cestas_alim_entr_fam_indigenas?: number
  qtd_cestas_alim_entr_fam_quilombolas?: number
  qtd_cestas_alim_entr_fam_extrativistas?: number
  qtd_cestas_alim_entr_fam_pescadores?: number
  qtd_cestas_alim_entr_fam_atend_emergencial?: number
  qtd_cestas_alim_entr_fam_ciganas?: number
  qtd_cestas_alim_entr_fam_catadores?: number
  qtd_cestas_alim_entr_fam_assentados?: number
  qtd_cestas_alim_entr_fam_rural?: number
  qtd_total_cestas_alim_entr: number
}

const beneficiaryGroups = {
  indigenas: { label: "Indígenas", color: "hsl(220, 70%, 50%)" },
  quilombolas: { label: "Quilombolas", color: "hsl(160, 70%, 50%)" },
  extrativistas: { label: "Extrativistas", color: "hsl(30, 70%, 50%)" },
  pescadores: { label: "Pescadores", color: "hsl(200, 70%, 50%)" },
  atend_emergencial: { label: "Emergencial", color: "hsl(0, 70%, 50%)" },
  ciganas: { label: "Ciganos", color: "hsl(280, 70%, 50%)" },
  catadores: { label: "Catadores", color: "hsl(340, 70%, 50%)" },
  assentados: { label: "Assentados", color: "hsl(40, 70%, 50%)" },
  rural: { label: "Rural", color: "hsl(120, 70%, 50%)" },
}

// Static sample data to avoid hydration mismatch
const generateStaticSampleData = (): DataRecord[] => {
  const sampleData: DataRecord[] = []
  const years = ["2019", "2020", "2021", "2022", "2023", "2024", "2025"]
  const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]

  years.forEach((year, yearIndex) => {
    months.forEach((month, monthIndex) => {
      const baseAmount = 1000 + yearIndex * 500 + monthIndex * 50
      // Use deterministic values instead of Math.random()
      const variation = (yearIndex * 7 + monthIndex * 3) % 100

      sampleData.push({
        anomes_s: `${year}${month}`,
        codigo_ibge: "11",
        qtd_cestas_alim_entr_fam_indigenas: Math.floor(baseAmount * 0.4 + variation * 2),
        qtd_cestas_alim_entr_fam_quilombolas: Math.floor(baseAmount * 0.3 + variation * 1.5),
        qtd_cestas_alim_entr_fam_extrativistas: Math.floor(baseAmount * 0.1 + variation),
        qtd_cestas_alim_entr_fam_pescadores: Math.floor(baseAmount * 0.1 + variation * 0.8),
        qtd_cestas_alim_entr_fam_atend_emergencial: Math.floor(baseAmount * 0.05 + variation * 0.5),
        qtd_cestas_alim_entr_fam_ciganas: Math.floor(baseAmount * 0.02 + variation * 0.2),
        qtd_cestas_alim_entr_fam_catadores: Math.floor(baseAmount * 0.02 + variation * 0.2),
        qtd_cestas_alim_entr_fam_assentados: Math.floor(baseAmount * 0.01 + variation * 0.1),
        qtd_cestas_alim_entr_fam_rural: Math.floor(baseAmount * 0.01 + variation * 0.1),
        qtd_total_cestas_alim_entr: Math.floor(baseAmount + variation * 3),
      })
    })
  })

  return sampleData
}

const DashboardComponent = dynamic(() => import("./dashboard"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse">📦</div>
        <p className="text-gray-600">Carregando dados do Programa ADA...</p>
      </div>
    </div>
  ),
})

export default function Page() {
  return <DashboardComponent />
}
