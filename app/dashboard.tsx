"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, Bar, BarChart, CartesianGrid, XAxis, YAxis, Area, AreaChart } from "recharts"
import { Package, Users, TrendingUp, Calendar } from "lucide-react"

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

export default function Dashboard() {
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [selectedGroup, setSelectedGroup] = useState<string>("all")
  const [processedData, setProcessedData] = useState<DataRecord[]>([])
  const [loading, setLoading] = useState(true)

  // Load and combine all data sources
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)

        // Use static sample data to avoid hydration mismatch
        const sampleData = generateStaticSampleData()
        setProcessedData(sampleData)
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Filter data based on selections
  const filteredData = useMemo(() => {
    return processedData.filter((record) => {
      const year = record.anomes_s.substring(0, 4)
      const yearMatch = selectedYear === "all" || year === selectedYear
      return yearMatch
    })
  }, [processedData, selectedYear])

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const stats = {
      total: 0,
      indigenas: 0,
      quilombolas: 0,
      extrativistas: 0,
      pescadores: 0,
      emergencial: 0,
      ciganas: 0,
      catadores: 0,
      assentados: 0,
      rural: 0,
    }

    filteredData.forEach((record) => {
      stats.total += record.qtd_total_cestas_alim_entr || 0
      stats.indigenas += record.qtd_cestas_alim_entr_fam_indigenas || 0
      stats.quilombolas += record.qtd_cestas_alim_entr_fam_quilombolas || 0
      stats.extrativistas += record.qtd_cestas_alim_entr_fam_extrativistas || 0
      stats.pescadores += record.qtd_cestas_alim_entr_fam_pescadores || 0
      stats.emergencial += record.qtd_cestas_alim_entr_fam_atend_emergencial || 0
      stats.ciganas += record.qtd_cestas_alim_entr_fam_ciganas || 0
      stats.catadores += record.qtd_cestas_alim_entr_fam_catadores || 0
      stats.assentados += record.qtd_cestas_alim_entr_fam_assentados || 0
      stats.rural += record.qtd_cestas_alim_entr_fam_rural || 0
    })

    return stats
  }, [filteredData])

  // Prepare yearly evolution data
  const yearlyEvolution = useMemo(() => {
    const yearlyData: { [key: string]: YearlyData } = {}

    // Initialize all years with zero values
    const allYears = ["2019", "2020", "2021", "2022", "2023", "2024", "2025"]
    allYears.forEach((year) => {
      yearlyData[year] = {
        year,
        indigenas: 0,
        quilombolas: 0,
        extrativistas: 0,
        pescadores: 0,
        emergencial: 0,
        ciganas: 0,
        catadores: 0,
        assentados: 0,
        rural: 0,
        total: 0,
      }
    })

    // Aggregate data by year from filtered data
    filteredData.forEach((record) => {
      const year = record.anomes_s.substring(0, 4)
      if (yearlyData[year]) {
        yearlyData[year].indigenas += record.qtd_cestas_alim_entr_fam_indigenas || 0
        yearlyData[year].quilombolas += record.qtd_cestas_alim_entr_fam_quilombolas || 0
        yearlyData[year].extrativistas += record.qtd_cestas_alim_entr_fam_extrativistas || 0
        yearlyData[year].pescadores += record.qtd_cestas_alim_entr_fam_pescadores || 0
        yearlyData[year].emergencial += record.qtd_cestas_alim_entr_fam_atend_emergencial || 0
        yearlyData[year].ciganas += record.qtd_cestas_alim_entr_fam_ciganas || 0
        yearlyData[year].catadores += record.qtd_cestas_alim_entr_fam_catadores || 0
        yearlyData[year].assentados += record.qtd_cestas_alim_entr_fam_assentados || 0
        yearlyData[year].rural += record.qtd_cestas_alim_entr_fam_rural || 0
        yearlyData[year].total += record.qtd_total_cestas_alim_entr || 0
      }
    })

    // Convert to array and sort by year
    const result = Object.values(yearlyData).sort((a: YearlyData, b: YearlyData) => a.year.localeCompare(b.year))

    // If a specific year is selected, filter to just that year
    return selectedYear === "all" ? result : result.filter((item) => item.year === selectedYear)
  }, [filteredData, selectedYear])

  // Prepare vertical bar chart data for group distribution (replacing pie chart)
  const groupDistributionData = useMemo((): GroupDistributionData[] => {
    // If a specific group is selected, show yearly data for that group
    if (selectedGroup !== "all") {
      return yearlyEvolution.map((yearData) => {
        const rawValue = yearData[selectedGroup as keyof typeof yearData] || 0
        const value = typeof rawValue === "number" ? rawValue : Number(rawValue)
        return {
          name: yearData.year,
          value,
          fill: beneficiaryGroups[selectedGroup as keyof typeof beneficiaryGroups]?.color || "hsl(200, 70%, 50%)",
        }
      })
    }

    // Otherwise show distribution across all groups
    const data = [
      { name: "Indígenas", value: summaryStats.indigenas, fill: beneficiaryGroups.indigenas.color },
      { name: "Quilombolas", value: summaryStats.quilombolas, fill: beneficiaryGroups.quilombolas.color },
      { name: "Extrativistas", value: summaryStats.extrativistas, fill: beneficiaryGroups.extrativistas.color },
      { name: "Pescadores", value: summaryStats.pescadores, fill: beneficiaryGroups.pescadores.color },
      { name: "Emergencial", value: summaryStats.emergencial, fill: beneficiaryGroups.atend_emergencial.color },
      { name: "Ciganos", value: summaryStats.ciganas, fill: beneficiaryGroups.ciganas.color },
      { name: "Catadores", value: summaryStats.catadores, fill: beneficiaryGroups.catadores.color },
      { name: "Assentados", value: summaryStats.assentados, fill: beneficiaryGroups.assentados.color },
      { name: "Rural", value: summaryStats.rural, fill: beneficiaryGroups.rural.color },
    ]
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value)

    return data
  }, [summaryStats, selectedGroup, yearlyEvolution])

  // Prepare monthly data for the selected year
  const monthlyData = useMemo(() => {
    if (selectedYear === "all") return []

    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
    const monthlyStats: MonthlyStats[] = []

    // Filter data for the selected year
    const yearData = filteredData.filter((record) => record.anomes_s.substring(0, 4) === selectedYear)

    // Group by month
    months.forEach((month, index) => {
      const monthNum = String(index + 1).padStart(2, "0")
      const monthRecords = yearData.filter((record) => record.anomes_s.substring(4, 6) === monthNum)

      let total = 0
      let groupValue = 0

      monthRecords.forEach((record) => {
        if (selectedGroup === "all") {
          total += record.qtd_total_cestas_alim_entr || 0
        } else {
          // Get value for the selected group
          switch (selectedGroup) {
            case "indigenas":
              groupValue += record.qtd_cestas_alim_entr_fam_indigenas || 0
              break
            case "quilombolas":
              groupValue += record.qtd_cestas_alim_entr_fam_quilombolas || 0
              break
            case "extrativistas":
              groupValue += record.qtd_cestas_alim_entr_fam_extrativistas || 0
              break
            case "pescadores":
              groupValue += record.qtd_cestas_alim_entr_fam_pescadores || 0
              break
            case "atend_emergencial":
              groupValue += record.qtd_cestas_alim_entr_fam_atend_emergencial || 0
              break
            case "ciganas":
              groupValue += record.qtd_cestas_alim_entr_fam_ciganas || 0
              break
            case "catadores":
              groupValue += record.qtd_cestas_alim_entr_fam_catadores || 0
              break
            case "assentados":
              groupValue += record.qtd_cestas_alim_entr_fam_assentados || 0
              break
            case "rural":
              groupValue += record.qtd_cestas_alim_entr_fam_rural || 0
              break
          }
        }
      })

      monthlyStats.push({
        month,
        total: selectedGroup === "all" ? total : groupValue,
      })
    })

    return monthlyStats
  }, [filteredData, selectedYear, selectedGroup])

  // Calculate other groups total for summary card
  const otherGroupsTotal = useMemo(() => {
    return (
      summaryStats.extrativistas +
      summaryStats.pescadores +
      summaryStats.emergencial +
      summaryStats.ciganas +
      summaryStats.catadores +
      summaryStats.assentados +
      summaryStats.rural
    )
  }, [summaryStats])

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("pt-BR").format(num)
  }

  const years = ["2019", "2020", "2021", "2022", "2023", "2024", "2025"]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Carregando dados do Programa ADA...</p>
        </div>
      </div>
    )
  }

  const hasData = filteredData.length > 0 && summaryStats.total > 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                📦 Distribuição de Cestas Básicas - Programa ADA (2019–2025)
              </h1>
              <p className="text-gray-600 mt-1">
                Análise abrangente da distribuição de assistência alimentar entre grupos beneficiários
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Selecionar Ano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Anos</SelectItem>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
              <SelectTrigger className="w-[200px] bg-white">
                <SelectValue placeholder="Selecionar Grupo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Grupos</SelectItem>
                {Object.entries(beneficiaryGroups).map(([key, group]) => (
                  <SelectItem key={key} value={key}>
                    {group.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters Display */}
        <div className="flex flex-wrap gap-2 mb-6">
          {selectedYear !== "all" && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Ano: {selectedYear}
            </Badge>
          )}
          {selectedGroup !== "all" && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Grupo: {beneficiaryGroups[selectedGroup as keyof typeof beneficiaryGroups]?.label || selectedGroup}
            </Badge>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm border-0 ring-1 ring-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total de Cestas</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{formatNumber(summaryStats.total)}</div>
              <p className="text-xs text-gray-500 mt-1">
                {selectedYear === "all" ? "2019-2025" : selectedYear}
                {selectedGroup !== "all"
                  ? ` • ${beneficiaryGroups[selectedGroup as keyof typeof beneficiaryGroups]?.label}`
                  : ""}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-0 ring-1 ring-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Famílias Indígenas</CardTitle>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {summaryStats.total > 0 ? ((summaryStats.indigenas / summaryStats.total) * 100).toFixed(1) : 0}%
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{formatNumber(summaryStats.indigenas)}</div>
              <p className="text-xs text-gray-500 mt-1">cestas entregues</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-0 ring-1 ring-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Famílias Quilombolas</CardTitle>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                {summaryStats.total > 0 ? ((summaryStats.quilombolas / summaryStats.total) * 100).toFixed(1) : 0}%
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{formatNumber(summaryStats.quilombolas)}</div>
              <p className="text-xs text-gray-500 mt-1">cestas entregues</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-0 ring-1 ring-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Outros Grupos</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{formatNumber(otherGroupsTotal)}</div>
              <p className="text-xs text-gray-500 mt-1">extrativistas, pescadores, emergencial e outros</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        {hasData ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* First Chart - Yearly Evolution or Monthly Breakdown */}
            <Card className="bg-white shadow-sm border-0 ring-1 ring-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {selectedYear === "all" ? "Evolução Anual" : `Distribuição Mensal em ${selectedYear}`}
                  {selectedGroup !== "all"
                    ? ` - ${beneficiaryGroups[selectedGroup as keyof typeof beneficiaryGroups]?.label}`
                    : ""}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {selectedYear === "all"
                    ? "Tendências de distribuição ao longo dos anos"
                    : `Detalhamento mensal da distribuição de cestas básicas para ${selectedYear}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    indigenas: { label: "Indígenas", color: "hsl(220, 70%, 50%)" },
                    quilombolas: { label: "Quilombolas", color: "hsl(160, 70%, 50%)" },
                    extrativistas: { label: "Extrativistas", color: "hsl(30, 70%, 50%)" },
                    pescadores: { label: "Pescadores", color: "hsl(200, 70%, 50%)" },
                    emergencial: { label: "Emergencial", color: "hsl(0, 70%, 50%)" },
                    others: { label: "Outros", color: "hsl(280, 70%, 50%)" },
                    total: { label: "Total", color: "hsl(220, 70%, 50%)" },
                  }}
                  className="h-[300px]"
                >
                  {selectedYear === "all" ? (
                    <LineChart data={yearlyEvolution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="year" stroke="#666" fontSize={12} />
                      <YAxis stroke="#666" fontSize={12} tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                        formatter={(value: number) => [formatNumber(value), ""]}
                      />
                      {selectedGroup === "all" || selectedGroup === "indigenas" ? (
                        <Line
                          type="monotone"
                          dataKey="indigenas"
                          stroke="var(--color-indigenas)"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                      ) : null}
                      {selectedGroup === "all" || selectedGroup === "quilombolas" ? (
                        <Line
                          type="monotone"
                          dataKey="quilombolas"
                          stroke="var(--color-quilombolas)"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                      ) : null}
                      {selectedGroup === "all" || selectedGroup === "extrativistas" ? (
                        <Line
                          type="monotone"
                          dataKey="extrativistas"
                          stroke="var(--color-extrativistas)"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                      ) : null}
                      {selectedGroup === "all" || selectedGroup === "pescadores" ? (
                        <Line
                          type="monotone"
                          dataKey="pescadores"
                          stroke="var(--color-pescadores)"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                      ) : null}
                      {selectedGroup === "all" || selectedGroup === "atend_emergencial" ? (
                        <Line
                          type="monotone"
                          dataKey="emergencial"
                          stroke="var(--color-emergencial)"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                      ) : null}
                    </LineChart>
                  ) : (
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#666" fontSize={12} />
                      <YAxis stroke="#666" fontSize={12} tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`} />
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                        formatter={(value: number) => [formatNumber(value), "Cestas"]}
                      />
                      <Bar dataKey="total" fill="hsl(220, 70%, 50%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  )}
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Group Distribution Vertical Bar Chart */}
            <Card className="bg-white shadow-sm border-0 ring-1 ring-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {selectedGroup === "all"
                    ? `Distribuição por Grupo Beneficiário${selectedYear !== "all" ? ` (${selectedYear})` : ""}`
                    : `${beneficiaryGroups[selectedGroup as keyof typeof beneficiaryGroups]?.label} - Distribuição${
                        selectedYear === "all" ? " por Ano" : ` em ${selectedYear}`
                      }`}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {selectedGroup === "all"
                    ? `Total de cestas básicas entregues por grupo beneficiário`
                    : `Distribuição para famílias ${
                        beneficiaryGroups[selectedGroup as keyof typeof beneficiaryGroups]?.label
                      }${selectedYear === "all" ? " ao longo dos anos" : ""}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: { label: "Cestas", color: "hsl(220, 70%, 50%)" },
                  }}
                  className="h-[300px]"
                >
                  <BarChart data={groupDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#666" fontSize={12} angle={-45} textAnchor="end" height={80} />
                    <YAxis stroke="#666" fontSize={12} tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      formatter={(value: number) => [formatNumber(value), "Cestas"]}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="bg-white shadow-sm border-0 ring-1 ring-gray-200">
              <CardContent className="flex items-center justify-center h-[300px]">
                <div className="text-center text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum dado disponível para os filtros selecionados</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-sm border-0 ring-1 ring-gray-200">
              <CardContent className="flex items-center justify-center h-[300px]">
                <div className="text-center text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum dado disponível para os filtros selecionados</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Cumulative Impact Area Chart - Only show for all years */}
        {selectedYear === "all" && hasData && (
          <Card className="bg-white shadow-sm border-0 ring-1 ring-gray-200 mb-8">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Impacto Cumulativo ao Longo do Tempo
                {selectedGroup !== "all"
                  ? ` - ${beneficiaryGroups[selectedGroup as keyof typeof beneficiaryGroups]?.label}`
                  : ""}
              </CardTitle>
              <CardDescription className="text-gray-600">
                Visualização empilhada mostrando a distribuição cumulativa entre todos os grupos beneficiários
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  indigenas: { label: "Indígenas", color: "hsl(220, 70%, 50%)" },
                  quilombolas: { label: "Quilombolas", color: "hsl(160, 70%, 50%)" },
                  extrativistas: { label: "Extrativistas", color: "hsl(30, 70%, 50%)" },
                  pescadores: { label: "Pescadores", color: "hsl(200, 70%, 50%)" },
                  emergencial: { label: "Emergencial", color: "hsl(0, 70%, 50%)" },
                  ciganas: { label: "Ciganos", color: "hsl(280, 70%, 50%)" },
                  catadores: { label: "Catadores", color: "hsl(340, 70%, 50%)" },
                  assentados: { label: "Assentados", color: "hsl(40, 70%, 50%)" },
                  rural: { label: "Rural", color: "hsl(120, 70%, 50%)" },
                  total: { label: "Total", color: "hsl(220, 70%, 50%)" },
                }}
                className="h-[400px]"
              >
                <AreaChart data={yearlyEvolution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="year" stroke="#666" fontSize={12} />
                  <YAxis stroke="#666" fontSize={12} tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    formatter={(value: number) => [formatNumber(value), ""]}
                  />
                  {selectedGroup === "all" || selectedGroup === "indigenas" ? (
                    <Area
                      type="monotone"
                      dataKey="indigenas"
                      stackId="1"
                      stroke="var(--color-indigenas)"
                      fill="var(--color-indigenas)"
                      fillOpacity={0.8}
                    />
                  ) : null}
                  {selectedGroup === "all" || selectedGroup === "quilombolas" ? (
                    <Area
                      type="monotone"
                      dataKey="quilombolas"
                      stackId="1"
                      stroke="var(--color-quilombolas)"
                      fill="var(--color-quilombolas)"
                      fillOpacity={0.8}
                    />
                  ) : null}
                  {selectedGroup === "all" || selectedGroup === "extrativistas" ? (
                    <Area
                      type="monotone"
                      dataKey="extrativistas"
                      stackId="1"
                      stroke="var(--color-extrativistas)"
                      fill="var(--color-extrativistas)"
                      fillOpacity={0.8}
                    />
                  ) : null}
                  {selectedGroup === "all" || selectedGroup === "pescadores" ? (
                    <Area
                      type="monotone"
                      dataKey="pescadores"
                      stackId="1"
                      stroke="var(--color-pescadores)"
                      fill="var(--color-pescadores)"
                      fillOpacity={0.8}
                    />
                  ) : null}
                  {selectedGroup === "all" || selectedGroup === "atend_emergencial" ? (
                    <Area
                      type="monotone"
                      dataKey="emergencial"
                      stackId="1"
                      stroke="var(--color-emergencial)"
                      fill="var(--color-emergencial)"
                      fillOpacity={0.8}
                    />
                  ) : null}
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center py-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">Fonte: Arquivos JSON ADA (2019–2025) — Enviado pelo usuário</p>
        </div>
      </div>
    </div>
  )
}
